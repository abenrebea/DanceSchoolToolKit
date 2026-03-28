import { BarChart3, RotateCcw, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useSimulator } from '../hooks/useSimulator';
import { calculateOfferRevenue } from '../utils/calculations';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function getOccupancyColor(total: number): string {
  if (total < 5) return 'bg-green-50';
  if (total < 10) return 'bg-yellow-50';
  if (total < 15) return 'bg-orange-50';
  return 'bg-red-50';
}

const TYPE_COLORS: Record<string, string> = {
  trial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  dropin: 'bg-blue-100 text-blue-800 border-blue-200',
  package: 'bg-purple-100 text-purple-800 border-purple-200',
  annual: 'bg-green-100 text-green-800 border-green-200',
  unlimited: 'bg-orange-100 text-orange-800 border-orange-200',
};

const TYPE_LABELS: Record<string, string> = {
  trial: "Essais vendus",
  dropin: "Cours unités vendus",
  package: "Forfaits vendus",
  annual: "Abonnés",
  unlimited: "Abonnés illimité",
};

function getSliderMax(type: string): number {
  switch (type) {
    case 'trial': return 100;
    case 'dropin': return 200;
    case 'package': return 50;
    case 'annual': return 30;
    case 'unlimited': return 30;
    default: return 50;
  }
}

export default function Simulation() {
  const {
    state,
    dispatch,
    annualCost,
    totalRevenue,
    profitLoss,
    isProfitable,
    equilibrium,
    offersWithPricePerClass,
    classOccupancy,
  } = useSimulator();

  const hasSimulation = state.simulation.length > 0;

  const runSimulation = () => {
    dispatch({ type: 'SET_SIMULATION', simulation: equilibrium });
  };

  const resetToEquilibrium = () => {
    dispatch({ type: 'SET_SIMULATION', simulation: equilibrium });
  };

  const getStudentCount = (offerId: string) => {
    const entry = state.simulation.find((s) => s.offerId === offerId);
    return entry?.studentCount ?? 0;
  };

  if (!hasSimulation) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Simulation</h2>
        <p className="text-gray-500 mb-2">
          Charges annuelles totales :{' '}
          <span className="font-bold text-red-600">
            {annualCost.toLocaleString('fr-FR')} EUR
          </span>
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Cliquez sur "Simuler" pour calculer le point d'équilibre et ajuster la
          répartition des élèves.
        </p>
        <button
          onClick={runSimulation}
          className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-lg font-medium"
        >
          Simuler
        </button>
      </div>
    );
  }

  const revenuePercent = annualCost > 0 ? Math.min((totalRevenue / annualCost) * 100, 200) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600" />
          Simulation
        </h2>
        <button
          onClick={resetToEquilibrium}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser à l'équilibre
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sliders */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Répartition des élèves / ventes
          </h3>
          {offersWithPricePerClass.map((offer) => {
            const count = getStudentCount(offer.id);
            const revenue = calculateOfferRevenue(offer, count);
            const colors = TYPE_COLORS[offer.type] || '';
            const sliderMax = Math.max(getSliderMax(offer.type), count + 10);

            return (
              <div
                key={offer.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${colors}`}
                    >
                      {offer.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {TYPE_LABELS[offer.type] || 'Quantité'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {revenue.toLocaleString('fr-FR')} EUR
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={sliderMax}
                    value={count}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_SIMULATION_ENTRY',
                        offerId: offer.id,
                        studentCount: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <input
                    type="number"
                    min={0}
                    value={count}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_SIMULATION_ENTRY',
                        offerId: offer.id,
                        studentCount: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-16 px-2 py-1 border border-gray-200 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                </div>
                {offer.pricePerClass !== null && (
                  <div className="text-xs text-gray-400 mt-1">
                    {offer.price.toLocaleString('fr-FR')} EUR x {count} = {revenue.toLocaleString('fr-FR')} EUR
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div
              className={`p-6 rounded-xl border-2 ${
                isProfitable
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                {isProfitable ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
                <span
                  className={`text-lg font-bold ${
                    isProfitable ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {isProfitable ? 'Rentable' : 'Déficitaire'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Revenus annuels
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {totalRevenue.toLocaleString('fr-FR')} EUR
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Charges annuelles
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {annualCost.toLocaleString('fr-FR')} EUR
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Résultat net
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      isProfitable ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {profitLoss >= 0 ? '+' : ''}
                    {profitLoss.toLocaleString('fr-FR')} EUR
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>0</span>
                  <span>Équilibre</span>
                  <span>200%</span>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isProfitable ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(revenuePercent / 2, 100)}%` }}
                  />
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-800" />
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Offre
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      Nb
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      Revenu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offersWithPricePerClass.map((offer) => {
                    const count = getStudentCount(offer.id);
                    const revenue = calculateOfferRevenue(offer, count);
                    return (
                      <tr key={offer.id} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-700">{offer.label}</td>
                        <td className="px-3 py-2 text-right text-gray-600">
                          {count}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-800">
                          {revenue.toLocaleString('fr-FR')} EUR
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-green-50 border-b border-gray-200">
                    <td colSpan={2} className="px-3 py-2 font-medium text-green-800">
                      Total revenus
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-green-700">
                      {totalRevenue.toLocaleString('fr-FR')} EUR
                    </td>
                  </tr>
                  <tr className="bg-red-50 border-b border-gray-200">
                    <td colSpan={2} className="px-3 py-2 font-medium text-red-800">
                      Total charges
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-red-600">
                      -{annualCost.toLocaleString('fr-FR')} EUR
                    </td>
                  </tr>
                  <tr
                    className={
                      isProfitable ? 'bg-green-100' : 'bg-red-100'
                    }
                  >
                    <td
                      colSpan={2}
                      className={`px-3 py-2 font-bold ${
                        isProfitable ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      Résultat
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-bold ${
                        isProfitable ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {profitLoss >= 0 ? '+' : ''}
                      {profitLoss.toLocaleString('fr-FR')} EUR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Occupancy per class */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-brand-600" />
          Occupation par cours (moyenne hebdomadaire)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cours</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Jour</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Horaire</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-yellow-600">Essais</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-blue-600">Unités</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-purple-600">Forfaits</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-green-600">Annuels</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-orange-600">Illimité</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {[...state.classes]
                .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                .map((cls) => {
                  const occ = classOccupancy.find((o) => o.classId === cls.id);
                  const total = occ?.total ?? 0;
                  return (
                    <tr key={cls.id} className={`border-b border-gray-100 ${getOccupancyColor(total)}`}>
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {cls.name || 'Sans nom'}
                      </td>
                      <td className="px-3 py-2 text-gray-600">{DAYS[cls.day]}</td>
                      <td className="px-3 py-2 text-gray-600">{cls.time}</td>
                      <td className="px-3 py-2 text-right text-yellow-700">
                        {(occ?.byType.trial ?? 0).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-blue-700">
                        {(occ?.byType.dropin ?? 0).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-purple-700">
                        {(occ?.byType.package ?? 0).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-green-700">
                        {(occ?.byType.annual ?? 0).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right text-orange-700">
                        {(occ?.byType.unlimited ?? 0).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-gray-900">
                        {total.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Répartition estimée en supposant une distribution uniforme des élèves sur tous les cours.
          Les abonnés illimité sont présents à tous les cours non superposés.
        </p>
      </div>
    </div>
  );
}
