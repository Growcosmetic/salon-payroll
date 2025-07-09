export interface Employee {
  id: string
  name: string
  code: string
  position: string
  department: string
  employeeGroup: "THỢ PHỤ" | "THỢ CHÍNH" | "RELAX" | "NAIL"
  basicSalary: number
  allowance: number
  currentLevel: string
  isNewEmployee?: boolean
}

export interface SalaryLevel {
  level: string
  dailyRevenueMin: number
  monthlyRevenueMin: number
  basicSalary?: number
  serviceCommission?: number
  productCommission?: number
  facialCommission?: number
  washingCommission?: number
  chemicalCommission?: number
  bleachingCommission?: number
  cuttingCommission?: number
  oilTreatment?: number
  keratin?: number
  spaFoot?: number
  nailDesign?: number
  eyebrowThreading?: number
  bonus: string
  workingHours: string
  kpiRequirements: {
    // THỢ PHỤ KPIs
    facial?: number
    products?: number
    bleaching?: number
    hairTreatment?: number
    recovery?: number
    photoTherapy?: number
    // THỢ CHÍNH KPIs
    keratin?: number
    highlight?: number
    theNewMe?: number
    perm?: number
    tonic?: number
    // RELAX KPIs
    oilTreatment?: number
    spaFoot?: number
    // NAIL KPIs
    nailDesign?: number
    eyebrowThreading?: number
  }
}

export interface PayrollData {
  id: string
  employeeId: string
  month: string
  dailyRevenue: number
  monthlyRevenue: number
  // Revenue by service type
  serviceRevenue: number
  productRevenue: number
  facialRevenue: number
  washingRevenue: number
  chemicalRevenue: number
  bleachingRevenue: number
  cuttingRevenue?: number
  oilTreatmentRevenue?: number
  keratinRevenue?: number
  spaFootRevenue?: number
  nailDesignRevenue?: number
  eyebrowThreadingRevenue?: number
  // KPI tracking
  kpiAchieved: boolean
  kpiDetails: {
    // THỢ PHỤ KPIs
    facial?: number
    products?: number
    bleaching?: number
    hairTreatment?: number
    recovery?: number
    photoTherapy?: number
    // THỢ CHÍNH KPIs
    keratin?: number
    highlight?: number
    theNewMe?: number
    perm?: number
    tonic?: number
    // RELAX KPIs
    oilTreatment?: number
    spaFoot?: number
    // NAIL KPIs
    nailDesign?: number
    eyebrowThreading?: number
  }
  bonus: number
  penalty: number
  advance: number
  calculatedLevel: string
}

export interface PayrollCalculation {
  level: string
  basicSalary: number
  serviceCommission: number
  productCommission?: number
  facialCommission?: number
  washingCommission?: number
  chemicalCommission?: number
  bleachingCommission?: number
  cuttingCommission?: number
  totalCommission: number
  levelBonus: number
  kpiPenalty: number
  totalIncome: number
  netPay: number
}
