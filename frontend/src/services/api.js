import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // For cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be sent via cookies, so no need to add manually
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  refreshToken: () => api.post('/users/refresh-token'),
  updateProfile: (data) => api.put('/users/update', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Candidate API
export const candidateAPI = {
  completeProfile: (data) => api.post('/candidates/complete-profile', data),
  updateProfile: (data) => api.put('/candidates/update-profile', data),
  getAllCandidates: () => api.get('/candidates/get-all'),
  getCandidateDetail: (userId) => api.get(`/candidates/get-detail/${userId}`),
  getMatchingInterviewers: (params) => api.get('/candidates/get-matching-interviewers', { params }),
};

// Interviewer API
export const interviewerAPI = {
  completeProfile: (data) => api.post('/interviewers/complete-profile', data),
  updateProfile: (data) => api.put('/interviewers/update-profile', data),
  getAllInterviewers: () => api.get('/interviewers/get-all'),
  getInterviewerDetail: (userId) => api.get(`/interviewers/get-detail/${userId}`),
};

// Approval Request API
export const approvalAPI = {
  requestVerification: (userId) => api.post(`/approval-requests/request-verification/${userId}`),
  getAllRequests: () => api.get('/approval-requests/get-all'),
  getRequestsByStatus: (status) => api.get(`/approval-requests/get-by-status/${status}`),
  approveRequest: (requestId) => api.post(`/approval-requests/approve/${requestId}`),
  rejectRequest: (requestId) => api.post(`/approval-requests/reject/${requestId}`),
};

// Slot API (dummy for now)
export const slotAPI = {
  createSlot: (data) => api.post('/slots/create', data),
  getSlots: (interviewerId) => api.get(`/slots/interviewer/${interviewerId}`),
  updateSlot: (slotId, data) => api.put(`/slots/${slotId}`, data),
  deleteSlot: (slotId) => api.delete(`/slots/${slotId}`),
  getAvailableSlots: (interviewerId) => api.get(`/slots/available/${interviewerId}`),
};

// Booking API (dummy for now)
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings/create', data),
  getBookings: (userId) => api.get(`/bookings/user/${userId}`),
  cancelBooking: (bookingId) => api.put(`/bookings/cancel/${bookingId}`),
  completeBooking: (bookingId) => api.put(`/bookings/complete/${bookingId}`),
};

// Payment API (dummy for now)
export const paymentAPI = {
  createPayment: (data) => api.post('/payments/create', data),
  verifyPayment: (paymentId) => api.post(`/payments/verify/${paymentId}`),
  createRazorpayOrder: (data) => api.post('/payments/razorpay/order', data),
};

export default api;
