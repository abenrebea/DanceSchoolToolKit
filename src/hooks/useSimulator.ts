import { useMemo } from 'react';
import { useSimulatorContext } from '../context/SimulatorContext';
import {
  calculateSeasonWeeks,
  calculateWeeklyHours,
  calculateAnnualCost,
  calculatePricePerClass,
  calculateTotalRevenue,
  calculateEquilibrium,
} from '../utils/calculations';

export function useSimulator() {
  const { state, dispatch } = useSimulatorContext();

  const seasonWeeks = useMemo(
    () =>
      calculateSeasonWeeks(
        state.season.startDate,
        state.season.endDate,
        state.season.holidays
      ),
    [state.season.startDate, state.season.endDate, state.season.holidays]
  );

  const weeklyHours = useMemo(
    () => calculateWeeklyHours(state.classes),
    [state.classes]
  );

  const annualCost = useMemo(
    () =>
      calculateAnnualCost(
        state.charges.rentPerHour,
        weeklyHours,
        seasonWeeks,
        state.charges.fixedCharges
      ),
    [state.charges.rentPerHour, weeklyHours, seasonWeeks, state.charges.fixedCharges]
  );

  const offersWithPricePerClass = useMemo(
    () =>
      state.offers.map((o) => ({
        ...o,
        pricePerClass: calculatePricePerClass(o, seasonWeeks),
      })),
    [state.offers, seasonWeeks]
  );

  const totalRevenue = useMemo(
    () => calculateTotalRevenue(state.offers, state.simulation),
    [state.offers, state.simulation]
  );

  const profitLoss = totalRevenue - annualCost;
  const isProfitable = profitLoss >= 0;

  const equilibrium = useMemo(
    () => calculateEquilibrium(annualCost, state.offers),
    [annualCost, state.offers]
  );

  return {
    seasonWeeks,
    weeklyHours,
    annualCost,
    offersWithPricePerClass,
    totalRevenue,
    profitLoss,
    isProfitable,
    equilibrium,
    state,
    dispatch,
  };
}
