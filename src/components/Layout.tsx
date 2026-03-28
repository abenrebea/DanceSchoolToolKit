import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSimulatorContext } from '../context/SimulatorContext';
import Stepper from './Stepper';
import WeeklySchedule from './WeeklySchedule';
import SeasonCalendar from './SeasonCalendar';
import PaymentOffers from './PaymentOffers';
import Charges from './Charges';
import Simulation from './Simulation';

const stepComponents = [WeeklySchedule, SeasonCalendar, PaymentOffers, Charges, Simulation];

export default function Layout() {
  const { state, dispatch } = useSimulatorContext();
  const { currentStep } = state;

  const goTo = (step: number) => {
    if (step >= 1 && step <= 5) dispatch({ type: 'SET_STEP', step });
  };

  const StepComponent = stepComponents[currentStep - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
        Simulateur de Revenus
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Professeur indépendant — Danse, Yoga, Pilates...
      </p>

      <Stepper currentStep={currentStep} onStepClick={goTo} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <StepComponent />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => goTo(currentStep - 1)}
          disabled={currentStep === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>
        <button
          onClick={() => goTo(currentStep + 1)}
          disabled={currentStep === 5}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
