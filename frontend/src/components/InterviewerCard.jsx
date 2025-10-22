import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Building, Briefcase, Calendar, Eye } from 'lucide-react';

const InterviewerCard = ({ interviewer }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/interviewer/${interviewer._id}`);
  };

  const handleBookSlot = () => {
    navigate(`/interviewer/${interviewer._id}/slots`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {interviewer.user?.name?.charAt(0) || 'I'}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interviewer
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Star className="w-4 h-4 mr-1" />
                <span>{interviewer.rating || 0}/5</span>
                <span className="mx-1">•</span>
                <span>{interviewer.experience} years exp</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleViewDetails}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Bio */}
        {interviewer.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {interviewer.bio}
          </p>
        )}

        {/* Companies */}
        {interviewer.companies && interviewer.companies.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Building className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Companies
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {interviewer.companies.slice(0, 3).map((company, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                >
                  {company}
                </span>
              ))}
              {interviewer.companies.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{interviewer.companies.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expertise */}
        {interviewer.expertise && interviewer.expertise.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expertise
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {interviewer.expertise.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {interviewer.expertise.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{interviewer.expertise.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
          >
            View Details
          </button>
          <button
            onClick={handleBookSlot}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewerCard;
