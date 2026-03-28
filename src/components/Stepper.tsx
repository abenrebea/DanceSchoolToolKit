import { Calendar, CalendarDays, CreditCard, Receipt, BarChart3, Check } from 'lucide-react';

const steps = [
  { label: 'Emploi du temps', icon: Calendar },
  { label: 'Calendrier', icon: CalendarDays },
  { label: 'Offres tarifaires', icon: CreditCard },
  { label: 'Charges', icon: Receipt },
  { label: 'Simulation', icon: BarChart3 },
];

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-4 mb-8 px-2">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const Icon = step.icon;

        return (
          <div key={stepNum} className="flex items-center">
            <button
              onClick={() => onStepClick(stepNum)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? 'text-brand-600'
                  : isCompleted
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'border-brand-600 bg-brand-50'
                    : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block max-w-[80px] text-center leading-tight">
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`w-6 sm:w-12 h-0.5 mx-1 ${
                  stepNum < currentStep ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
