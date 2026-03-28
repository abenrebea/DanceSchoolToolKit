import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type {
  SimulatorState,
  ClassSlot,
  SeasonConfig,
  HolidayPeriod,
  PaymentOffer,
  FixedCharge,
  SimulationEntry,
} from '../types';
import { defaultState } from '../utils/defaults';

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'ADD_CLASS'; classSlot: ClassSlot }
  | { type: 'UPDATE_CLASS'; classSlot: ClassSlot }
  | { type: 'REMOVE_CLASS'; id: string }
  | { type: 'SET_SEASON'; season: Partial<SeasonConfig> }
  | { type: 'ADD_HOLIDAY'; holiday: HolidayPeriod }
  | { type: 'UPDATE_HOLIDAY'; holiday: HolidayPeriod }
  | { type: 'REMOVE_HOLIDAY'; id: string }
  | { type: 'ADD_OFFER'; offer: PaymentOffer }
  | { type: 'UPDATE_OFFER'; offer: PaymentOffer }
  | { type: 'REMOVE_OFFER'; id: string }
  | { type: 'SET_RENT'; rentPerHour: number }
  | { type: 'SET_INSTRUCTOR_RATE'; instructorHourlyRate: number }
  | { type: 'ADD_FIXED_CHARGE'; charge: FixedCharge }
  | { type: 'UPDATE_FIXED_CHARGE'; charge: FixedCharge }
  | { type: 'REMOVE_FIXED_CHARGE'; id: string }
  | { type: 'SET_SIMULATION'; simulation: SimulationEntry[] }
  | { type: 'SET_SIMULATION_ENTRY'; offerId: string; studentCount: number };

function reducer(state: SimulatorState, action: Action): SimulatorState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.classSlot] };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map((c) =>
          c.id === action.classSlot.id ? action.classSlot : c
        ),
      };
    case 'REMOVE_CLASS':
      return { ...state, classes: state.classes.filter((c) => c.id !== action.id) };

    case 'SET_SEASON':
      return { ...state, season: { ...state.season, ...action.season } };
    case 'ADD_HOLIDAY':
      return {
        ...state,
        season: {
          ...state.season,
          holidays: [...state.season.holidays, action.holiday],
        },
      };
    case 'UPDATE_HOLIDAY':
      return {
        ...state,
        season: {
          ...state.season,
          holidays: state.season.holidays.map((h) =>
            h.id === action.holiday.id ? action.holiday : h
          ),
        },
      };
    case 'REMOVE_HOLIDAY':
      return {
        ...state,
        season: {
          ...state.season,
          holidays: state.season.holidays.filter((h) => h.id !== action.id),
        },
      };

    case 'ADD_OFFER':
      return { ...state, offers: [...state.offers, action.offer] };
    case 'UPDATE_OFFER':
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offer.id ? action.offer : o
        ),
      };
    case 'REMOVE_OFFER':
      return {
        ...state,
        offers: state.offers.filter((o) => o.id !== action.id),
        simulation: state.simulation.filter((s) => s.offerId !== action.id),
      };

    case 'SET_RENT':
      return {
        ...state,
        charges: { ...state.charges, rentPerHour: action.rentPerHour },
      };
    case 'SET_INSTRUCTOR_RATE':
      return {
        ...state,
        charges: { ...state.charges, instructorHourlyRate: action.instructorHourlyRate },
      };
    case 'ADD_FIXED_CHARGE':
      return {
        ...state,
        charges: {
          ...state.charges,
          fixedCharges: [...state.charges.fixedCharges, action.charge],
        },
      };
    case 'UPDATE_FIXED_CHARGE':
      return {
        ...state,
        charges: {
          ...state.charges,
          fixedCharges: state.charges.fixedCharges.map((c) =>
            c.id === action.charge.id ? action.charge : c
          ),
        },
      };
    case 'REMOVE_FIXED_CHARGE':
      return {
        ...state,
        charges: {
          ...state.charges,
          fixedCharges: state.charges.fixedCharges.filter(
            (c) => c.id !== action.id
          ),
        },
      };

    case 'SET_SIMULATION':
      return { ...state, simulation: action.simulation };
    case 'SET_SIMULATION_ENTRY':
      return {
        ...state,
        simulation: state.simulation.map((s) =>
          s.offerId === action.offerId
            ? { ...s, studentCount: action.studentCount }
            : s
        ),
      };

    default:
      return state;
  }
}

interface SimulatorContextType {
  state: SimulatorState;
  dispatch: Dispatch<Action>;
}

const SimulatorContext = createContext<SimulatorContextType | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <SimulatorContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulatorContext() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulatorContext must be used within SimulatorProvider');
  }
  return context;
}
