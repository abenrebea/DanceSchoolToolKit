import { Plus, Trash2, CreditCard } from 'lucide-react';
import { useSimulatorContext } from '../context/SimulatorContext';
import { useSimulator } from '../hooks/useSimulator';
import type { OfferType } from '../types';

const OFFER_TYPES: { value: OfferType; label: string; color: string }[] = [
  { value: 'trial', label: "Cours d'essai", color: 'bg-yellow-100 text-yellow-800' },
  { value: 'dropin', label: 'Cours unité', color: 'bg-blue-100 text-blue-800' },
  { value: 'package', label: 'Carte / Forfait', color: 'bg-purple-100 text-purple-800' },
  { value: 'annual', label: 'Pass annuel', color: 'bg-green-100 text-green-800' },
  { value: 'unlimited', label: 'Pass illimité', color: 'bg-orange-100 text-orange-800' },
];

function getOfferTypeInfo(type: OfferType) {
  return OFFER_TYPES.find((t) => t.value === type) || OFFER_TYPES[0];
}

export default function PaymentOffers() {
  const { dispatch } = useSimulatorContext();
  const { offersWithPricePerClass, seasonWeeks } = useSimulator();

  const addOffer = (type: OfferType) => {
    const info = getOfferTypeInfo(type);
    dispatch({
      type: 'ADD_OFFER',
      offer: {
        id: crypto.randomUUID(),
        type,
        label: info.label,
        price: 0,
        ...(type === 'package' ? { classCount: 10 } : {}),
        ...(type === 'annual' ? { hoursPerWeek: 1 } : {}),
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-brand-600" />
        Offres tarifaires
      </h2>

      {offersWithPricePerClass.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          Aucune offre définie. Ajoutez vos tarifs ci-dessous.
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {offersWithPricePerClass.map((offer) => {
            const typeInfo = getOfferTypeInfo(offer.type);
            return (
              <div
                key={offer.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}
                  >
                    {typeInfo.label}
                  </span>

                  <div className="flex-1 min-w-[160px]">
                    <input
                      type="text"
                      value={offer.label}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_OFFER',
                          offer: { ...offer, label: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                      placeholder="Nom de l'offre"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={offer.price}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_OFFER',
                          offer: { ...offer, price: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="w-24 px-3 py-2 border border-gray-200 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-300"
                      placeholder="Prix"
                    />
                    <span className="text-sm text-gray-500">EUR</span>
                  </div>

                  {offer.type === 'package' && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={offer.classCount || 10}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_OFFER',
                            offer: {
                              ...offer,
                              classCount: parseInt(e.target.value) || 1,
                            },
                          })
                        }
                        className="w-16 px-2 py-2 border border-gray-200 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                      />
                      <span className="text-sm text-gray-500">cours</span>
                    </div>
                  )}

                  {offer.type === 'annual' && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        value={offer.hoursPerWeek || 1}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_OFFER',
                            offer: {
                              ...offer,
                              hoursPerWeek: parseInt(e.target.value) || 1,
                            },
                          })
                        }
                        className="w-16 px-2 py-2 border border-gray-200 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                      />
                      <span className="text-sm text-gray-500">h/sem</span>
                    </div>
                  )}

                  <button
                    onClick={() => dispatch({ type: 'REMOVE_OFFER', id: offer.id })}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {offer.pricePerClass !== null && offer.price > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    soit {offer.pricePerClass.toFixed(2)} EUR / cours
                    {offer.type === 'annual' &&
                      ` sur ${seasonWeeks} semaines x ${offer.hoursPerWeek}h`}
                    {offer.type === 'unlimited' && ` sur ${seasonWeeks} semaines`}
                    {offer.type === 'package' && ` (${offer.classCount} cours)`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {OFFER_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => addOffer(t.value)}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors`}
          >
            <Plus className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
