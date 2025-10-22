import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../context/authStore';
import { candidateAPI, interviewerAPI, approvalAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ThemeToggle from '../../components/ThemeToggle';
import UserCard from '../../components/UserCard';
import ApprovalRequestCard from '../../components/ApprovalRequestCard';
import { Users, UserCheck, Clock, CheckCircle, XCircle, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalInterviewers: 0,
    pendingApprovals: 0,
    verifiedInterviewers: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch candidates
      const candidatesResponse = await candidateAPI.getAllCandidates();
      setCandidates(candidatesResponse.data.data || []);
      
      // Fetch interviewers
      const interviewersResponse = await interviewerAPI.getAllInterviewers();
      setInterviewers(interviewersResponse.data.data || []);
      
      // Fetch approval requests
      const approvalResponse = await approvalAPI.getAllRequests();
      setApprovalRequests(approvalResponse.data.data || []);
      
      // Calculate stats
      const stats = {
        totalCandidates: candidatesResponse.data.data?.length || 0,
        totalInterviewers: interviewersResponse.data.data?.length || 0,
        pendingApprovals: approvalResponse.data.data?.filter(req => req.status === 'pending').length || 0,
        verifiedInterviewers: interviewersResponse.data.data?.filter(int => int.verificationStatus === 'verified').length || 0
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await approvalAPI.approveRequest(requestId);
      setApprovalRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status: 'approved' } : req
        )
      );
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await approvalAPI.rejectRequest(requestId);
      setApprovalRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status: 'rejected' } : req
        )
      );
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                VirtualHire - Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Candidates</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCandidates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Interviewers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalInterviewers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Interviewers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.verifiedInterviewers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: Users },
                { key: 'candidates', label: 'Candidates', icon: Users },
                { key: 'interviewers', label: 'Interviewers', icon: UserCheck },
                { key: 'approvals', label: 'Approvals', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Candidates */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Recent Candidates
                </h3>
                <div className="space-y-3">
                  {candidates.slice(0, 5).map((candidate) => (
                    <UserCard
                      key={candidate._id}
                      user={candidate}
                      type="candidate"
                    />
                  ))}
                </div>
              </div>

              {/* Recent Interviewers */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Recent Interviewers
                </h3>
                <div className="space-y-3">
                  {interviewers.slice(0, 5).map((interviewer) => (
                    <UserCard
                      key={interviewer._id}
                      user={interviewer}
                      type="interviewer"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  All Candidates ({candidates.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidates.map((candidate) => (
                    <UserCard
                      key={candidate._id}
                      user={candidate}
                      type="candidate"
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interviewers' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  All Interviewers ({interviewers.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interviewers.map((interviewer) => (
                    <UserCard
                      key={interviewer._id}
                      user={interviewer}
                      type="interviewer"
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Approval Requests ({approvalRequests.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {approvalRequests.map((request) => (
                    <ApprovalRequestCard
                      key={request._id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
