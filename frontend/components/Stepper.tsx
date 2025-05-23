import React from 'react';

interface StepperProps {
  currentStep: number;
}

const steps = ['Upload Data', 'Select Columns', 'Configure Clusters', 'View Results'];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="flex bg-[#f6fafd] border border-[#e5e7eb] rounded-lg overflow-hidden mb-8">
      {steps.map((step, index) => (
        <div
          key={step}
          className={
            `flex-1 text-center py-2 text-base font-medium transition-colors ` +
            (index === currentStep
              ? 'bg-white text-black shadow-sm border-b-2 border-[#d71e28]' // active
              : 'bg-transparent text-gray-400')
          }
          style={{
            borderRight: index < steps.length - 1 ? '1px solid #e5e7eb' : undefined
          }}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
