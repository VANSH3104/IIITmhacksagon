const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OptimizedFreelancing", function () {
  let freelancing;
  let owner, client1, client2, freelancer1, freelancer2, voter1, voter2;

  before(async function () {
    [owner, client1, client2, freelancer1, freelancer2, voter1, voter2] = await ethers.getSigners();
    
    const OptimizedFreelancing = await ethers.getContractFactory("OptimizedFreelancing");
    freelancing = await OptimizedFreelancing.deploy();
    await freelancing.deployed();
  });

  describe("User Registration", function () {
    it("Should register a client", async function () {
      await expect(freelancing.connect(client1).registerUser(true, false, ""))
        .to.emit(freelancing, "UserRegistered")
        .withArgs(client1.address, true, false);
      
      const profile = await freelancing.getUserProfile(client1.address);
      expect(profile.isClient).to.be.true;
      expect(profile.isFreelancer).to.be.false;
    });

    it("Should register a freelancer with resume", async function () {
      await expect(freelancing.connect(freelancer1).registerUser(false, true, "Experienced web3 developer"))
        .to.emit(freelancing, "UserRegistered")
        .withArgs(freelancer1.address, false, true);
      
      const profile = await freelancing.getUserProfile(freelancer1.address);
      expect(profile.isFreelancer).to.be.true;
      expect(profile.resume).to.equal("Experienced web3 developer");
    });

    it("Should register as both client and freelancer", async function () {
      await freelancing.connect(client2).registerUser(true, true, "Full-stack developer");
      const profile = await freelancing.getUserProfile(client2.address);
      expect(profile.isClient).to.be.true;
      expect(profile.isFreelancer).to.be.true;
    });

    it("Should prevent duplicate registration", async function () {
      await expect(freelancing.connect(client1).registerUser(true, false, ""))
        .to.be.revertedWith("Already registered");
    });

    it("Should require at least one role", async function () {
      await expect(freelancing.connect(voter1).registerUser(false, false, ""))
        .to.be.revertedWith("Must be client or freelancer");
    });

    it("Should require resume for freelancers", async function () {
      await expect(freelancing.connect(freelancer2).registerUser(false, true, ""))
        .to.be.revertedWith("Freelancers must provide a resume");
    });
  });

  describe("Profile Management", function () {
    it("Should update profile", async function () {
      await expect(freelancing.connect(freelancer1).updateProfile(false, true, "Updated resume"))
        .to.emit(freelancing, "UserProfileUpdated")
        .withArgs(freelancer1.address, "Updated resume");
      
      const profile = await freelancing.getUserProfile(freelancer1.address);
      expect(profile.resume).to.equal("Updated resume");
    });

    it("Should switch from freelancer to client", async function () {
      await freelancing.connect(freelancer1).updateProfile(true, false, "");
      const profile = await freelancing.getUserProfile(freelancer1.address);
      expect(profile.isFreelancer).to.be.false;
      expect(profile.resume).to.equal("");
    });

    it("Should require resume when becoming freelancer", async function () {
      await expect(freelancing.connect(client1).updateProfile(true, true, ""))
        .to.be.revertedWith("Freelancers must have a resume");
    });
  });

  describe("Job Management", function () {
    let jobId;

    it("Should create a job", async function () {
      const tx = await freelancing.connect(client1).createJob("Web3 Website", "Build a decentralized website", ethers.utils.parseEther("1"));
      const receipt = await tx.wait();
      
      const jobCreatedEvent = receipt.events.find(e => e.event === "JobCreated");
      jobId = jobCreatedEvent.args.jobId;

      expect(jobId).to.equal(1);
      
      const job = await freelancing.getJobDetails(jobId);
      expect(job.jobTitle).to.equal("Web3 Website");
      expect(job.status).to.equal(0); // JobStatus.Open
    });

    it("Should prevent non-clients from creating jobs", async function () {
      await expect(freelancing.connect(freelancer1).createJob("Invalid", "Job", 1))
        .to.be.revertedWith("Only clients can post jobs");
    });

    it("Should apply for a job", async function () {
      await expect(freelancing.connect(freelancer2).applyForJob(jobId, "My proposal", ethers.utils.parseEther("0.8")))
        .to.emit(freelancing, "FreelancerApplied")
        .withArgs(jobId, freelancer2.address, "My proposal", ethers.utils.parseEther("0.8"));
      
      const applications = await freelancing.getJobApplications(jobId);
      expect(applications.length).to.equal(1);
      expect(applications[0].freelancer).to.equal(freelancer2.address);
    });

    it("Should prevent duplicate applications", async function () {
      await expect(freelancing.connect(freelancer2).applyForJob(jobId, "Another proposal", 1))
        .to.be.revertedWith("Already applied");
    });

    it("Should assign a job to freelancer", async function () {
      await expect(freelancing.connect(client1).assignJob(jobId, freelancer2.address, 0))
        .to.emit(freelancing, "JobAssigned")
        .withArgs(jobId, freelancer2.address, ethers.utils.parseEther("0.8"));
      
      const job = await freelancing.getJobDetails(jobId);
      expect(job.status).to.equal(1); // JobStatus.Assigned
      expect(job.freelancer).to.equal(freelancer2.address);
      expect(job.price).to.equal(ethers.utils.parseEther("0.8"));
    });

    it("Should complete a job", async function () {
      await expect(freelancing.connect(freelancer2).completeJob(jobId, "https://work-submission.com"))
        .to.emit(freelancing, "JobCompleted")
        .withArgs(jobId);
      
      const job = await freelancing.getJobDetails(jobId);
      expect(job.status).to.equal(2); // JobStatus.Completed
      expect(job.workSubmissionUrl).to.equal("https://work-submission.com");
      
      const profile = await freelancing.getUserProfile(freelancer2.address);
      expect(profile.completedJobs).to.equal(1);
    });

    it("Should create and cancel an open job", async function () {
      const tx = await freelancing.connect(client1).createJob("Cancellable Job", "This will be cancelled", 1);
      const receipt = await tx.wait();
      const cancelJobId = receipt.events.find(e => e.event === "JobCreated").args.jobId;
      
      await expect(freelancing.connect(client1).cancelJob(cancelJobId))
        .to.emit(freelancing, "JobCancelled")
        .withArgs(cancelJobId, client1.address);
      
      const job = await freelancing.getJobDetails(cancelJobId);
      expect(job.status).to.equal(4); // JobStatus.Cancelled
    });
  });

  describe("Dispute Resolution", function () {
    let disputeJobId;

    before(async function () {
      // Create a job for dispute testing
      const tx = await freelancing.connect(client1).createJob("Dispute Test", "Job for dispute testing", ethers.utils.parseEther("2"));
      const receipt = await tx.wait();
      disputeJobId = receipt.events.find(e => e.event === "JobCreated").args.jobId;
      
      // Register voters
      await freelancing.connect(voter1).registerUser(false, true, "Voter 1");
      await freelancing.connect(voter2).registerUser(false, true, "Voter 2");
      
      // Apply and assign
      await freelancing.connect(freelancer1).applyForJob(disputeJobId, "I can do it", ethers.utils.parseEther("1.5"));
      await freelancing.connect(client1).assignJob(disputeJobId, freelancer1.address, 0);
    });

    it("Should raise a dispute", async function () {
      await expect(freelancing.connect(client1).raiseDispute(disputeJobId))
        .to.emit(freelancing, "DisputeRaised")
        .withArgs(disputeJobId, client1.address);
      
      const job = await freelancing.getJobDetails(disputeJobId);
      expect(job.status).to.equal(3); // JobStatus.Disputed
      
      const dispute = await freelancing.getDisputeDetails(disputeJobId);
      expect(dispute.raisedBy).to.equal(client1.address);
    });

    it("Should allow voting on dispute", async function () {
      // Increase reputation for voters (normally done via ratings)
      await freelancing.connect(owner).giveRating(1, 5); // Give freelancer2 a 5-star rating to increase rep
      
      await expect(freelancing.connect(voter1).voteOnDispute(disputeJobId, true))
        .to.emit(freelancing, "VoteCasted")
        .withArgs(disputeJobId, voter1.address, true);
      
      await expect(freelancing.connect(voter2).voteOnDispute(disputeJobId, false))
        .to.emit(freelancing, "VoteCasted")
        .withArgs(disputeJobId, voter2.address, false);
      
      const dispute = await freelancing.getDisputeDetails(disputeJobId);
      expect(dispute.votesForFreelancer).to.be.gt(0);
      expect(dispute.votesForClient).to.be.gt(0);
    });

    it("Should resolve dispute after voting period", async function () {
      // Fast-forward time (requires a forked network or time travel)
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60 + 1]); // 7 days + 1 second
      await ethers.provider.send("evm_mine");
      
      await expect(freelancing.resolveDispute(disputeJobId))
        .to.emit(freelancing, "DisputeResolved");
      
      const job = await freelancing.getJobDetails(disputeJobId);
      expect(job.status).to.equal(2); // JobStatus.Completed
    });
  });

  describe("Rating System", function () {
    it("Should allow rating after job completion", async function () {
      await expect(freelancing.connect(client1).giveRating(1, 5))
        .to.emit(freelancing, "RatingGiven")
        .withArgs(1, client1.address, freelancer2.address, 5);
      
      const profile = await freelancing.getUserProfile(freelancer2.address);
      expect(profile.reputation).to.be.gt(50); // Should increase from default 50
    });

    it("Should prevent duplicate ratings", async function () {
      await expect(freelancing.connect(client1).giveRating(1, 4))
        .to.be.revertedWith("Already rated freelancer");
    });
  });

  describe("Messaging System", function () {
    it("Should send and retrieve messages", async function () {
      await expect(freelancing.connect(client1).sendMessage("Hello freelancer!"))
        .to.emit(freelancing, "NewMessage");
      
      await freelancing.connect(freelancer1).sendMessage("Hi client!");
      
      const messages = await freelancing.getMessages(0, 2);
      expect(messages.length).to.equal(2);
      expect(messages[0].content).to.equal("Hi client!");
      expect(messages[1].content).to.equal("Hello freelancer!");
    });

    it("Should enforce message limits", async function () {
      await expect(freelancing.connect(client1).sendMessage("a".repeat(201)))
        .to.be.revertedWith("Max 200 characters");
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause and unpause contract", async function () {
      await expect(freelancing.connect(owner).pause())
        .to.emit(freelancing, "ContractPaused")
        .withArgs(owner.address);
      
      await expect(freelancing.connect(client1).createJob("Paused Job", "Should fail", 1))
        .to.be.revertedWith("Pausable: paused");
      
      await expect(freelancing.connect(owner).unpause())
        .to.emit(freelancing, "ContractUnpaused")
        .withArgs(owner.address);
    });

    it("Should prevent non-owners from pausing", async function () {
      await expect(freelancing.connect(client1).pause())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});