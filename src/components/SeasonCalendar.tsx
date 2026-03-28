import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { useSimulatorContext } from '../context/SimulatorContext';
import { useSimulator } from '../hooks/useSimulator';

export default function SeasonCalendar() {
  const { state, dispatch } = useSimulatorContext();
  const { seasonWeeks } = useSimulator();

  const addHoliday = () => {
    dispatch({
      type: 'ADD_HOLIDAY',
      holiday: {
        id: crypto.randomUUID(),
        name: '',
        startDate: '',
        endDate: '',
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-brand-600" />
        Calendrier de la saison
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Début de saison
          </label>
          <input
            type="date"
            value={state.season.startDate}
            onChange={(e) =>
              dispatch({ type: 'SET_SEASON', season: { startDate: e.target.value } })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fin de saison
          </label>
          <input
            type="date"
            value={state.season.endDate}
            onChange={(e) =>
              dispatch({ type: 'SET_SEASON', season: { endDate: e.target.value } })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Périodes de vacances
        </h3>
        <button
          onClick={addHoliday}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {state.season.holidays.length === 0 ? (
        <p className="text-gray-400 text-center py-4 text-sm">
          Aucune période de vacances définie.
        </p>
      ) : (
        <div className="space-y-2">
          {state.season.holidays.map((h) => (
            <div
              key={h.id}
              className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <input
                type="text"
                placeholder="Nom (ex: Noël)"
                value={h.name}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_HOLIDAY',
                    holiday: { ...h, name: e.target.value },
                  })
                }
                className="flex-1 min-w-[120px] px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <input
                type="date"
                value={h.startDate}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_HOLIDAY',
                    holiday: { ...h, startDate: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <span className="text-gray-400 text-sm">au</span>
              <input
                type="date"
                value={h.endDate}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_HOLIDAY',
                    holiday: { ...h, endDate: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button
                onClick={() => dispatch({ type: 'REMOVE_HOLIDAY', id: h.id })}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-brand-50 rounded-lg text-brand-800 font-medium text-sm">
        Nombre de semaines de cours : {seasonWeeks} semaines
      </div>
    </div>
  );
}
