'use client';

import React, { useState } from 'react';

// A simple AddButton component defined internally for self-containment.
// In a larger project, this would typically be imported from a shared components directory.
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the props for the PostJobToPostuleFor component, ensuring type safety.
type PostJobToPostuleForProps = {
  next: () => void; // Function to navigate to the next step.
  prev: () => void; // Function to navigate to the previous step.
  onChange: (jobPost: string) => void; // Callback to pass the job post description to the parent.
  initialData?: string; // Optional prop to pre-fill the textarea with existing data.
};

export default function PostJobToPostuleFor({ next, prev, onChange, initialData }: PostJobToPostuleForProps) {
  // State to hold the job post description.
  // Initializes with `initialData` if provided, otherwise with an empty string.
  const [formData, setFormData] = useState({
    post: initialData || ''
  });

  // Handles changes to the textarea input.
  // Updates the `post` field in the `formData` state.
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handles the form submission.
  // Prevents default form behavior, calls `onChange` with the current job post,
  // and then navigates to the next step.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload on form submission.
    onChange(formData.post); // Pass the job post string back to the parent component.
    next(); // Move to the next step in the multi-step form.
    console.log("Job Post Data Submitted:", formData.post); // Log data for debugging.
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Job Post to Apply For</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="mt-1 flex items-center">
            {/* SVG icon for visual enhancement, positioned absolutely within the input container. */}
            <svg className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <textarea
              id="post"
              name="post"
              rows={6} // Provides a larger input area for job descriptions.
              placeholder="Enter the full job post description here. This will be used to tailor your CV."
              value={formData.post}
              onChange={handleChange}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required // Makes this field mandatory for submission.
            ></textarea>
          </div>
        </div>

        {/* Navigation buttons for previous and next steps. */}
        <div className="flex justify-between mt-6">
          <button
            type="button" // Explicitly set as 'button' to prevent form submission.
            onClick={prev} // Calls the `prev` function to go to the previous step.
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            Previous
          </button>
          <AddButton
            text="Save & Next" // Text for the submit button.
            type="submit" // Explicitly set as 'submit' to trigger the form's onSubmit.
            style="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            // The onClick prop is not needed here as the form's onSubmit handles the action.
          />
        </div>
      </form>
    </div>
  );
}
