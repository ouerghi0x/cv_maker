'use client';

import React, { useState } from 'react';

// A simple AddButton component (assuming it's not provided externally or needs a basic version)
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the type for a single education entry
type Education = {
  degree: string;
  institution: string;
  yearStarted: string;
  yearOfGraduation: string;
};

// Define the props for the PersonalEducation component
type PersonalEducationProps = {
  next: () => void;
  prev: () => void;
  // onChange now expects an array of Education objects
  onChange: (education: Education[]) => void;
  initialData?: Education[]; // Optional prop to pre-fill the form
};

export default function PersonalEducation({ next, prev, onChange, initialData }: PersonalEducationProps) {
  // State to hold all added education entries
  const [educationEntries, setEducationEntries] = useState<Education[]>(initialData || []);
  // State for the new education entry being added
  const [newEducation, setNewEducation] = useState<Education>({
    degree: '',
    institution: '',
    yearStarted: '',
    yearOfGraduation: ''
  });

  // Handles changes to the input fields for a new education entry
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  // Adds the current newEducation to the list of education entries
  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.yearStarted && newEducation.yearOfGraduation) {
      setEducationEntries(prev => [...prev, newEducation]);
      // Reset the new education form
      setNewEducation({
        degree: '',
        institution: '',
        yearStarted: '',
        yearOfGraduation: ''
      });
    } else {
      console.log("Please fill in all required fields for the education entry.");
    }
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(educationEntries); // Pass the array of education entries back to the parent
    next(); // Move to the next step
    console.log("Education Data Submitted:", educationEntries);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Education</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display existing education entries */}
        {educationEntries.length > 0 && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-700">Added Education:</h3>
            {educationEntries.map((edu, index) => (
              <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-800">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.yearStarted} - {edu.yearOfGraduation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form for adding a new education entry */}
        <div className="space-y-2 border p-4 rounded-md bg-blue-50">
          <h3 className="font-semibold text-gray-700">Add New Education:</h3>
          <div className="relative">
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <input
                type="text"
                id="degree"
                name="degree"
                placeholder="e.g., Bachelor of Science"
                value={newEducation.degree}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m2-4h6m-6-4h6m-6-4h6" />
              </svg>
              <input
                type="text"
                id="institution"
                name="institution"
                placeholder="e.g., University of Example"
                value={newEducation.institution}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="yearStarted" className="block text-sm font-medium text-gray-700">Year Started</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="text"
                id="yearStarted"
                name="yearStarted"
                placeholder="e.g., 2019"
                value={newEducation.yearStarted}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700">Year of Graduation</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="text"
                id="yearOfGraduation"
                name="yearOfGraduation"
                placeholder="e.g., 2023"
                value={newEducation.yearOfGraduation}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <AddButton
            text="Add Education"
            type="button" // Important: This is a button to add, not submit the form
            onClick={addEducation}
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
