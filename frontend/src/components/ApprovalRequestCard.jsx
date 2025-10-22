import React from 'react';
import { CheckCircle, XCircle, User, Mail, Building, Link as LinkIcon, Calendar } from 'lucide-react';

const ApprovalRequestCard = ({ request, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {request.interviewer?.user?.name?.charAt(0) || 'I'}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {request.interviewer?.user?.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verification Request
            </p>
          </div>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="ml-2 capitalize">{request.status}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Interviewer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span>{request.interviewer?.user?.email}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4 mr-2" />
              <span>{request.interviewer?.employeeMailId}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <LinkIcon className="w-4 h-4 mr-2" />
              <a 
                href={request.interviewer?.linkedinProfile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{request.interviewer?.experience} years</span>
            </div>
            
            {request.interviewer?.companies && request.interviewer.companies.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Companies:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {request.interviewer.companies.slice(0, 3).map((company, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                    >
                      {company}
                    </span>
                  ))}
                  {request.interviewer.companies.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      +{request.interviewer.companies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {request.interviewer?.bio && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Bio:</strong> {request.interviewer.bio}
            </p>
          </div>
        )}

        {/* Request Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Requested: {formatDate(request.createdAt)}
        </div>

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onApprove(request._id)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </button>
            <button
              onClick={() => onReject(request._id)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalRequestCard;
