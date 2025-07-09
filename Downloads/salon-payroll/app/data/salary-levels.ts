import type { SalaryLevel } from "../types/payroll"

// THỢ PHỤ (Assistant) - Original group
export const thoPhụLevels: SalaryLevel[] = [
  {
    level: "THỢ PHỤ LEVEL 1",
    dailyRevenueMin: 0,
    monthlyRevenueMin: 0,
    basicSalary: 0,
    serviceCommission: 5,
    productCommission: 10,
    facialCommission: 10,
    washingCommission: 10,
    chemicalCommission: 3,
    bleachingCommission: 5,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "THỢ PHỤ LEVEL 2",
    dailyRevenueMin: 1553846,
    monthlyRevenueMin: 40400000,
    basicSalary: 0,
    serviceCommission: 6,
    productCommission: 10,
    facialCommission: 10,
    washingCommission: 10,
    chemicalCommission: 3,
    bleachingCommission: 5,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "THỢ PHỤ LEVEL 3",
    dailyRevenueMin: 2307692,
    monthlyRevenueMin: 60000000,
    basicSalary: 0,
    serviceCommission: 7,
    productCommission: 10,
    facialCommission: 15,
    washingCommission: 10,
    chemicalCommission: 3,
    bleachingCommission: 5,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "THỢ PHỤ LEVEL 4",
    dailyRevenueMin: 3076923,
    monthlyRevenueMin: 80000000,
    basicSalary: 0,
    serviceCommission: 8,
    productCommission: 10,
    facialCommission: 15,
    washingCommission: 12,
    chemicalCommission: 3.5,
    bleachingCommission: 5,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "TIÊU CHUẨN",
    dailyRevenueMin: 3846154,
    monthlyRevenueMin: 100000000,
    basicSalary: 0,
    serviceCommission: 9,
    productCommission: 10,
    facialCommission: 15,
    washingCommission: 12,
    chemicalCommission: 3.5,
    bleachingCommission: 5,
    bonus: "T13",
    workingHours: "T2-T5: 10H-19H, T6,T7,CN: 9H-19H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "TARGET",
    dailyRevenueMin: 5000000,
    monthlyRevenueMin: 130000000,
    basicSalary: 0,
    serviceCommission: 9.5,
    productCommission: 12,
    facialCommission: 20,
    washingCommission: 14,
    chemicalCommission: 4,
    bleachingCommission: 5,
    bonus: "T13+T14",
    workingHours: "T2-T5: 10H-18H, T6,T7,CN: 10H-19H, T2-CN: 10H-18H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
  {
    level: "VƯỢT TARGET",
    dailyRevenueMin: 6923077,
    monthlyRevenueMin: 180000000,
    basicSalary: 0,
    serviceCommission: 10,
    productCommission: 14,
    facialCommission: 20,
    washingCommission: 14,
    chemicalCommission: 4,
    bleachingCommission: 5,
    bonus: "T13+T14+T15",
    workingHours: "T2-CN: 10H-18H",
    kpiRequirements: {
      facial: 4,
      products: 2,
      bleaching: 5,
      hairTreatment: 4,
      recovery: 4,
      photoTherapy: 3,
    },
  },
]

// THỢ CHÍNH (Main Stylist)
export const thoChinhLevels: SalaryLevel[] = [
  {
    level: "THỢ MỚI",
    dailyRevenueMin: 0,
    monthlyRevenueMin: 0,
    basicSalary: 9000000,
    serviceCommission: 6,
    bleachingCommission: 10,
    cuttingCommission: 6,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      keratin: 8,
      bleaching: 4,
      highlight: 3,
      theNewMe: 4,
      perm: 2,
      tonic: 3,
    },
  },
  {
    level: "DƯỚI TC",
    dailyRevenueMin: 3461538,
    monthlyRevenueMin: 90000000,
    basicSalary: 9000000,
    serviceCommission: 8,
    bleachingCommission: 10,
    cuttingCommission: 12,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      keratin: 8,
      bleaching: 4,
      highlight: 3,
      theNewMe: 4,
      perm: 2,
      tonic: 3,
    },
  },
  {
    level: "TIÊU CHUẨN",
    dailyRevenueMin: 4807692,
    monthlyRevenueMin: 125000000,
    basicSalary: 12000000,
    serviceCommission: 10,
    bleachingCommission: 12,
    cuttingCommission: 14,
    bonus: "T13",
    workingHours: "T2-T5: 10H-18H, T6,T7,CN: 9H-19H",
    kpiRequirements: {
      keratin: 8,
      bleaching: 4,
      highlight: 3,
      theNewMe: 4,
      perm: 2,
      tonic: 3,
    },
  },
  {
    level: "TARGET",
    dailyRevenueMin: 6538462,
    monthlyRevenueMin: 170000000,
    basicSalary: 13000000,
    serviceCommission: 13,
    bleachingCommission: 13,
    cuttingCommission: 16,
    bonus: "T13+T14",
    workingHours: "T2-CN: 10H-18H",
    kpiRequirements: {
      keratin: 8,
      bleaching: 4,
      highlight: 3,
      theNewMe: 4,
      perm: 2,
      tonic: 3,
    },
  },
  {
    level: "VƯỢT TARGET",
    dailyRevenueMin: 8461538,
    monthlyRevenueMin: 220000000,
    basicSalary: 14000000,
    serviceCommission: 15,
    bleachingCommission: 15,
    cuttingCommission: 18,
    bonus: "T13+T14+T15",
    workingHours: "T2-CN: 10H-17H",
    kpiRequirements: {
      keratin: 8,
      bleaching: 4,
      highlight: 3,
      theNewMe: 4,
      perm: 2,
      tonic: 3,
    },
  },
]

// RELAX
export const relaxLevels: SalaryLevel[] = [
  {
    level: "THỢ MỚI",
    dailyRevenueMin: 0,
    monthlyRevenueMin: 0,
    basicSalary: 6000000,
    serviceCommission: 18,
    bonus: "T13",
    workingHours: "T2-T5: 8H45-19H, T6,T7,CN: 8H30-20H",
    kpiRequirements: {
      oilTreatment: 6,
      keratin: 8,
      spaFoot: 7,
    },
  },
  {
    level: "DƯỚI TC",
    dailyRevenueMin: 846154,
    monthlyRevenueMin: 22000000,
    basicSalary: 6500000,
    serviceCommission: 23,
    bonus: "T13",
    workingHours: "T2-T5: 8H45-19H, T6,T7,CN: 8H30-20H",
    kpiRequirements: {
      oilTreatment: 6,
      keratin: 8,
      spaFoot: 7,
    },
  },
  {
    level: "TIÊU CHUẨN",
    dailyRevenueMin: 1076923,
    monthlyRevenueMin: 28000000,
    basicSalary: 7000000,
    serviceCommission: 25,
    bonus: "T13",
    workingHours: "T2-T5: 8H45-19H, T6,T7,CN: 8H30-20H",
    kpiRequirements: {
      oilTreatment: 6,
      keratin: 8,
      spaFoot: 7,
    },
  },
  {
    level: "TARGET",
    dailyRevenueMin: 1346154,
    monthlyRevenueMin: 35000000,
    basicSalary: 8000000,
    serviceCommission: 30,
    bonus: "T13+T14",
    workingHours: "T2-T5: 10H-18H, T6,T7,CN: 10H-19H",
    kpiRequirements: {
      oilTreatment: 6,
      keratin: 8,
      spaFoot: 7,
    },
  },
  {
    level: "VƯỢT TARGET",
    dailyRevenueMin: 1923077,
    monthlyRevenueMin: 50000000,
    basicSalary: 8000000,
    serviceCommission: 36,
    bonus: "T13+T14+T15",
    workingHours: "T2-CN: 10H-18H",
    kpiRequirements: {
      oilTreatment: 6,
      keratin: 8,
      spaFoot: 7,
    },
  },
]

// NAIL
export const nailLevels: SalaryLevel[] = [
  {
    level: "THỢ MỚI",
    dailyRevenueMin: 0,
    monthlyRevenueMin: 0,
    basicSalary: 6000000,
    serviceCommission: 15,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      nailDesign: 50,
      keratin: 6,
      eyebrowThreading: 10,
    },
  },
  {
    level: "DƯỚI TC",
    dailyRevenueMin: 692308,
    monthlyRevenueMin: 18000000,
    basicSalary: 6500000,
    serviceCommission: 18,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      nailDesign: 50,
      keratin: 6,
      eyebrowThreading: 10,
    },
  },
  {
    level: "TIÊU CHUẨN",
    dailyRevenueMin: 884615,
    monthlyRevenueMin: 23000000,
    basicSalary: 7000000,
    serviceCommission: 20,
    bonus: "T13",
    workingHours: "T2-T5: 9H-19H, T6,T7,CN: 8H45-20H",
    kpiRequirements: {
      nailDesign: 50,
      keratin: 6,
      eyebrowThreading: 10,
    },
  },
  {
    level: "TARGET",
    dailyRevenueMin: 1115385,
    monthlyRevenueMin: 29000000,
    basicSalary: 8000000,
    serviceCommission: 24,
    bonus: "T13+T14",
    workingHours: "T2-T5: 10H-18H, T6,T7,CN: 10H-19H",
    kpiRequirements: {
      nailDesign: 50,
      keratin: 6,
      eyebrowThreading: 10,
    },
  },
  {
    level: "VƯỢT TARGET",
    dailyRevenueMin: 1538462,
    monthlyRevenueMin: 40000000,
    basicSalary: 8000000,
    serviceCommission: 30,
    bonus: "T13+T14+T15",
    workingHours: "T2-T5: 10H-17H, T6,T7,CN: 10H-18H",
    kpiRequirements: {
      nailDesign: 50,
      keratin: 6,
      eyebrowThreading: 10,
    },
  },
]

export const employeeGroups = {
  "THỢ PHỤ": thoPhụLevels,
  "THỢ CHÍNH": thoChinhLevels,
  RELAX: relaxLevels,
  NAIL: nailLevels,
}

export function calculateEmployeeLevel(monthlyRevenue: number, dailyRevenue: number, employeeGroup: string): string {
  const levels = employeeGroups[employeeGroup as keyof typeof employeeGroups] || thoPhụLevels

  // Sort levels by revenue requirement (descending) to find the highest level achieved
  const sortedLevels = [...levels].sort((a, b) => b.monthlyRevenueMin - a.monthlyRevenueMin)

  for (const level of sortedLevels) {
    if (monthlyRevenue >= level.monthlyRevenueMin && dailyRevenue >= level.dailyRevenueMin) {
      return level.level
    }
  }

  return levels[0].level // Default to first level
}

export function getLevelData(level: string): SalaryLevel | undefined {
  for (const group in employeeGroups) {
    const levels = employeeGroups[group as keyof typeof employeeGroups]
    const foundLevel = levels.find((l) => l.level === level)
    if (foundLevel) {
      return foundLevel
    }
  }
  return undefined
}

export function getKpiPenaltyRate(employeeGroup: string, isNewEmployee = false): number {
  // All groups have 2% penalty for not meeting KPI, 4% for new employees
  return isNewEmployee ? 0.04 : 0.02
}

export const salaryLevels = [...thoPhụLevels, ...thoChinhLevels, ...relaxLevels, ...nailLevels]
