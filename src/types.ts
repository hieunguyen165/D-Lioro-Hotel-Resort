export enum Season {
  LOW = 'LOW',
  HIGH = 'HIGH',
  HOLIDAY = 'HOLIDAY',
}

export enum OccupancyLevel {
  OVER_70 = 'OVER_70',
  BETWEEN_30_70 = 'BETWEEN_30_70',
  UNDER_30 = 'UNDER_30',
}

export interface RoomRate {
  code: string;
  name: string;
  area: number;
  quantity: number;
  rates: {
    [Season.HIGH]: {
      [OccupancyLevel.OVER_70]: number;
      [OccupancyLevel.BETWEEN_30_70]: number;
      [OccupancyLevel.UNDER_30]: number;
    };
    [Season.LOW]: {
      [OccupancyLevel.OVER_70]: number;
      [OccupancyLevel.BETWEEN_30_70]: number;
      [OccupancyLevel.UNDER_30]: number;
    };
    [Season.HOLIDAY]: {
      [OccupancyLevel.OVER_70]: number;
      [OccupancyLevel.BETWEEN_30_70]: number;
      [OccupancyLevel.UNDER_30]: number;
    };
  };
}

export interface SelectedRoom {
  roomCode: string;
  count: number;
}

export interface QuotationData {
  guestName: string;
  checkIn: string;
  checkOut: string;
  rooms: SelectedRoom[];
  occupancyLevel: OccupancyLevel;
  childrenUnder12: number;
  childrenOver12: number;
  extraAdults: number;
  extraBeds: number;
  notes: string;
}

export interface SeasonRange {
  start: string;
  end: string;
}

export interface SeasonConfig {
  [Season.LOW]: SeasonRange[];
  [Season.HIGH]: SeasonRange[];
  [Season.HOLIDAY]: SeasonRange[];
}

export interface SurchargeRules {
  childUnder12: number;
  childOver12: number;
  extraAdult: number;
  extraBed: number;
}
