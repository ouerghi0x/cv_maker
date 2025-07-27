'use client';

import React, { useState } from 'react';

// A simple AddButton component defined internally for self-containment
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the type for a single skill entry
type Skill = {
  skill: string;
  proficiency: string;
};

// Define the props for the PersonalSkills component
type PersonalSkillsProps = {
  next: () => void;
  prev: () => void;
  // onChange now expects an array of Skill objects
  onChange: (key:string,skills: Skill[]) => void;
  initialData?: Skill[]; // Optional prop to pre-fill the form
};

export default function PersonalSkills({ next, prev, onChange, initialData }: PersonalSkillsProps) {
  // State to hold all added skill entries
  const [skillsEntries, setSkillsEntries] = useState<Skill[]>(initialData || []);
  // State for the new skill entry being added
  const [newSkill, setNewSkill] = useState<Skill>({
    skill: '',
    proficiency: ''
  });

  // Handles changes to the input fields for a new skill entry
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  // Adds the current newSkill to the list of skill entries
  const addSkill = () => {
    if (newSkill.skill && newSkill.proficiency) {
      setSkillsEntries(prev => [...prev, newSkill]);
      // Reset the new skill form
      setNewSkill({
        skill: '',
        proficiency: ''
      });
    } else {
      console.log("Please fill in all required fields for the skill entry.");
    }
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange('skills',skillsEntries); // Pass the array of skill entries back to the parent
    next(); // Move to the next step
    console.log("Skill Data Submitted:", skillsEntries);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      {/* Temporary indicator to confirm component rendering */}
      <p className="text-center text-green-500 font-semibold mb-4">Skills Component is Rendering!</p>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Skills</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display existing skill entries */}
        {skillsEntries.length > 0 && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-700">Added Skills:</h3>
            {skillsEntries.map((s, index) => (
              <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-800">{s.skill}</p>
                <p className="text-sm text-gray-600">Proficiency: {s.proficiency}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form for adding a new skill entry */}
        <div className="space-y-2 border p-4 rounded-md bg-blue-50">
          <h3 className="font-semibold text-gray-700">Add New Skill:</h3>
          <div className="relative">
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700">Skill</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.5 3.5 0 005.33 0l.707-.707a3.5 3.5 0 015.33 0l.353.354a3.5 3.5 0 000 4.95l-7.425 7.425a3.5 3.5 0 01-4.95 0l-.354-.354a3.5 3.5 0 010-4.95l.707-.707z" />
              </svg>
              <input
                type="text"
                id="skill"
                name="skill"
                placeholder="e.g., JavaScript"
                value={newSkill.skill}
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
                value={newSkill.proficiency}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="" disabled>Select proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <AddButton
            text="Add Skill"
            type="button" // Important: This is a button to add, not submit the form
            onClick={addSkill}
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
