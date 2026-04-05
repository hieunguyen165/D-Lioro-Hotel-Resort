import { Season, OccupancyLevel, QuotationData, SeasonConfig, RoomRate, SurchargeRules } from '../types';
import { SEASONS_2026, ROOM_RATES, SURCHARGE_RULES } from '../constants';

export const getSeasonForDate = (dateStr: string, seasons: SeasonConfig = SEASONS_2026): Season => {
  const date = new Date(dateStr);
  
  // Check Holiday first
  for (const range of seasons[Season.HOLIDAY]) {
    if (date >= new Date(range.start) && date <= new Date(range.end)) {
      return Season.HOLIDAY;
    }
  }

  // Check High
  for (const range of seasons[Season.HIGH]) {
    if (date >= new Date(range.start) && date <= new Date(range.end)) {
      return Season.HIGH;
    }
  }

  // Default to Low
  return Season.LOW;
};

export interface SurchargeItem {
  count: number;
  rate: number;
  total: number;
}

export interface QuotationResult {
  numNights: number;
  totalRoomCount: number;
  rooms: { code: string; name: string; count: number; totalRate: number }[];
  totalRoomRate: number;
  totalSurcharge: number;
  grandTotal: number;
  surchargeBreakdown: {
    childrenUnder12: SurchargeItem;
    childrenOver12: SurchargeItem;
    extraAdults: SurchargeItem;
    extraBeds: SurchargeItem;
  };
}

export const calculateQuotation = (
  data: QuotationData, 
  customRates: RoomRate[] = ROOM_RATES,
  customSeasons: SeasonConfig = SEASONS_2026,
  customSurcharges: SurchargeRules = SURCHARGE_RULES
): QuotationResult | null => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return null;
  }

  const numNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  let totalRoomRate = 0;
  let totalRoomCount = 0;
  const roomResults: { code: string; name: string; count: number; totalRate: number }[] = [];

  for (const selectedRoom of data.rooms) {
    const room = customRates.find(r => r.code === selectedRoom.roomCode);
    if (!room) continue;

    let roomTypeTotalRate = 0;
    let currentDate = new Date(checkIn);
    
    while (currentDate < checkOut) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const season = getSeasonForDate(dateStr, customSeasons);
      const rate = room.rates[season][data.occupancyLevel];
      roomTypeTotalRate += rate;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalForThisRoomType = roomTypeTotalRate * selectedRoom.count;
    totalRoomRate += totalForThisRoomType;
    totalRoomCount += selectedRoom.count;
    roomResults.push({
      code: room.code,
      name: room.name,
      count: selectedRoom.count,
      totalRate: totalForThisRoomType
    });
  }

  if (totalRoomCount === 0) return null;

  const surchargesPerNight = 
    (data.childrenUnder12 * customSurcharges.childUnder12) +
    (data.childrenOver12 * customSurcharges.childOver12) +
    (data.extraAdults * customSurcharges.extraAdult) +
    (data.extraBeds * customSurcharges.extraBed);

  const totalSurcharge = surchargesPerNight * numNights;
  const grandTotal = totalRoomRate + totalSurcharge;

  return {
    numNights,
    totalRoomCount,
    rooms: roomResults,
    totalRoomRate,
    totalSurcharge,
    grandTotal,
    surchargeBreakdown: {
      childrenUnder12: { count: data.childrenUnder12, rate: customSurcharges.childUnder12, total: data.childrenUnder12 * customSurcharges.childUnder12 * numNights },
      childrenOver12: { count: data.childrenOver12, rate: customSurcharges.childOver12, total: data.childrenOver12 * customSurcharges.childOver12 * numNights },
      extraAdults: { count: data.extraAdults, rate: customSurcharges.extraAdult, total: data.extraAdults * customSurcharges.extraAdult * numNights },
      extraBeds: { count: data.extraBeds, rate: customSurcharges.extraBed, total: data.extraBeds * customSurcharges.extraBed * numNights },
    }
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
