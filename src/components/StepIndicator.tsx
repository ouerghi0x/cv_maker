'use client';

import React from 'react';

type StepIndicatorProps = {
  currentStep: number;
  stepTitles: string[]; // Array of titles for each step
};

const StepIndicator = ({ currentStep, stepTitles }: StepIndicatorProps) => {
  return (
    // Added h-full to make the sidebar take the full height of its parent flex item
    <div className="w-64 p-6 bg-white rounded-xl shadow-lg mr-8 h-full sticky top-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Progress</h3>
      {/* Increased space-y for better vertical distance between steps */}
      <ul className="space-y-8">
        {stepTitles.map((title, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = index < currentStep;

          // Determine text color based on step status
          const textColor = isCurrent ? 'text-green-600 font-bold' : isCompleted ? 'text-gray-500' : 'text-gray-400';
          // Determine dot color based on step status
          const dotColor = isCurrent ? 'bg-green-600' : isCompleted ? 'bg-gray-500' : 'bg-gray-300';

          return (
            <li key={index} className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${dotColor}`}></span>
              <span className={`${textColor} text-base`}>{title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepIndicator;
