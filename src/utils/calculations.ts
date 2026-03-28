import type { ClassSlot, HolidayPeriod, PaymentOffer, FixedCharge, SimulationEntry } from '../types';

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function calculateSeasonWeeks(
  startDate: string,
  endDate: string,
  holidays: HolidayPeriod[]
): number {
  if (!startDate || !endDate) return 0;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start >= end) return 0;

  let weeks = 0;
  let current = getMonday(start);

  while (current <= end) {
    const weekEnd = addDays(current, 6);
    const isHoliday = holidays.some((h) => {
      const hStart = parseDate(h.startDate);
      const hEnd = parseDate(h.endDate);
      return current <= hEnd && weekEnd >= hStart;
    });
    if (!isHoliday) weeks++;
    current = addDays(current, 7);
  }

  return weeks;
}

export function calculateWeeklyHours(classes: ClassSlot[]): number {
  return classes.reduce((sum, c) => sum + c.durationHours, 0);
}

export function calculateAnnualCost(
  rentPerHour: number,
  weeklyHours: number,
  seasonWeeks: number,
  fixedCharges: FixedCharge[]
): number {
  const rentCost = rentPerHour * weeklyHours * seasonWeeks;
  const fixedCost = fixedCharges.reduce((sum, c) => sum + c.annualAmount, 0);
  return rentCost + fixedCost;
}

export function calculatePricePerClass(
  offer: PaymentOffer,
  seasonWeeks: number
): number | null {
  switch (offer.type) {
    case 'trial':
    case 'dropin':
      return offer.price;
    case 'package':
      return offer.classCount && offer.classCount > 0
        ? offer.price / offer.classCount
        : null;
    case 'annual':
      return offer.hoursPerWeek && offer.hoursPerWeek > 0 && seasonWeeks > 0
        ? offer.price / (seasonWeeks * offer.hoursPerWeek)
        : null;
    case 'unlimited':
      return seasonWeeks > 0 ? offer.price / seasonWeeks : null;
  }
}

export function calculateOfferRevenue(
  offer: PaymentOffer,
  studentCount: number
): number {
  return offer.price * studentCount;
}

export function calculateTotalRevenue(
  offers: PaymentOffer[],
  simulation: SimulationEntry[]
): number {
  return simulation.reduce((total, entry) => {
    const offer = offers.find((o) => o.id === entry.offerId);
    if (!offer) return total;
    return total + calculateOfferRevenue(offer, entry.studentCount);
  }, 0);
}

const TYPE_WEIGHTS: Record<string, number> = {
  trial: 0.03,
  dropin: 0.12,
  package: 0.20,
  annual: 0.35,
  unlimited: 0.30,
};

export function calculateEquilibrium(
  annualCost: number,
  offers: PaymentOffer[]
): SimulationEntry[] {
  if (offers.length === 0 || annualCost <= 0) {
    return offers.map((o) => ({ offerId: o.id, studentCount: 0 }));
  }

  // Normalize weights for present offer types
  const totalWeight = offers.reduce((sum, o) => sum + (TYPE_WEIGHTS[o.type] || 0.1), 0);

  const entries: SimulationEntry[] = offers.map((offer) => {
    const weight = (TYPE_WEIGHTS[offer.type] || 0.1) / totalWeight;
    const targetRevenue = annualCost * weight;
    const count = offer.price > 0 ? Math.ceil(targetRevenue / offer.price) : 0;
    return { offerId: offer.id, studentCount: count };
  });

  // Verify total meets target, adjust if needed
  let totalRev = entries.reduce((sum, entry) => {
    const offer = offers.find((o) => o.id === entry.offerId);
    return sum + (offer ? offer.price * entry.studentCount : 0);
  }, 0);

  // If short, increment the highest-priced offer
  if (totalRev < annualCost) {
    const sorted = [...offers].sort((a, b) => b.price - a.price);
    for (const offer of sorted) {
      const entry = entries.find((e) => e.offerId === offer.id);
      if (entry && offer.price > 0) {
        while (totalRev < annualCost) {
          entry.studentCount++;
          totalRev += offer.price;
        }
        break;
      }
    }
  }

  return entries;
}
