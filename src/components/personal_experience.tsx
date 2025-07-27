'use client';

import React, { useState } from 'react';

// A simple AddButton component (assuming it's not provided externally or needs a basic version)
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the type for a single experience entry
type Experience = {
  company: string;
  position: string;
  startDate: string; // Changed from 'duration' to 'startDate' and 'endDate' for better data structure
  endDate: string;   // Added endDate
  description: string;
};

// Define the props for the PersonalExperience component
type PersonalExperienceProps = {
  next: () => void;
  prev: () => void;
  // onChange now expects an array of Experience objects
  onChange: (experience: Experience[]) => void;
  initialData?: Experience[]; // Optional prop to pre-fill the form
};

export default function PersonalExperience({ next, prev, onChange, initialData }: PersonalExperienceProps) {
  // State to hold all added experience entries
  const [experienceEntries, setExperienceEntries] = useState<Experience[]>(initialData || []);
  // State for the new experience entry being added
  const [newExperience, setNewExperience] = useState<Experience>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Handles changes to the input fields for a new experience entry
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  // Adds the current newExperience to the list of experience entries
  const addExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.startDate && newExperience.endDate && newExperience.description) {
      setExperienceEntries(prev => [...prev, newExperience]);
      // Reset the new experience form
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    } else {
      console.log("Please fill in all required fields for the experience entry.");
    }
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(experienceEntries); // Pass the array of experience entries back to the parent
    next(); // Move to the next step
    console.log("Experience Data Submitted:", experienceEntries);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Work Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display existing experience entries */}
        {experienceEntries.length > 0 && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-700">Added Experiences:</h3>
            {experienceEntries.map((exp, index) => (
              <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-800">{exp.position} at {exp.company}</p>
                <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form for adding a new experience entry */}
        <div className="space-y-2 border p-4 rounded-md bg-blue-50">
          <h3 className="font-semibold text-gray-700">Add New Experience:</h3>
          <div className="relative">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m2-4h6m-6-4h6m-6-4h6" />
              </svg>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Enter company name"
                value={newExperience.company}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="text"
                id="position"
                name="position"
                placeholder="Enter your position"
                value={newExperience.position}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="month" // Changed to month for date input
                id="startDate"
                name="startDate"
                placeholder="e.g., 2020-01"
                value={newExperience.startDate}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="month" // Changed to month for date input
                id="endDate"
                name="endDate"
                placeholder="e.g., 2021-12 or Present"
                value={newExperience.endDate}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                placeholder="Describe your responsibilities and achievements (e.g., Managed a team of 5 developers, Developed new features...)"
                value={newExperience.description}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          <AddButton
            text="Add Experience"
            type="button" // Important: This is a button to add, not submit the form
            onClick={addExperience}
            style="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          />
        </div>

        {/* Navigation buttons */}
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
