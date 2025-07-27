'use client';

import React, { useState } from 'react';

// A simple AddButton component (assuming it's not provided externally or needs a basic version)
const AddButton = ({ text, style, onClick, type = 'button' }: { text: string; style: string; onClick?: () => void; type?: "button" | "submit" | "reset" }) => (
  <button type={type} className={style} onClick={onClick}>
    {text}
  </button>
);

// Define the type for a single project entry
type Project = {
  projectName: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string; // Renamed 'date' to 'endDate' for clarity
};

// Define the props for the PersonalProjects component
type PersonalProjectsProps = {
  next: () => void;
  prev: () => void;
  // onChange now expects an array of Project objects
  onChange: (projects: Project[]) => void;
  initialData?: Project[]; // Optional prop to pre-fill the form
};

export default function PersonalProjects({ next, prev, onChange, initialData }: PersonalProjectsProps) {
  // State to hold all added project entries
  const [projectEntries, setProjectEntries] = useState<Project[]>(initialData || []);
  // State for the new project entry being added
  const [newProject, setNewProject] = useState<Project>({
    projectName: '',
    description: '',
    technologies: '',
    link: '',
    startDate: '',
    endDate: ''
  });

  // Handles changes to the input fields for a new project entry
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adds the current newProject to the list of project entries
  const addProject = () => {
    if (newProject.projectName && newProject.description && newProject.technologies && newProject.startDate && newProject.endDate) {
      setProjectEntries(prev => [...prev, newProject]);
      // Reset the new project form, keeping link optional
      setNewProject({
        projectName: '',
        description: '',
        technologies: '',
        link: '',
        startDate: '',
        endDate: ''
      });
    } else {
      console.log("Please fill in all required fields (Project Name, Description, Technologies, Start Date, Completion Date) for the project entry.");
    }
  };

  // Handles the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(projectEntries); // Pass the array of project entries back to the parent
    next(); // Move to the next step
    console.log("Project Data Submitted:", projectEntries);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Personal Projects</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display existing project entries */}
        {projectEntries.length > 0 && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-700">Added Projects:</h3>
            {projectEntries.map((proj, index) => (
              <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-800">{proj.projectName}</p>
                <p className="text-sm text-gray-600">Technologies: {proj.technologies}</p>
                <p className="text-xs text-gray-500">{proj.startDate} - {proj.endDate}</p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-xs">View Project</a>
                )}
                <p className="text-xs text-gray-500 line-clamp-2">{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form for adding a new project entry */}
        <div className="space-y-2 border p-4 rounded-md bg-blue-50">
          <h3 className="font-semibold text-gray-700">Add New Project:</h3>
          <div className="relative">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <input
                type="text"
                id="projectName"
                name="projectName"
                placeholder="Enter project name"
                value={newProject.projectName}
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
                placeholder="Enter project description"
                value={newProject.description}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">Technologies Used (comma-separated)</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <input
                type="text"
                id="technologies"
                name="technologies"
                placeholder="e.g., React, Node.js, MongoDB"
                value={newProject.technologies}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">Project Link (Optional)</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                type="url"
                id="link"
                name="link"
                placeholder="Enter project link (e.g., GitHub, live demo)"
                value={newProject.link}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
                type="month"
                id="startDate"
                name="startDate"
                value={newProject.startDate}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Completion Date</label>
            <div className="mt-1 flex items-center">
              <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="month"
                id="endDate"
                name="endDate"
                value={newProject.endDate}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
          </div>

          <AddButton
            text="Add Project"
            type="button" // Important: This is a button to add, not submit the form
            onClick={addProject}
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
