import React from 'react';
import { User, Mail, Calendar, Briefcase, Star, CheckCircle, XCircle, Clock } from 'lucide-react';

const UserCard = ({ user, type, showDetails = false }) => {
  const getVerificationStatus = (status) => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900',
          text: 'Verified'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900',
          text: 'Rejected'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          text: 'Pending'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {user.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {user.user?.name || 'Unknown User'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {type === 'candidate' ? 'Candidate' : 'Interviewer'}
            </p>
          </div>
        </div>
        
        {type === 'interviewer' && user.verificationStatus && (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVerificationStatus(user.verificationStatus).bgColor} ${getVerificationStatus(user.verificationStatus).color}`}>
            {getVerificationStatus(user.verificationStatus).icon}
            <span className="ml-1">{getVerificationStatus(user.verificationStatus).text}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <Mail className="w-3 h-3 mr-2" />
          <span className="truncate">{user.user?.email}</span>
        </div>

        {type === 'candidate' && (
          <>
            {user.skills && user.skills.length > 0 && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Briefcase className="w-3 h-3 mr-2" />
                <span>{user.skills.length} skills</span>
              </div>
            )}
            {user.experience !== undefined && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-2" />
                <span>{user.experience} years experience</span>
              </div>
            )}
          </>
        )}

        {type === 'interviewer' && (
          <>
            {user.experience !== undefined && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-2" />
                <span>{user.experience} years experience</span>
              </div>
            )}
            {user.rating > 0 && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Star className="w-3 h-3 mr-2" />
                <span>{user.rating}/5 rating</span>
              </div>
            )}
            {user.companies && user.companies.length > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span>{user.companies.length} companies</span>
              </div>
            )}
          </>
        )}

        {showDetails && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Joined: {formatDate(user.createdAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
