'use client';

import React, { useState } from 'react';


// Define the props for the TypeCV component
type TypeCVProps = {
  next: () => void;
  
  // onChange now expects the CV type string
  onChange: (cvType: string) => void;
  initialData?: string; // Optional prop to pre-fill the form
};

export default function TypeCV({ next, onChange, initialData }: TypeCVProps) {
  // Initialize type with initialData if provided, otherwise with an empty string
  const [type, setType] = useState(initialData || '');

  // Handles changes to the input field
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(type); // Pass the CV type string back to the parent
    next(); // Move to the next step
    console.log("Type Data Submitted:", type);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Type of CV</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">CV Type</label>
          <div className="mt-1 flex items-center">
            {/* SVG Icon for CV Type (e.g., a document icon) */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <input
              type="text"
              id="type"
              name="type"
              placeholder="e.g., Software Engineer, Data Scientist"
              value={type}
              onChange={handleChange}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          
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
