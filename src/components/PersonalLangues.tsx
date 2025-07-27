'use client';

import React, { useState } from 'react';

// A simple AddButton component (assuming it's not provided externally or needs a basic version)
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the type for a single language entry
type Language = {
  language: string;
  proficiency: string;
};

// Define the props for the PersonalLanguages component
type PersonalLanguagesProps = {
  next: () => void;
  prev: () => void;
  // onChange now expects an array of Language objects
  onChange: (languages: Language[]) => void;
  initialData?: Language[]; // Optional prop to pre-fill the form
};

export default function PersonalLanguages({ next, prev, onChange, initialData }: PersonalLanguagesProps) {
  // State to hold all added language entries
  const [languageEntries, setLanguageEntries] = useState<Language[]>(initialData || []);
  // State for the new language entry being added
  const [newLanguage, setNewLanguage] = useState<Language>({
    language: '',
    proficiency: ''
  });

  // Handles changes to the input fields for a new language entry
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewLanguage(prev => ({ ...prev, [name]: value }));
  };

  // Adds the current newLanguage to the list of language entries
  const addLanguage = () => {
    if (newLanguage.language && newLanguage.proficiency) {
      setLanguageEntries(prev => [...prev, newLanguage]);
      // Reset the new language form
      setNewLanguage({
        language: '',
        proficiency: ''
      });
    } else {
      console.log("Please fill in all required fields for the language entry.");
    }
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(languageEntries); // Pass the array of language entries back to the parent
    next(); // Move to the next step
    console.log("Language Data Submitted:", languageEntries);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Languages</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display existing language entries */}
        {languageEntries.length > 0 && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-700">Added Languages:</h3>
            {languageEntries.map((lang, index) => (
              <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-800">{lang.language}</p>
                <p className="text-sm text-gray-600">Proficiency: {lang.proficiency}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form for adding a new language entry */}
        <div className="space-y-2 border p-4 rounded-md bg-blue-50">
          <h3 className="font-semibold text-gray-700">Add New Language:</h3>
          <div className="relative">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 7H3m12 0h6m-6 0v2" />
              </svg>
              <input
                type="text"
                id="language"
                name="language"
                placeholder="e.g., Spanish"
                value={newLanguage.language}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700">Proficiency Level</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <select
                id="proficiency"
                name="proficiency"
                value={newLanguage.proficiency}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="" disabled>Select proficiency</option>
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>

          <AddButton
            text="Add Language"
            type="button" // Important: This is a button to add, not submit the form
            onClick={addLanguage}
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
