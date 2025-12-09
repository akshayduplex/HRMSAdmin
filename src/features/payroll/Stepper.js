// src/components/Stepper.js
import React, { useState } from 'react';
// import Step_one from './Step_one';
import StepOne from './OneSteps';
import StepTwo from './StepsTwo';
import StepThree from './ThreeSteps';
import StepFour from './StepperFour';
import StepsFive from './StepsFive';

const steps = [
  { label: 'Pay Period & Employee', content: <StepOne /> },
  { label: 'Employee Work Detail', content: <StepTwo /> },
  { label: 'Review Payroll', content: <StepFour /> },
  { label: 'Success', content: <StepsFive /> },
];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  return (
    <div className='stepper cstmsteppr'>
      <div className='w-35 stepper-header'>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index === currentStep ? 'active' : ''}`}
          >
            <span>{index + 1} </span>
            {step.label}
          </div>
        ))}
      </div>
      <div className='w65'>
        <div className='stepper-content'>{steps[currentStep].content}</div>
        <div className='stepper-actions'>
          <button className={(currentStep === 0) || (currentStep === steps.length - 1) ? 'd-none' : 'sitetransbtn'} onClick={handleBack} disabled={currentStep === 0}>
            Previous
          </button>
          <button className={(currentStep === steps.length - 1) ? 'd-none' : 'sitebluebtn'}
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
