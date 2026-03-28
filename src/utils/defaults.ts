import type { SimulatorState } from '../types';

export const defaultState: SimulatorState = {
  currentStep: 1,
  classes: [
    { id: '1', name: 'Salsa Débutant', day: 0, time: '19:00', durationHours: 1 },
    { id: '2', name: 'Salsa Intermédiaire', day: 0, time: '20:00', durationHours: 1 },
    { id: '3', name: 'Bachata Débutant', day: 1, time: '19:00', durationHours: 1 },
    { id: '4', name: 'Bachata Intermédiaire', day: 1, time: '20:00', durationHours: 1 },
    { id: '5', name: 'Kizomba Débutant', day: 2, time: '19:00', durationHours: 1 },
    { id: '6', name: 'Kizomba Intermédiaire', day: 2, time: '20:00', durationHours: 1 },
    { id: '7', name: 'Salsa Avancé', day: 3, time: '19:00', durationHours: 1 },
    { id: '8', name: 'Pratique Libre', day: 3, time: '20:00', durationHours: 1 },
  ],
  season: {
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    holidays: [
      { id: 'h1', name: 'Toussaint', startDate: '2025-10-18', endDate: '2025-11-03' },
      { id: 'h2', name: 'Noël', startDate: '2025-12-20', endDate: '2026-01-05' },
      { id: 'h3', name: 'Hiver', startDate: '2026-02-14', endDate: '2026-03-02' },
      { id: 'h4', name: 'Printemps', startDate: '2026-04-11', endDate: '2026-04-27' },
    ],
  },
  offers: [
    { id: 'o1', type: 'trial', label: "Cours d'essai", price: 5 },
    { id: 'o2', type: 'dropin', label: 'Cours unité', price: 15 },
    { id: 'o3', type: 'package', label: 'Carte 10 cours', price: 140, classCount: 10 },
    { id: 'o4', type: 'annual', label: 'Pass annuel 1h', price: 400, hoursPerWeek: 1 },
    { id: 'o5', type: 'annual', label: 'Pass annuel 2h', price: 600, hoursPerWeek: 2 },
    { id: 'o6', type: 'annual', label: 'Pass annuel 3h', price: 730, hoursPerWeek: 3 },
    { id: 'o7', type: 'unlimited', label: 'Pass annuel illimité', price: 850 },
  ],
  charges: {
    rentPerHour: 45,
    instructorHourlyRate: 0,
    fixedCharges: [],
  },
  simulation: [],
};
