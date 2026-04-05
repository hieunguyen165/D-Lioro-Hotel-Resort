import { Season, OccupancyLevel, RoomRate, SurchargeRules } from './types';

export const SURCHARGE_RULES: SurchargeRules = {
  childUnder12: 250000,
  childOver12: 400000,
  extraAdult: 400000,
  extraBed: 500000,
};

export const DEFAULT_INCLUDED_POLICIES = `Giá trên đã bao gồm VAT, phí phục vụ.
Nước uống chào đón khi nhận phòng.
Bao gồm ăn sáng cho tối đa 2 người lớn/ phòng.
Miễn phí 02 chai nước tinh khiết mỗi ngày.
Miễn phí trà và cafe trong phòng.
Miễn phí truy cập wifi không giới hạn.
Miễn phí xe điện, xe đạp nội khu và điểm đỗ xe an toàn.
Miễn phí sử dụng bể bơi trong nhà, bể bơi vô cực không giới hạn.`;

export const DEFAULT_TERMS_CONDITIONS = `Trẻ em dưới 6 tuổi: 100% miễn phí ngủ ghép và ăn sáng.
Trẻ em từ 6 - 11 tuổi: Tính tiền 250,000 VND/trẻ/đêm tiền ăn sáng ở ghép phòng với bố mẹ và trên 12 tuổi tính tiền 400,000 VND/người/đêm khi ghép chung giường cùng bố mẹ.
Giường phụ: 500,000 VND đã bao gồm ăn sáng.`;

export const SEASONS_2026 = {
  [Season.LOW]: [
    { start: '2026-01-02', end: '2026-02-17' },
    { start: '2026-02-25', end: '2026-04-29' },
    { start: '2026-05-03', end: '2026-05-24' },
    { start: '2026-08-16', end: '2026-08-28' },
    { start: '2026-09-03', end: '2026-12-30' },
  ],
  [Season.HIGH]: [
    { start: '2026-05-25', end: '2026-08-15' },
  ],
  [Season.HOLIDAY]: [
    { start: '2026-02-18', end: '2026-02-24' },
    { start: '2026-04-30', end: '2026-05-02' },
    { start: '2026-08-29', end: '2026-09-02' },
    { start: '2026-12-24', end: '2026-12-25' },
    { start: '2026-12-31', end: '2026-12-31' },
    { start: '2027-01-01', end: '2027-01-01' },
  ],
};

export const ROOM_RATES: RoomRate[] = [
  {
    code: 'SDD',
    name: 'Senior Deluxe Double',
    area: 35,
    quantity: 10,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 2400000, [OccupancyLevel.BETWEEN_30_70]: 2040000, [OccupancyLevel.UNDER_30]: 1920000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 1700000, [OccupancyLevel.BETWEEN_30_70]: 1445000, [OccupancyLevel.UNDER_30]: 1360000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 2900000, [OccupancyLevel.BETWEEN_30_70]: 2465000, [OccupancyLevel.UNDER_30]: 2320000 },
    },
  },
  {
    code: 'SDT',
    name: 'Senior Deluxe Twin',
    area: 35,
    quantity: 22,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 2400000, [OccupancyLevel.BETWEEN_30_70]: 2040000, [OccupancyLevel.UNDER_30]: 1920000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 1700000, [OccupancyLevel.BETWEEN_30_70]: 1445000, [OccupancyLevel.UNDER_30]: 1360000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 2900000, [OccupancyLevel.BETWEEN_30_70]: 2465000, [OccupancyLevel.UNDER_30]: 2320000 },
    },
  },
  {
    code: 'PET',
    name: 'Premium Excutive Twin',
    area: 44,
    quantity: 32,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 2800000, [OccupancyLevel.BETWEEN_30_70]: 2380000, [OccupancyLevel.UNDER_30]: 2240000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2100000, [OccupancyLevel.BETWEEN_30_70]: 1785000, [OccupancyLevel.UNDER_30]: 1680000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 3300000, [OccupancyLevel.BETWEEN_30_70]: 2805000, [OccupancyLevel.UNDER_30]: 2640000 },
    },
  },
  {
    code: 'CSD',
    name: 'Classic Suite Double',
    area: 48,
    quantity: 2,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 3200000, [OccupancyLevel.BETWEEN_30_70]: 2720000, [OccupancyLevel.UNDER_30]: 2560000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2500000, [OccupancyLevel.BETWEEN_30_70]: 2125000, [OccupancyLevel.UNDER_30]: 2000000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 3700000, [OccupancyLevel.BETWEEN_30_70]: 3145000, [OccupancyLevel.UNDER_30]: 2960000 },
    },
  },
  {
    code: 'CST',
    name: 'Classic Suite Twin',
    area: 48,
    quantity: 61,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 3200000, [OccupancyLevel.BETWEEN_30_70]: 2720000, [OccupancyLevel.UNDER_30]: 2560000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2500000, [OccupancyLevel.BETWEEN_30_70]: 2125000, [OccupancyLevel.UNDER_30]: 2000000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 3700000, [OccupancyLevel.BETWEEN_30_70]: 3145000, [OccupancyLevel.UNDER_30]: 2960000 },
    },
  },
  {
    code: 'DST',
    name: 'Deluxe Suite Twin',
    area: 58,
    quantity: 15,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 3600000, [OccupancyLevel.BETWEEN_30_70]: 3060000, [OccupancyLevel.UNDER_30]: 2880000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2900000, [OccupancyLevel.BETWEEN_30_70]: 2465000, [OccupancyLevel.UNDER_30]: 2320000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 4100000, [OccupancyLevel.BETWEEN_30_70]: 3485000, [OccupancyLevel.UNDER_30]: 3280000 },
    },
  },
  {
    code: 'LST',
    name: 'Luxury Suite Twin',
    area: 62,
    quantity: 15,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 4800000, [OccupancyLevel.BETWEEN_30_70]: 4080000, [OccupancyLevel.UNDER_30]: 3840000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 4100000, [OccupancyLevel.BETWEEN_30_70]: 3485000, [OccupancyLevel.UNDER_30]: 3280000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 5300000, [OccupancyLevel.BETWEEN_30_70]: 4505000, [OccupancyLevel.UNDER_30]: 4240000 },
    },
  },
  {
    code: 'AFS',
    name: 'Family Suite',
    area: 82,
    quantity: 24,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 3600000, [OccupancyLevel.BETWEEN_30_70]: 3060000, [OccupancyLevel.UNDER_30]: 2880000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2900000, [OccupancyLevel.BETWEEN_30_70]: 2465000, [OccupancyLevel.UNDER_30]: 2320000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 4100000, [OccupancyLevel.BETWEEN_30_70]: 3485000, [OccupancyLevel.UNDER_30]: 3280000 },
    },
  },
  {
    code: 'ACS',
    name: 'Classic Suite',
    area: 62,
    quantity: 5,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 2800000, [OccupancyLevel.BETWEEN_30_70]: 2380000, [OccupancyLevel.UNDER_30]: 2240000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 2100000, [OccupancyLevel.BETWEEN_30_70]: 1785000, [OccupancyLevel.UNDER_30]: 1680000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 3300000, [OccupancyLevel.BETWEEN_30_70]: 2805000, [OccupancyLevel.UNDER_30]: 2640000 },
    },
  },
  {
    code: 'DDS',
    name: 'Duc Duong Suite',
    area: 100,
    quantity: 2,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 4400000, [OccupancyLevel.BETWEEN_30_70]: 3740000, [OccupancyLevel.UNDER_30]: 3520000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 3700000, [OccupancyLevel.BETWEEN_30_70]: 3145000, [OccupancyLevel.UNDER_30]: 2960000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 4900000, [OccupancyLevel.BETWEEN_30_70]: 4165000, [OccupancyLevel.UNDER_30]: 3920000 },
    },
  },
  {
    code: 'PS',
    name: 'President Suite',
    area: 200,
    quantity: 1,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 20800000, [OccupancyLevel.BETWEEN_30_70]: 17680000, [OccupancyLevel.UNDER_30]: 16640000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 20100000, [OccupancyLevel.BETWEEN_30_70]: 17085000, [OccupancyLevel.UNDER_30]: 16080000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 21300000, [OccupancyLevel.BETWEEN_30_70]: 18105000, [OccupancyLevel.UNDER_30]: 17040000 },
    },
  },
  {
    code: 'VIL7',
    name: 'Villa 7',
    area: 650,
    quantity: 11,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 14170000, [OccupancyLevel.BETWEEN_30_70]: 12044500, [OccupancyLevel.UNDER_30]: 11336000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 12210000, [OccupancyLevel.BETWEEN_30_70]: 10378500, [OccupancyLevel.UNDER_30]: 9768000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 15630000, [OccupancyLevel.BETWEEN_30_70]: 13285500, [OccupancyLevel.UNDER_30]: 12504000 },
    },
  },
  {
    code: 'VIL8',
    name: 'Villa 8',
    area: 700,
    quantity: 9,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 15390000, [OccupancyLevel.BETWEEN_30_70]: 13081500, [OccupancyLevel.UNDER_30]: 12312000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 13270000, [OccupancyLevel.BETWEEN_30_70]: 11279500, [OccupancyLevel.UNDER_30]: 10616000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 16970000, [OccupancyLevel.BETWEEN_30_70]: 14424500, [OccupancyLevel.UNDER_30]: 13576000 },
    },
  },
  {
    code: 'VIL9',
    name: 'Villa 9',
    area: 750,
    quantity: 2,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 16620000, [OccupancyLevel.BETWEEN_30_70]: 14127000, [OccupancyLevel.UNDER_30]: 13296000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 14330000, [OccupancyLevel.BETWEEN_30_70]: 12180500, [OccupancyLevel.UNDER_30]: 11464000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 18340000, [OccupancyLevel.BETWEEN_30_70]: 15589000, [OccupancyLevel.UNDER_30]: 14672000 },
    },
  },
  {
    code: 'VIL13',
    name: 'Villa 13',
    area: 800,
    quantity: 1,
    rates: {
      [Season.HIGH]: { [OccupancyLevel.OVER_70]: 21540000, [OccupancyLevel.BETWEEN_30_70]: 18309000, [OccupancyLevel.UNDER_30]: 17232000 },
      [Season.LOW]: { [OccupancyLevel.OVER_70]: 18580000, [OccupancyLevel.BETWEEN_30_70]: 15793000, [OccupancyLevel.UNDER_30]: 14864000 },
      [Season.HOLIDAY]: { [OccupancyLevel.OVER_70]: 23760000, [OccupancyLevel.BETWEEN_30_70]: 20196000, [OccupancyLevel.UNDER_30]: 19008000 },
    },
  },
];
