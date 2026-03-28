export interface ClassSlot {
  id: string;
  name: string;
  day: number; // 0=Lundi..6=Dimanche
  time: string; // "HH:MM"
  durationHours: number;
}

export interface HolidayPeriod {
  id: string;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;
}

export interface SeasonConfig {
  startDate: string;
  endDate: string;
  holidays: HolidayPeriod[];
}

export type OfferType = 'trial' | 'dropin' | 'package' | 'annual' | 'unlimited';

export interface PaymentOffer {
  id: string;
  type: OfferType;
  label: string;
  price: number;
  classCount?: number; // for 'package'
  hoursPerWeek?: number; // for 'annual'
}

export interface FixedCharge {
  id: string;
  label: string;
  annualAmount: number;
}

export interface ChargesConfig {
  rentPerHour: number;
  instructorHourlyRate: number;
  fixedCharges: FixedCharge[];
}

export interface SimulationEntry {
  offerId: string;
  studentCount: number;
}

export interface ClassOccupancy {
  classId: string;
  total: number;
  byType: Record<OfferType, number>;
}

export interface SimulatorState {
  currentStep: number;
  classes: ClassSlot[];
  season: SeasonConfig;
  offers: PaymentOffer[];
  charges: ChargesConfig;
  simulation: SimulationEntry[];
}
