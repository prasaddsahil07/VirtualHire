import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../context/authStore';
import { candidateAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ThemeToggle from '../../components/ThemeToggle';
import InterviewerCard from '../../components/InterviewerCard';
import FilterModal from '../../components/FilterModal';
import { Search, Filter, User, Calendar, Star } from 'lucide-react';

const CandidateDashboard = () => {
  const { user, logout } = useAuthStore();
  const [interviewers, setInterviewers] = useState([]);
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    experience: '',
    expertise: '',
    companies: ''
  });

  useEffect(() => {
    fetchInterviewers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviewers, searchTerm, filters]);

  const fetchInterviewers = async () => {
    try {
      setIsLoading(true);
      const response = await candidateAPI.getMatchingInterviewers();
      setInterviewers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviewers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(interviewer => 
        interviewer.expertise?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        interviewer.companies?.some(company => 
          company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Experience filter
    if (filters.experience) {
      const experienceValue = parseInt(filters.experience);
      filtered = filtered.filter(interviewer => 
        interviewer.experience >= experienceValue
      );
    }

    // Expertise filter
    if (filters.expertise) {
      filtered = filtered.filter(interviewer => 
        interviewer.expertise?.some(skill => 
          skill.toLowerCase().includes(filters.expertise.toLowerCase())
        )
      );
    }

    // Companies filter
    if (filters.companies) {
      filtered = filtered.filter(interviewer => 
        interviewer.companies?.some(company => 
          company.toLowerCase().includes(filters.companies.toLowerCase())
        )
      );
    }

    setFilteredInterviewers(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      experience: '',
      expertise: '',
      companies: ''
    });
    setSearchTerm('');
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
                VirtualHire
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Interviewer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse through verified interviewers and book mock interviews
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by skills, companies, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {(filters.experience || filters.expertise || filters.companies || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 dark:text-blue-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.experience && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Experience: {filters.experience}+ years
                  <button
                    onClick={() => setFilters({...filters, experience: ''})}
                    className="ml-2 text-green-600 dark:text-green-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.expertise && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  Expertise: {filters.expertise}
                  <button
                    onClick={() => setFilters({...filters, expertise: ''})}
                    className="ml-2 text-purple-600 dark:text-purple-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.companies && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                  Company: {filters.companies}
                  <button
                    onClick={() => setFilters({...filters, companies: ''})}
                    className="ml-2 text-orange-600 dark:text-orange-400"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Interviewers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviewers.map((interviewer) => (
            <InterviewerCard
              key={interviewer._id}
              interviewer={interviewer}
            />
          ))}
        </div>

        {filteredInterviewers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No interviewers found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default CandidateDashboard;
