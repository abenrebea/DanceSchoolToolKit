import { Plus, Trash2, Clock } from 'lucide-react';
import { useSimulatorContext } from '../context/SimulatorContext';
import { useSimulator } from '../hooks/useSimulator';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function WeeklySchedule() {
  const { state, dispatch } = useSimulatorContext();
  const { weeklyHours } = useSimulator();

  const addClass = () => {
    dispatch({
      type: 'ADD_CLASS',
      classSlot: {
        id: crypto.randomUUID(),
        name: '',
        day: 0,
        time: '19:00',
        durationHours: 1,
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-600" />
          Emploi du temps hebdomadaire
        </h2>
        <button
          onClick={addClass}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un cours
        </button>
      </div>

      {state.classes.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          Aucun cours défini. Cliquez sur "Ajouter un cours" pour commencer.
        </p>
      ) : (
        <div className="space-y-3">
          {state.classes.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <input
                type="text"
                placeholder="Nom du cours"
                value={cls.name}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CLASS',
                    classSlot: { ...cls, name: e.target.value },
                  })
                }
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <select
                value={cls.day}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CLASS',
                    classSlot: { ...cls, day: Number(e.target.value) },
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={cls.time}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CLASS',
                    classSlot: { ...cls, time: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={cls.durationHours}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_CLASS',
                      classSlot: {
                        ...cls,
                        durationHours: parseFloat(e.target.value) || 0.5,
                      },
                    })
                  }
                  className="w-16 px-2 py-2 border border-gray-200 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
                <span className="text-sm text-gray-500">h</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_CLASS', id: cls.id })}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-brand-50 rounded-lg text-brand-800 font-medium text-sm">
        Total : {weeklyHours}h / semaine — {state.classes.length} cours
      </div>
    </div>
  );
}
