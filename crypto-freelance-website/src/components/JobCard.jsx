import React from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

const JobCard = ({ job, onHover }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${onHover === job.id ? 'border-yellow-500 dark:border-yellow-600 shadow-lg' : 'shadow-sm'}`}
      onMouseEnter={() => onHover(job.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
            <p className="text-yellow-600 dark:text-yellow-400 font-medium mt-1">{job.rate}</p>
          </div>
          {onHover === job.id ? (
            <FiZap className="h-5 w-5 text-yellow-500 dark:text-yellow-400 animate-pulse" />
          ) : (
            <div className="h-5 w-5"></div>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{job.posted}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 rounded-lg bg-white dark:bg-gray-800 border border-yellow-500 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400 font-medium hover:bg-yellow-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
          Apply Now <FiZap />
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;