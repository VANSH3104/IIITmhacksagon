import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import ColorSwitcher from '../components/ColorSwitcher'

const jobs = [
  {
    id: 1,
    title: 'Solidity Developer',
    rate: '0.5 ETH/hour',
    posted: '2 days ago',
    skills: ['Solidity', 'Smart Contracts', 'Web3.js']
  },
  {
    id: 2,
    title: 'Blockchain Designer',
    rate: '0.002 BTC/hour',
    posted: '1 day ago',
    skills: ['UI/UX', 'Figma', 'Web3']
  },
  {
    id: 3,
    title: 'Crypto Content Writer',
    rate: '100 USDC/article',
    posted: '5 hours ago',
    skills: ['Writing', 'Blockchain', 'SEO']
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <ColorSwitcher />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Available Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}