import { Plus, Trash2, Receipt } from 'lucide-react';
import { useSimulatorContext } from '../context/SimulatorContext';
import { useSimulator } from '../hooks/useSimulator';

export default function Charges() {
  const { state, dispatch } = useSimulatorContext();
  const { weeklyHours, seasonWeeks, annualCost } = useSimulator();

  const weeklyRent = state.charges.rentPerHour * weeklyHours;
  const annualRent = weeklyRent * seasonWeeks;
  const weeklyInstructor = state.charges.instructorHourlyRate * weeklyHours;
  const annualInstructor = weeklyInstructor * seasonWeeks;
  const fixedTotal = state.charges.fixedCharges.reduce(
    (sum, c) => sum + c.annualAmount,
    0
  );

  const addCharge = () => {
    dispatch({
      type: 'ADD_FIXED_CHARGE',
      charge: {
        id: crypto.randomUUID(),
        label: '',
        annualAmount: 0,
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-brand-600" />
        Charges
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Loyer studio par heure
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={1}
              value={state.charges.rentPerHour}
              onChange={(e) =>
                dispatch({
                  type: 'SET_RENT',
                  rentPerHour: parseFloat(e.target.value) || 0,
                })
              }
              className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <span className="text-sm text-gray-500">EUR / heure</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Rémunération Prof par heure
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={1}
              value={state.charges.instructorHourlyRate}
              onChange={(e) =>
                dispatch({
                  type: 'SET_INSTRUCTOR_RATE',
                  instructorHourlyRate: parseFloat(e.target.value) || 0,
                })
              }
              className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <span className="text-sm text-gray-500">EUR / heure</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Loyer hebdo</div>
          <div className="text-lg font-semibold text-gray-800">
            {weeklyRent.toLocaleString('fr-FR')} EUR
          </div>
          <div className="text-xs text-gray-400">
            {state.charges.rentPerHour} EUR x {weeklyHours}h
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Loyer annuel</div>
          <div className="text-lg font-semibold text-gray-800">
            {annualRent.toLocaleString('fr-FR')} EUR
          </div>
          <div className="text-xs text-gray-400">
            {weeklyRent} EUR x {seasonWeeks} sem.
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Rémun. annuelle</div>
          <div className="text-lg font-semibold text-gray-800">
            {annualInstructor.toLocaleString('fr-FR')} EUR
          </div>
          <div className="text-xs text-gray-400">
            {state.charges.instructorHourlyRate} EUR x {weeklyHours}h x {seasonWeeks} sem.
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total charges</div>
          <div className="text-lg font-bold text-red-600">
            {annualCost.toLocaleString('fr-FR')} EUR
          </div>
          {fixedTotal > 0 && (
            <div className="text-xs text-gray-400">
              dont {fixedTotal.toLocaleString('fr-FR')} EUR frais fixes
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Frais fixes supplémentaires
        </h3>
        <button
          onClick={addCharge}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {state.charges.fixedCharges.length === 0 ? (
        <p className="text-gray-400 text-center py-4 text-sm">
          Aucun frais fixe supplémentaire.
        </p>
      ) : (
        <div className="space-y-2">
          {state.charges.fixedCharges.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <input
                type="text"
                placeholder="Libellé (ex: Assurance)"
                value={c.label}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIXED_CHARGE',
                    charge: { ...c, label: e.target.value },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={c.annualAmount}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIXED_CHARGE',
                      charge: {
                        ...c,
                        annualAmount: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-28 px-3 py-2 border border-gray-200 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
                <span className="text-sm text-gray-500">EUR/an</span>
              </div>
              <button
                onClick={() =>
                  dispatch({ type: 'REMOVE_FIXED_CHARGE', id: c.id })
                }
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
