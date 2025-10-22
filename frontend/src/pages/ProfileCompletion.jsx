import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText, Briefcase, Star, Building, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { candidateAPI, interviewerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';

// Candidate profile schema
const candidateProfileSchema = z.object({
  resumeUrl: z.string().url('Please provide a valid resume URL'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  experience: z.number().min(0, 'Experience cannot be negative'),
});

// Interviewer profile schema
const interviewerProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(200, 'Bio must be less than 200 characters'),
  companies: z.array(z.string()).min(1, 'Please add at least one company'),
  expertise: z.array(z.string()).min(1, 'Please add at least one expertise area'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  linkedinProfile: z.string().url('Please provide a valid LinkedIn URL'),
  employeeMailId: z.string().email('Please provide a valid employee email'),
});

const ProfileCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const { user, setUser, setError, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const isCandidate = user?.role === 'candidate';
  const schema = isCandidate ? candidateProfileSchema : interviewerProfileSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: [],
      companies: [],
      expertise: [],
      experience: 0,
    },
  });

  const watchedSkills = watch('skills') || [];
  const watchedCompanies = watch('companies') || [];
  const watchedExpertise = watch('expertise') || [];

  const addSkill = () => {
    if (skillInput.trim() && !watchedSkills.includes(skillInput.trim())) {
      const newSkills = [...watchedSkills, skillInput.trim()];
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = watchedSkills.filter(skill => skill !== skillToRemove);
    setValue('skills', newSkills);
  };

  const addCompany = () => {
    if (companyInput.trim() && !watchedCompanies.includes(companyInput.trim())) {
      const newCompanies = [...watchedCompanies, companyInput.trim()];
      setValue('companies', newCompanies);
      setCompanyInput('');
    }
  };

  const removeCompany = (companyToRemove) => {
    const newCompanies = watchedCompanies.filter(company => company !== companyToRemove);
    setValue('companies', newCompanies);
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !watchedExpertise.includes(expertiseInput.trim())) {
      const newExpertise = [...watchedExpertise, expertiseInput.trim()];
      setValue('expertise', newExpertise);
      setExpertiseInput('');
    }
  };

  const removeExpertise = (expertiseToRemove) => {
    const newExpertise = watchedExpertise.filter(expertise => expertise !== expertiseToRemove);
    setValue('expertise', newExpertise);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = isCandidate 
        ? await candidateAPI.completeProfile(data)
        : await interviewerAPI.completeProfile(data);
      
      if (response.data) {
        setUser({ ...user, ...response.data.data });
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Profile completion failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Complete Your Profile
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isCandidate 
                ? 'Tell us about your skills and experience to find the right interviewers'
                : 'Share your professional background to start conducting interviews'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isCandidate ? (
              <>
                {/* Resume URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('resumeUrl')}
                      type="url"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://drive.google.com/file/..."
                    />
                  </div>
                  {errors.resumeUrl && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.resumeUrl.message}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add a skill (e.g., React, Python, JavaScript)"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.skills.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('experience', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experience.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tell us about your professional background and expertise..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
                  )}
                </div>

                {/* Companies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Companies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add a company (e.g., Google, Microsoft, Amazon)"
                    />
                    <button
                      type="button"
                      onClick={addCompany}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedCompanies.map((company, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      >
                        {company}
                        <button
                          type="button"
                          onClick={() => removeCompany(company)}
                          className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.companies && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companies.message}</p>
                  )}
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expertise Areas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add an expertise area (e.g., Frontend Development, Data Science)"
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedExpertise.map((expertise, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      >
                        {expertise}
                        <button
                          type="button"
                          onClick={() => removeExpertise(expertise)}
                          className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.expertise && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expertise.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Star className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('experience', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experience.message}</p>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('linkedinProfile')}
                      type="url"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  {errors.linkedinProfile && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.linkedinProfile.message}</p>
                  )}
                </div>

                {/* Employee Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employee Email ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('employeeMailId')}
                      type="email"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  {errors.employeeMailId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeMailId.message}</p>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
