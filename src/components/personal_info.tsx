'use client';

import { useState } from 'react';

// Define the type for the form data
type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
};


type PersonalInfoProps = {
  next: () => void;
  prev: () => void;
  onChange: (name:string,info: PersonalInfo) => void;
  initialData: PersonalInfo; // To pre-fill if data exists
};

export default function PersonalInfo({ next,prev, onChange,initialData }: PersonalInfoProps) {
  const [formData, setFormData] = useState<PersonalInfo>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: ''
    }
  );

  // Handles changes to input fields and updates the formData state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };


  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior (page reload)
    onChange('personalInfo',formData); // Pass the complete formData object to the parent component
    next(); // Move to the next step
    console.log("Personal Info Submitted:", formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input Field */}
        <div className="relative">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for Name */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              value={formData.name}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Email Input Field */}
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for Email */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Phone Input Field */}
        <div className="relative">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for Phone */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              onChange={handleChange}
              value={formData.phone}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Address Input Field */}
        <div className="relative">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for Address */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              value={formData.address}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* LinkedIn Input Field */}
        <div className="relative">
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for LinkedIn */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              placeholder="Enter your LinkedIn profile URL"
              onChange={handleChange}
              value={formData.linkedin}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* GitHub Input Field */}
        <div className="relative">
          <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for GitHub */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="url"
              id="github"
              name="github"
              placeholder="Enter your GitHub profile URL"
              onChange={handleChange}
              value={formData.github}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Website Input Field */}
        <div className="relative">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for Website */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="Enter your personal website URL"
              onChange={handleChange}
              value={formData.website}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Submit Button */}
       <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prev}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            Previous
          </button>
          <button
            type="submit" // This button submits the form
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Save & Next
          </button>
        </div>
        
      </form>
    </div>
  );
}
