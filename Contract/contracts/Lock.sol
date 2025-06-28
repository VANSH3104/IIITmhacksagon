// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract OptimizedFreelancing is Ownable, Pausable, ReentrancyGuard {
    
    // Enums
    enum JobStatus { Open, Assigned, Completed, Disputed, Cancelled }

    // Structs
    struct Application {
        address freelancer;
        string resume;
        uint256 bidAmount;
        uint256 timestamp;
    }

    struct Job {
        uint256 jobId;
        address client;
        string jobTitle;
        string description;
        uint256 price;
        JobStatus status;
        address freelancer;
        uint256 createdAt;
        uint256 completedAt;
        string workSubmissionUrl;
    }

    struct UserProfile {
        bool isClient;
        bool isFreelancer;
        string resume;
        uint256 reputation;  // 0-100
        uint256 completedJobs;
        uint256 createdAt;
        bool exists;
    }
    
    struct Dispute {
        uint256 jobId;
        address raisedBy;
        uint256 createdAt;
        bool resolved;
        uint256 votesForClient;
        uint256 votesForFreelancer;
    }

    // Compact message storage
    struct Message {
        address sender;
        uint40 timestamp;  // Reduced from uint256 (saves gas)
        string content;    // Keep as string for flexibility
    }

// Store only the most recent messages (adjust number based on needs)
    Message[100] public recentMessages;
    uint256 public messageCount;

// Event for real-time rendering
    event NewMessage(address indexed sender, uint256 indexed messageId, string content, uint256 timestamp);

    // Mappings
    mapping(uint256 => Job) public jobs;
    mapping(address => UserProfile) public users;
    mapping(uint256 => Application[]) public jobApplications;
    mapping(uint256 => mapping(address => bool)) public hasApplied;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => mapping(address => bool)) public disputeVotes;
    mapping(uint256 => mapping(address => mapping(address => bool))) public hasRated;

    // State variables
    uint256 private _jobCounter;
    uint256 private _userCounter;

    // Constants
    uint256 public constant DISPUTE_VOTING_PERIOD = 7 days;
    uint256 public constant MIN_REPUTATION_TO_VOTE = 20;
    uint256 public constant MAX_REPUTATION = 100;

    // Events - Existing
    event UserRegistered(address indexed user, bool isClient, bool isFreelancer);
    event UserProfileUpdated(address indexed user, string resume);
    event JobCreated(uint256 indexed jobId, address indexed client, string jobTitle, uint256 price);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer, uint256 bidAmount);
    event JobCompleted(uint256 indexed jobId);
    event FreelancerApplied(uint256 indexed jobId, address indexed freelancer, string resume, uint256 bidAmount);
    event JobCancelled(uint256 indexed jobId, address indexed client);
    event JobUpdated(uint256 indexed jobId, address indexed client, string newTitle, string newDescription);
    event DisputeRaised(uint256 indexed jobId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed jobId, bool freelancerWon);
    event VoteCasted(uint256 indexed jobId, address indexed voter, bool supportsFreelancer);
    event RatingGiven(uint256 indexed jobId, address indexed from, address indexed to, uint256 rating);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event JobStatusChanged(uint256 indexed jobId, JobStatus oldStatus, JobStatus newStatus);
    event UserReputationChanged(address indexed user, uint256 oldReputation, uint256 newReputation);
    event DisputeVotingEnded(uint256 indexed jobId, uint256 votesForClient, uint256 votesForFreelancer);
    event ApplicationsUpdated(uint256 indexed jobId, uint256 applicationsCount);
    event JobPriceUpdated(uint256 indexed jobId, uint256 oldPrice, uint256 newPrice);
    event UserJobCountUpdated(address indexed user, bool isClientJob, uint256 totalJobs);
    event UserCompletedJobsUpdated(address indexed freelancer, uint256 completedJobs);
    event DisputeVoteCounted(uint256 indexed jobId, bool supportsFreelancer, uint256 newTotalVotes);

    /**
     * @dev Constructor for the optimized freelancing contract
     */
    constructor() Ownable(msg.sender) {
        _jobCounter = 0;
        _userCounter = 0;
    }

    /**
     * @dev Modifier to check if a job exists
     */
    modifier jobExists(uint256 _jobId) {
        require(jobs[_jobId].jobId == _jobId, "Invalid job ID");
        _;
    }

    /**
     * @dev Modifier to check if a user is registered
     */
    modifier userExists(address _user) {
        require(users[_user].exists, "User not registered");
        _;
    }

    /**
     * @dev Register as a client, freelancer, or both
     * @param _isClient Whether user is registering as a client
     * @param _isFreelancer Whether user is registering as a freelancer
     * @param _resume Professional description (required for freelancers)
     */
    function registerUser(bool _isClient, bool _isFreelancer, string calldata _resume) 
        external 
        whenNotPaused 
        nonReentrant
    {
        require(!users[msg.sender].exists, "Already registered");
        require(_isClient || _isFreelancer, "Must be client or freelancer");
        
        if (_isFreelancer) {
            require(bytes(_resume).length > 0, "Freelancers must provide a resume");
        }
        
        users[msg.sender] = UserProfile({
            isClient: _isClient,
            isFreelancer: _isFreelancer,
            resume: _isFreelancer ? _resume : "",
            reputation: 50, // Start with neutral reputation
            completedJobs: 0,
            createdAt: block.timestamp,
            exists: true
        });
        
        _userCounter++;
        emit UserRegistered(msg.sender, _isClient, _isFreelancer);
    }

    /**
     * @dev Update user profile
     * @param _resume Updated professional description
     */
    /**
 * @dev Update user profile and roles while preserving existing resume if not provided
 * @param _isClient Whether user should be a client
 * @param _isFreelancer Whether user should be a freelancer
 * @param _resume New professional description (optional - keeps old if empty)
 */
function updateProfile(
    bool _isClient, 
    bool _isFreelancer, 
    string calldata _resume
) 
    external 
    userExists(msg.sender) 
    whenNotPaused
    nonReentrant
{
    require(_isClient || _isFreelancer, "Must be client or freelancer");
    
    // Handle role changes
    bool wasFreelancer = users[msg.sender].isFreelancer;
    bool becomingFreelancer = _isFreelancer;
    
    // If switching TO freelancer role
    if (becomingFreelancer && !wasFreelancer) {
        require(bytes(_resume).length > 0 || bytes(users[msg.sender].resume).length > 0, 
            "Freelancers must have a resume");
    }
    
    // Update resume if provided, otherwise keep existing
    if (bytes(_resume).length > 0) {
        users[msg.sender].resume = _resume;
    }
    
    // If switching FROM freelancer role, clear resume
    if (wasFreelancer && !becomingFreelancer) {
        users[msg.sender].resume = "";
    }
    
    // Update roles
    users[msg.sender].isClient = _isClient;
    users[msg.sender].isFreelancer = _isFreelancer;
    
    emit UserProfileUpdated(msg.sender, users[msg.sender].resume);
}
    /**
     * @dev Create a new job without escrowing funds
     * @param _title Job title
     * @param _description Job description
     * @param _price Job budget (for reference only)
     */
    function createJob(string calldata _title, string calldata _description, uint256 _price) 
        external 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        require(users[msg.sender].isClient, "Only clients can post jobs");
        require(_price > 0, "Price must be positive");
        require(bytes(_title).length > 0 && bytes(_title).length <= 100, "Invalid title length");
        require(bytes(_description).length > 0 && bytes(_description).length <= 2000, "Invalid description length");

        _jobCounter++;
        uint256 jobId = _jobCounter;
        
        jobs[jobId] = Job({
            jobId: jobId,
            client: msg.sender,
            jobTitle: _title,
            description: _description,
            price: _price,
            status: JobStatus.Open,
            freelancer: address(0),
            createdAt: block.timestamp,
            completedAt: 0,
            workSubmissionUrl: ""
        });

        clientJobs[msg.sender].push(jobId);
        
        emit JobCreated(jobId, msg.sender, _title, _price);
        emit UserJobCountUpdated(msg.sender, true, clientJobs[msg.sender].length);
    }

    /**
     * @dev Apply for a job with a bid amount
     * @param _jobId ID of the job to apply for
     * @param _resume Professional credentials/proposal
     * @param _bidAmount Proposed budget
     */
    function applyForJob(uint256 _jobId, string calldata _resume, uint256 _bidAmount) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        require(users[msg.sender].isFreelancer, "Only freelancers can apply");
        require(jobs[_jobId].status == JobStatus.Open, "Job not open");
        require(!hasApplied[_jobId][msg.sender], "Already applied");
        require(_bidAmount > 0 && _bidAmount <= jobs[_jobId].price, "Invalid bid amount");
        require(bytes(_resume).length > 0, "Resume cannot be empty");

        jobApplications[_jobId].push(Application({
            freelancer: msg.sender,
            resume: _resume,
            bidAmount: _bidAmount,
            timestamp: block.timestamp
        }));

        hasApplied[_jobId][msg.sender] = true;
        
        emit FreelancerApplied(_jobId, msg.sender, _resume, _bidAmount);
        emit ApplicationsUpdated(_jobId, jobApplications[_jobId].length);
    }

    /**
     * @dev Assign a job to a freelancer
     * @param _jobId ID of the job to assign
     * @param _freelancer Address of the freelancer to assign
     * @param _applicationIndex Index of the freelancer's application
     */
    function assignJob(uint256 _jobId, address _freelancer, uint256 _applicationIndex) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        userExists(_freelancer) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only job owner can assign");
        require(job.status == JobStatus.Open, "Job not open");
        require(users[_freelancer].isFreelancer, "Invalid freelancer");
        require(_applicationIndex < jobApplications[_jobId].length, "Invalid application index");
        require(jobApplications[_jobId][_applicationIndex].freelancer == _freelancer, "Freelancer mismatch");

        JobStatus oldStatus = job.status;
        uint256 oldPrice = job.price;
        
        job.freelancer = _freelancer;
        job.status = JobStatus.Assigned;
        uint256 bidAmount = jobApplications[_jobId][_applicationIndex].bidAmount;
        if (bidAmount > 0 && bidAmount < job.price) {
            job.price = bidAmount;
            emit JobPriceUpdated(_jobId, oldPrice, bidAmount);
        }
        
        freelancerJobs[_freelancer].push(_jobId);
        
        emit JobAssigned(_jobId, _freelancer, bidAmount);
        emit JobStatusChanged(_jobId, oldStatus, job.status);
        emit UserJobCountUpdated(_freelancer, false, freelancerJobs[_freelancer].length);
    }

    /**
     * @dev Mark a job as completed
     * @param _jobId ID of the job to mark as completed
     */
    function completeJob(uint256 _jobId, string calldata _workUrl) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(
            job.freelancer == msg.sender || job.client == msg.sender,
            "Only freelancer or client can complete"
        );
        require(job.status == JobStatus.Assigned, "Job not assigned");
        require(bytes(_workUrl).length > 0, "Work URL required");

        JobStatus oldStatus = job.status;
        
        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
         job.workSubmissionUrl = _workUrl;
        users[job.freelancer].completedJobs++;
        
        emit JobCompleted(_jobId);
        emit JobStatusChanged(_jobId, oldStatus, job.status);
        emit UserCompletedJobsUpdated(job.freelancer, users[job.freelancer].completedJobs);
    }

    /**
     * @dev Cancel an open job
     * @param _jobId ID of the job to cancel
     */
    function cancelJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only client can cancel");
        require(job.status == JobStatus.Open, "Job not cancellable");

        JobStatus oldStatus = job.status;
        job.status = JobStatus.Cancelled;
        
        emit JobCancelled(_jobId, msg.sender);
        emit JobStatusChanged(_jobId, oldStatus, job.status);
    }

    /**
     * @dev Raise a dispute for a job
     * @param _jobId ID of the job to dispute
     */
    function raiseDispute(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Assigned || job.status == JobStatus.Completed, 
            "Invalid status for dispute");
        require(msg.sender == job.client || msg.sender == job.freelancer, 
            "Only job participants can dispute");
        require(disputes[_jobId].jobId == 0, "Dispute already exists");

        JobStatus oldStatus = job.status;

        disputes[_jobId] = Dispute({
            jobId: _jobId,
            raisedBy: msg.sender,
            createdAt: block.timestamp,
            resolved: false,
            votesForClient: 0,
            votesForFreelancer: 0
        });

        job.status = JobStatus.Disputed;
        
        emit DisputeRaised(_jobId, msg.sender);
        emit JobStatusChanged(_jobId, oldStatus, job.status);
    }   

    /**
     * @dev Vote on a dispute
     * @param _jobId ID of the disputed job
     * @param _supportsFreelancer True if vote supports freelancer, false if supports client
     */
    function voteOnDispute(uint256 _jobId, bool _supportsFreelancer) 
        external 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Dispute storage dispute = disputes[_jobId];
        Job storage job = jobs[_jobId];
        
        require(dispute.jobId == _jobId, "Dispute does not exist");
        require(!dispute.resolved, "Dispute already resolved");
        require(!disputeVotes[_jobId][msg.sender], "Already voted");
        require(block.timestamp < dispute.createdAt + DISPUTE_VOTING_PERIOD, "Voting period ended");
        require(users[msg.sender].reputation >= MIN_REPUTATION_TO_VOTE, "Insufficient reputation to vote");
        require(msg.sender != job.client && msg.sender != job.freelancer, 
            "Participants cannot vote");

        uint256 votingPower = users[msg.sender].reputation;
        uint256 newTotal;

        if (_supportsFreelancer) {
            dispute.votesForFreelancer += votingPower;
            newTotal = dispute.votesForFreelancer;
        } else {
            dispute.votesForClient += votingPower;
            newTotal = dispute.votesForClient;
        }

        disputeVotes[_jobId][msg.sender] = true;
        
        emit VoteCasted(_jobId, msg.sender, _supportsFreelancer);
        emit DisputeVoteCounted(_jobId, _supportsFreelancer, newTotal);
    }

    /**
     * @dev Resolve a dispute after voting period
     * @param _jobId ID of the disputed job
     */
    function resolveDispute(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        whenNotPaused
        nonReentrant
    {
        Dispute storage dispute = disputes[_jobId];
        Job storage job = jobs[_jobId];
        
        require(dispute.jobId == _jobId, "Dispute does not exist");
        require(!dispute.resolved, "Dispute already resolved");
        
        dispute.resolved = true;
        bool freelancerWon = dispute.votesForFreelancer >= dispute.votesForClient;
        
        JobStatus oldStatus = job.status;
        uint256 oldClientRep = users[job.client].reputation;
        uint256 oldFreelancerRep = users[job.freelancer].reputation;
        
        // Handle dispute resolution - only reputation impacts
        if (freelancerWon) {
            // Penalize client's reputation slightly
            users[job.client].reputation = _clamp(users[job.client].reputation - 5, 0, MAX_REPUTATION);
            
            if (oldClientRep != users[job.client].reputation) {
                emit UserReputationChanged(job.client, oldClientRep, users[job.client].reputation);
            }
        } else {
            // Penalize freelancer's reputation slightly
            users[job.freelancer].reputation = _clamp(users[job.freelancer].reputation - 5, 0, MAX_REPUTATION);
            
            if (oldFreelancerRep != users[job.freelancer].reputation) {
                emit UserReputationChanged(job.freelancer, oldFreelancerRep, users[job.freelancer].reputation);
            }
        }
        
        job.status = JobStatus.Completed;
        
        emit DisputeResolved(_jobId, freelancerWon);
        emit JobStatusChanged(_jobId, oldStatus, job.status);
        emit DisputeVotingEnded(_jobId, dispute.votesForClient, dispute.votesForFreelancer);
    }

    /**
     * @dev Give rating to a job participant
     * @param _jobId ID of the completed job
     * @param _rating Rating value (1-5)
     */
    function giveRating(uint256 _jobId, uint256 _rating) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        
        address client = job.client;
        address freelancer = job.freelancer;
        
        if (msg.sender == client) {
            // Client rates freelancer
            require(!hasRated[_jobId][client][freelancer], "Already rated freelancer");
            uint256 oldReputation = users[freelancer].reputation;
            _applyRating(freelancer, _rating, users[client].reputation);
            hasRated[_jobId][client][freelancer] = true;
            
            emit RatingGiven(_jobId, client, freelancer, _rating);
            if (oldReputation != users[freelancer].reputation) {
                emit UserReputationChanged(freelancer, oldReputation, users[freelancer].reputation);
            }
        } else if (msg.sender == freelancer) {
            // Freelancer rates client
            require(!hasRated[_jobId][freelancer][client], "Already rated client");
            uint256 oldReputation = users[client].reputation;
            _applyRating(client, _rating, users[freelancer].reputation);
            hasRated[_jobId][freelancer][client] = true;
            
            emit RatingGiven(_jobId, freelancer, client, _rating);
            if (oldReputation != users[client].reputation) {
                emit UserReputationChanged(client, oldReputation, users[client].reputation);
            }
        } else {
            revert("Not authorized");
        }
    }

    /**
     * @dev Apply rating to a user's reputation
     * @param _user Address of the user to rate
     * @param _rating Rating value (1-5)
     * @param _voterReputation Reputation of the voter
     */
    function _applyRating(address _user, uint256 _rating, uint256 _voterReputation) internal {
        // Convert 1-5 rating to reputation points (20-100 scale)
        uint256 ratingPoints = (_rating - 1) * 20 + 20; // 1★=20, 2★=40, 3★=60, 4★=80, 5★=100
        
        // Weight the impact by voter's reputation (higher rep = stronger influence)
        uint256 reputationImpact = (ratingPoints * _voterReputation) / 100;
        
        // Update target user's reputation (capped at 0-100)
        // 90% old reputation + 10% new rating impact
        users[_user].reputation = _clamp(
            (users[_user].reputation * 90 + reputationImpact * 10) / 100,
            0,
            MAX_REPUTATION
        );
    }

    /**
     * @dev Edit job details
     * @param _jobId ID of the job to edit
     * @param _newTitle New job title
     * @param _newDescription New job description
     * @param _newAmount New job budget
     */
    function editJob(uint256 _jobId, string calldata _newTitle, string calldata _newDescription, uint256 _newAmount) 
        external 
        jobExists(_jobId) 
        userExists(msg.sender) 
        whenNotPaused
        nonReentrant
    {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only job owner can edit");
        require(job.status == JobStatus.Open, "Can only edit open jobs");
        require(bytes(_newTitle).length > 0 && bytes(_newTitle).length <= 100, "Invalid title length");
        require(bytes(_newDescription).length > 0 && bytes(_newDescription).length <= 2000, "Invalid description length");

        uint256 oldPrice = job.price;
        
        job.jobTitle = _newTitle;
        job.description = _newDescription;
        job.price = _newAmount;

        emit JobUpdated(_jobId, msg.sender, _newTitle, _newDescription);
        
        if (oldPrice != _newAmount) {
            emit JobPriceUpdated(_jobId, oldPrice, _newAmount);
        }
    }

    // VIEW FUNCTIONS

    /**
     * @dev Get all applications for a job
     * @param _jobId ID of the job
     * @return Array of applications
     */
    function getJobApplications(uint256 _jobId) 
        external 
        view 
        jobExists(_jobId) 
        returns (Application[] memory) 
    {
        return jobApplications[_jobId];
    }

    /**
     * @dev Get all jobs created by a client
     * @param _client Address of the client
     * @return Array of job IDs
     */
    function getClientJobs(address _client) 
        external 
        view 
        userExists(_client) 
        returns (uint256[] memory) 
    {
        return clientJobs[_client];
    }

    /**
     * @dev Get all jobs assigned to a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of job IDs
     */
    function getFreelancerJobs(address _freelancer) 
        external 
        view 
        userExists(_freelancer) 
        returns (uint256[] memory) 
    {
        return freelancerJobs[_freelancer];
    }

    /**
     * @dev Get details of a job
     * @param _jobId ID of the job
     * @return Job details
     */
    function getJobDetails(uint256 _jobId) 
        external 
        view 
        jobExists(_jobId) 
        returns (Job memory) 
    {
        return jobs[_jobId];
    }

    /**
     * @dev Get user profile details
     * @param _user Address of the user
     * @return UserProfile details
     */
    function getUserProfile(address _user) 
        external 
        view 
        userExists(_user) 
        returns (UserProfile memory) 
    {
        return users[_user];
    }

    /**
     * @dev Get total number of jobs
     * @return Total job count
     */
    function getTotalJobs() external view returns (uint256) {
        return _jobCounter;
    }

    /**
     * @dev Get total number of users
     * @return Total user count
     */
    function getTotalUsers() external view returns (uint256) {
        return _userCounter;
    }

    /**
     * @dev Get dispute details
     * @param _jobId ID of the disputed job
     * @return Dispute details
     */
    function getDisputeDetails(uint256 _jobId) 
        external 
        view 
        returns (Dispute memory) 
    {
        require(disputes[_jobId].jobId == _jobId, "Dispute does not exist");
        return disputes[_jobId];
    }

    /**
     * @dev Check if a user has rated another user for a job
     * @param _jobId ID of the job
     * @param _rater Address of the rater
     * @param _rated Address of the rated user
     * @return Whether rating exists
     */
    function checkIfRated(uint256 _jobId, address _rater, address _rated) 
        external 
        view 
        returns (bool) 
    {
        return hasRated[_jobId][_rater][_rated];
    }

    /**
     * @dev Utility function to clamp a value between min and max
     * @param _value Value to clamp
     * @param _min Minimum value
     * @param _max Maximum value
     * @return Clamped value
     */
    function _clamp(uint256 _value, uint256 _min, uint256 _max) internal pure returns (uint256) {
        return (_value < _min) ? _min : (_value > _max) ? _max : _value;
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }
    function sendMessage(string calldata _content) external userExists(msg.sender) {
    require(bytes(_content).length > 0, "Empty message");
    require(bytes(_content).length <= 200, "Max 200 characters");
    
    // Store message in circular buffer
    uint256 index = messageCount % 100;
    recentMessages[index] = Message({
        sender: msg.sender,
        timestamp: uint40(block.timestamp),
        content: _content
    });
    
    messageCount++;
    
    // Emit event for real-time rendering
    emit NewMessage(msg.sender, messageCount, _content, block.timestamp);
}
    function getMessages(uint256 _start, uint256 _count) external view returns (Message[] memory) {
    require(_count <= 50, "Max 50 messages per request");
    
    uint256 total = messageCount < 100 ? messageCount : 100;
    if (_start >= total) return new Message[](0);
    
    uint256 available = total - _start;
    uint256 count = _count > available ? available : _count;
    Message[] memory result = new Message[](count);
    
    for (uint256 i = 0; i < count; i++) {
        uint256 index = (total - 1 - _start - i) % 100;
        result[i] = recentMessages[index];
    }
    
    return result;
}

/**
 * @dev Get total message count for pagination
 */
    function totalMessages() external view returns (uint256) {
        return messageCount;
    }
}