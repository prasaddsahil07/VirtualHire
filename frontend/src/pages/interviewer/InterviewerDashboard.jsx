import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../context/authStore';
import { interviewerAPI, slotAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ThemeToggle from '../../components/ThemeToggle';
import SlotCard from '../../components/SlotCard';
import CreateSlotModal from '../../components/CreateSlotModal';
import { Plus, Calendar, Clock, DollarSign, User, Settings } from 'lucide-react';

const InterviewerDashboard = () => {
  const { user, logout } = useAuthStore();
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    bookedSlots: 0,
    completedSlots: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      // This would be the actual API call when backend is ready
      // const response = await slotAPI.getSlots(user.interviewerProfile._id);
      
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
          status: 'booked',
          price: 750,
          feedback: '',
          rating: 0
        },
        {
          _id: '3',
          scheduledDate: '2024-01-10',
          startTime: '09:00',
          duration: 45,
          status: 'completed',
          price: 500,
          feedback: 'Great candidate, strong technical skills',
          rating: 4.5
        }
      ];
      
      setSlots(dummySlots);
      calculateStats(dummySlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (slotsData) => {
    const stats = {
      totalSlots: slotsData.length,
      availableSlots: slotsData.filter(slot => slot.status === 'available').length,
      bookedSlots: slotsData.filter(slot => slot.status === 'booked').length,
      completedSlots: slotsData.filter(slot => slot.status === 'completed').length,
      totalEarnings: slotsData
        .filter(slot => slot.status === 'completed')
        .reduce((sum, slot) => sum + (slot.price * 0.8), 0) // 80% of price
    };
    setStats(stats);
  };

  const filteredSlots = slots.filter(slot => {
    if (activeTab === 'all') return true;
    return slot.status === activeTab;
  });

  const handleCreateSlot = async (slotData) => {
    try {
      // This would be the actual API call when backend is ready
      // const response = await slotAPI.createSlot(slotData);
      
      // Dummy implementation
      const newSlot = {
        _id: Date.now().toString(),
        ...slotData,
        status: 'available',
        feedback: '',
        rating: 0
      };
      
      setSlots(prev => [...prev, newSlot]);
      calculateStats([...slots, newSlot]);
      setShowCreateSlot(false);
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };

  const handleUpdateSlot = async (slotId, updatedData) => {
    try {
      // This would be the actual API call when backend is ready
      // const response = await slotAPI.updateSlot(slotId, updatedData);
      
      // Dummy implementation
      setSlots(prev => prev.map(slot => 
        slot._id === slotId ? { ...slot, ...updatedData } : slot
      ));
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      // This would be the actual API call when backend is ready
      // const response = await slotAPI.deleteSlot(slotId);
      
      // Dummy implementation
      setSlots(prev => prev.filter(slot => slot._id !== slotId));
      calculateStats(slots.filter(slot => slot._id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
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
                VirtualHire - Interviewer Dashboard
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Slots</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.availableSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Booked</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.bookedSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Earnings</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Interview Slots</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your available time slots</p>
            </div>
            <button
              onClick={() => setShowCreateSlot(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Slot
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Slots', count: stats.totalSlots },
                { key: 'available', label: 'Available', count: stats.availableSlots },
                { key: 'booked', label: 'Booked', count: stats.bookedSlots },
                { key: 'completed', label: 'Completed', count: stats.completedSlots }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onUpdate={handleUpdateSlot}
              onDelete={handleDeleteSlot}
              isInterviewer={true}
            />
          ))}
        </div>

        {filteredSlots.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No slots found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'all' 
                ? 'Create your first interview slot to get started'
                : `No ${activeTab} slots found`
              }
            </p>
          </div>
        )}
      </main>

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={showCreateSlot}
        onClose={() => setShowCreateSlot(false)}
        onSubmit={handleCreateSlot}
      />
    </div>
  );
};

export default InterviewerDashboard;
