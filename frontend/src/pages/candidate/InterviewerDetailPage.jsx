import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { interviewerAPI, slotAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ThemeToggle from '../../components/ThemeToggle';
import SlotCard from '../../components/SlotCard';
import PaymentModal from '../../components/PaymentModal';
import { ArrowLeft, Star, Building, Briefcase, Calendar, Clock, User } from 'lucide-react';

const InterviewerDetailPage = () => {
  const { interviewerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [interviewer, setInterviewer] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchInterviewerDetails();
    fetchSlots();
  }, [interviewerId]);

  const fetchInterviewerDetails = async () => {
    try {
      const response = await interviewerAPI.getInterviewerDetail(interviewerId);
      setInterviewer(response.data.data);
    } catch (error) {
      console.error('Error fetching interviewer details:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      // This would be the actual API call when backend is ready
      // const response = await slotAPI.getAvailableSlots(interviewerId);
      
      // Dummy data for now
      const dummySlots = [
        {
          _id: '1',
          scheduledDate: '2024-01-15',
          startTime: '10:00',
          duration: 45,
          status: 'available',
          price: 500,
          feedback: '',
          rating: 0
        },
        {
          _id: '2',
          scheduledDate: '2024-01-16',
          startTime: '14:00',
          duration: 60,
          status: 'available',
          price: 750,
          feedback: '',
          rating: 0
        },
        {
          _id: '3',
          scheduledDate: '2024-01-17',
          startTime: '09:00',
          duration: 45,
          status: 'available',
          price: 500,
          feedback: '',
          rating: 0
        }
      ];
      
      setSlots(dummySlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Update slot status to booked
    setSlots(prev => prev.map(slot => 
      slot._id === selectedSlot._id ? { ...slot, status: 'booked' } : slot
    ));
    setSelectedSlot(null);
    setShowPaymentModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!interviewer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interviewer not found
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredSlots = slots.filter(slot => {
    if (activeTab === 'available') return slot.status === 'available';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Interviewer Profile
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interviewer Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {interviewer.user?.name?.charAt(0) || 'I'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Interviewer
                </h2>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {interviewer.rating || 0}/5 rating
                  </span>
                </div>
              </div>

              {/* Bio */}
              {interviewer.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    About
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {interviewer.bio}
                  </p>
                </div>
              )}

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{interviewer.experience} years</span>
                </div>
              </div>

              {/* Companies */}
              {interviewer.companies && interviewer.companies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.companies.map((company, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expertise */}
              {interviewer.expertise && interviewer.expertise.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Available Interview Slots
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose a time slot that works for you
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSlots.map((slot) => (
                    <div key={slot._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(slot.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{slot.startTime} ({slot.duration} min)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₹{slot.price}
                        </div>
                        <button
                          onClick={() => handleBookSlot(slot)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSlots.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No available slots
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This interviewer doesn't have any available slots at the moment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {selectedSlot && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          slot={selectedSlot}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default InterviewerDetailPage;
