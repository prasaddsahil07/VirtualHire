import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        error: null,
        isLoading: false 
      }),

      // Clear all auth state (useful for debugging)
      clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false, 
        error: null,
        isLoading: false 
      }),

      // Helper functions
      isAdmin: () => get().user?.role === 'admin',
      isCandidate: () => get().user?.role === 'candidate',
      isInterviewer: () => get().user?.role === 'recruiter', // Note: backend uses 'recruiter' for interviewer
      
      // Profile completion status
      isProfileComplete: () => {
        const user = get().user;
        if (!user) return false;
        
        // For now, we'll check if the user has completed their profile
        // This will be enhanced based on actual backend response structure
        if (user.role === 'candidate') {
          // Check if candidate has completed their profile
          // We'll check for the presence of profile data
          return user.candidateProfile?.isComplete || 
                 (user.candidateProfile && Object.keys(user.candidateProfile).length > 0) || 
                 false;
        } else if (user.role === 'recruiter') {
          // Check if interviewer has completed their profile
          return user.interviewerProfile?.isComplete || 
                 (user.interviewerProfile && Object.keys(user.interviewerProfile).length > 0) || 
                 false;
        }
        return true; // Admin doesn't need profile completion
      },

      // Update user profile data
      updateUserProfile: (profileData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...profileData
            }
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Clear auth state if user data is invalid
        if (state && state.user && !state.user._id) {
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);
