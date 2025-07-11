"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calculator, TrendingUp, DollarSign, Building2, Target, Clock, BarChart3 } from "lucide-react"
import EmployeeList from "./components/employee-list"
import PayrollCalculation from "./components/payroll-calculation"
import DataEntry from "./components/data-entry"
import Reports from "./components/reports"
import type { Employee, PayrollData } from "./types/payroll"
import LevelCalculator from "./components/level-calculator"
import EmployeeGroupSelector from "./components/employee-group-selector"
import DailyCommissionTracker from "./components/daily-commission-tracker"
import CommissionSummary from "./components/commission-summary"
import TestDataGenerator from "./components/test-data-generator"
import ExcelImportExport from "./components/excel-import-export"

// Thêm nhiều dữ liệu mẫu để test

const sampleEmployees: Employee[] = [
  {
    id: "001",
    name: "Nguyễn Thị Lan",
    code: "NV001",
    position: "Thợ chính",
    department: "Styling",
    employeeGroup: "THỢ CHÍNH",
    basicSalary: 12000000,
    allowance: 500000,
    currentLevel: "TIÊU CHUẨN",
  },
  {
    id: "002",
    name: "Trần Văn Minh",
    code: "NV002",
    position: "Thợ phụ",
    department: "Styling",
    employeeGroup: "THỢ PHỤ",
    basicSalary: 0,
    allowance: 300000,
    currentLevel: "THỢ PHỤ LEVEL 3",
  },
  {
    id: "003",
    name: "Lê Thị Hoa",
    code: "NV003",
    position: "Thợ nail",
    department: "Nail",
    employeeGroup: "NAIL",
    basicSalary: 7000000,
    allowance: 400000,
    currentLevel: "TIÊU CHUẨN",
  },
  {
    id: "004",
    name: "Phạm Thị Mai",
    code: "NV004",
    position: "Relax",
    department: "Relax",
    employeeGroup: "RELAX",
    basicSalary: 6000000,
    allowance: 200000,
    currentLevel: "THỢ MỚI",
  },
  {
    id: "005",
    name: "Hoàng Văn Nam",
    code: "NV005",
    position: "Thợ chính",
    department: "Styling",
    employeeGroup: "THỢ CHÍNH",
    basicSalary: 14000000,
    allowance: 600000,
    currentLevel: "VƯỢT TARGET",
  },
  {
    id: "006",
    name: "Vũ Thị Hương",
    code: "NV006",
    position: "Thợ phụ",
    department: "Styling",
    employeeGroup: "THỢ PHỤ",
    basicSalary: 0,
    allowance: 250000,
    currentLevel: "THỢ PHỤ LEVEL 1",
    isNewEmployee: true,
  },
  {
    id: "007",
    name: "Đặng Thị Linh",
    code: "NV007",
    position: "Nail Artist",
    department: "Nail",
    employeeGroup: "NAIL",
    basicSalary: 8000000,
    allowance: 500000,
    currentLevel: "TARGET",
  },
  {
    id: "008",
    name: "Bùi Văn Đức",
    code: "NV008",
    position: "Relax Therapist",
    department: "Relax",
    employeeGroup: "RELAX",
    basicSalary: 8000000,
    allowance: 300000,
    currentLevel: "VƯỢT TARGET",
  },
]

const samplePayrollData: PayrollData[] = [
  {
    id: "1",
    employeeId: "001",
    month: "2024-01",
    dailyRevenue: 6500000,
    monthlyRevenue: 170000000,
    serviceRevenue: 90000000,
    productRevenue: 18000000,
    facialRevenue: 30000000,
    washingRevenue: 12000000,
    chemicalRevenue: 15000000,
    bleachingRevenue: 5000000,
    kpiDetails: {
      keratin: 9,
      bleaching: 5,
      highlight: 4,
      theNewMe: 5,
      perm: 3,
      tonic: 4,
    },
    kpiAchieved: true,
    bonus: 800000,
    penalty: 0,
    advance: 1500000,
    calculatedLevel: "TARGET",
  },
  {
    id: "2",
    employeeId: "002",
    month: "2024-01",
    dailyRevenue: 3200000,
    monthlyRevenue: 83200000,
    serviceRevenue: 45000000,
    productRevenue: 9000000,
    facialRevenue: 18000000,
    washingRevenue: 7000000,
    chemicalRevenue: 3200000,
    bleachingRevenue: 1000000,
    kpiDetails: {
      facial: 3,
      products: 1,
      bleaching: 4,
      hairTreatment: 3,
      recovery: 3,
      photoTherapy: 2,
    },
    kpiAchieved: false,
    bonus: 200000,
    penalty: 100000,
    advance: 800000,
    calculatedLevel: "THỢ PHỤ LEVEL 3",
  },
  {
    id: "3",
    employeeId: "003",
    month: "2024-01",
    dailyRevenue: 1200000,
    monthlyRevenue: 31200000,
    serviceRevenue: 25000000,
    productRevenue: 3000000,
    facialRevenue: 0,
    washingRevenue: 0,
    chemicalRevenue: 0,
    bleachingRevenue: 0,
    nailDesignRevenue: 25000000,
    eyebrowThreadingRevenue: 3200000,
    kpiDetails: {
      nailDesign: 55,
      keratin: 7,
      eyebrowThreading: 12,
    },
    kpiAchieved: true,
    bonus: 400000,
    penalty: 0,
    advance: 600000,
    calculatedLevel: "TIÊU CHUẨN",
  },
  {
    id: "4",
    employeeId: "004",
    month: "2024-01",
    dailyRevenue: 800000,
    monthlyRevenue: 20800000,
    serviceRevenue: 20800000,
    productRevenue: 0,
    facialRevenue: 0,
    washingRevenue: 0,
    chemicalRevenue: 0,
    bleachingRevenue: 0,
    kpiDetails: {
      oilTreatment: 5,
      keratin: 6,
      spaFoot: 6,
    },
    kpiAchieved: false,
    bonus: 150000,
    penalty: 0,
    advance: 400000,
    calculatedLevel: "THỢ MỚI",
  },
  {
    id: "5",
    employeeId: "005",
    month: "2024-01",
    dailyRevenue: 12500000,
    monthlyRevenue: 325000000,
    serviceRevenue: 200000000,
    productRevenue: 35000000,
    facialRevenue: 50000000,
    washingRevenue: 20000000,
    chemicalRevenue: 15000000,
    bleachingRevenue: 5000000,
    kpiDetails: {
      keratin: 12,
      bleaching: 6,
      highlight: 5,
      theNewMe: 6,
      perm: 4,
      tonic: 5,
    },
    kpiAchieved: true,
    bonus: 1500000,
    penalty: 0,
    advance: 2000000,
    calculatedLevel: "VƯỢT TARGET",
  },
  {
    id: "6",
    employeeId: "006",
    month: "2024-01",
    dailyRevenue: 1200000,
    monthlyRevenue: 31200000,
    serviceRevenue: 20000000,
    productRevenue: 5000000,
    facialRevenue: 4000000,
    washingRevenue: 1500000,
    chemicalRevenue: 700000,
    bleachingRevenue: 0,
    kpiDetails: {
      facial: 2,
      products: 1,
      bleaching: 3,
      hairTreatment: 2,
      recovery: 2,
      photoTherapy: 1,
    },
    kpiAchieved: false,
    bonus: 0,
    penalty: 0,
    advance: 500000,
    calculatedLevel: "THỢ PHỤ LEVEL 1",
  },
  {
    id: "7",
    employeeId: "007",
    month: "2024-01",
    dailyRevenue: 1400000,
    monthlyRevenue: 36400000,
    serviceRevenue: 30000000,
    productRevenue: 4000000,
    facialRevenue: 0,
    washingRevenue: 0,
    chemicalRevenue: 0,
    bleachingRevenue: 0,
    nailDesignRevenue: 30000000,
    eyebrowThreadingRevenue: 2400000,
    kpiDetails: {
      nailDesign: 65,
      keratin: 8,
      eyebrowThreading: 15,
    },
    kpiAchieved: true,
    bonus: 600000,
    penalty: 0,
    advance: 800000,
    calculatedLevel: "TARGET",
  },
  {
    id: "8",
    employeeId: "008",
    month: "2024-01",
    dailyRevenue: 2100000,
    monthlyRevenue: 54600000,
    serviceRevenue: 54600000,
    productRevenue: 0,
    facialRevenue: 0,
    washingRevenue: 0,
    chemicalRevenue: 0,
    bleachingRevenue: 0,
    kpiDetails: {
      oilTreatment: 8,
      keratin: 10,
      spaFoot: 9,
    },
    kpiAchieved: true,
    bonus: 800000,
    penalty: 0,
    advance: 1000000,
    calculatedLevel: "VƯỢT TARGET",
  },
]

export default function SalonPayrollSystem() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollData, setPayrollData] = useState<PayrollData[]>(samplePayrollData)
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  // Fetch employees from API
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEmployees(data)
      })
  }, [])

  const totalEmployees = employees.length
  const totalPayroll = payrollData.reduce((sum, data) => {
    const employee = employees.find((emp) => emp.id === data.employeeId)
    if (!employee) return sum

    // This would use the proper calculation logic
    const totalIncome = employee.basicSalary + employee.allowance + data.bonus - data.penalty
    const netPay = totalIncome - data.advance

    return sum + netPay
  }, 0)

  const kpiAchievedCount = payrollData.filter((data) => data.kpiAchieved).length
  const kpiTotalCount = payrollData.length
  const kpiPercentage = kpiTotalCount > 0 ? Math.round((kpiAchievedCount / kpiTotalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Hệ thống tính lương Salon
          </h1>
          <p className="text-gray-600 text-lg">Quản lý lương và hoa hồng cho nhân viên salon</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Tổng nhân viên</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{totalEmployees}</div>
              <p className="text-xs text-blue-600">Đang hoạt động</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Tổng lương tháng</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calculator className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{totalPayroll.toLocaleString("vi-VN")}đ</div>
              <p className="text-xs text-green-600">Tháng {selectedMonth}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Đạt KPI</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{kpiAchievedCount}/{kpiTotalCount}</div>
              <p className="text-xs text-orange-600">{kpiPercentage}% đạt KPI</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Hoa hồng hôm nay</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">1.568.000đ</div>
              <p className="text-xs text-purple-600">+8% so với hôm qua</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="payroll" className="space-y-6">
              <TabsList className="grid w-full grid-cols-10 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="payroll" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bảng lương
                </TabsTrigger>
                <TabsTrigger value="employees" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Nhân viên
                </TabsTrigger>
                <TabsTrigger value="data-entry" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Nhập liệu
                </TabsTrigger>
                <TabsTrigger value="daily-commission" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  HH Hàng ngày
                </TabsTrigger>
                <TabsTrigger value="commission-summary" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Tổng hợp HH
                </TabsTrigger>
                <TabsTrigger value="level-calc" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="h-4 w-4 mr-2" />
                  Tính Level
                </TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Nhóm NV
                </TabsTrigger>
                <TabsTrigger value="excel" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </TabsTrigger>
                <TabsTrigger value="test-data" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="h-4 w-4 mr-2" />
                  Test Data
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Báo cáo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="payroll" className="space-y-4">
                <PayrollCalculation
                  employees={employees}
                  payrollData={payrollData}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </TabsContent>

              <TabsContent value="employees" className="space-y-4">
                <EmployeeList employees={employees} onEmployeesChange={setEmployees} />
              </TabsContent>

              <TabsContent value="data-entry" className="space-y-4">
                <DataEntry
                  employees={employees}
                  payrollData={payrollData}
                  onPayrollDataChange={setPayrollData}
                  selectedMonth={selectedMonth}
                />
              </TabsContent>

              <TabsContent value="daily-commission" className="space-y-4">
                <DailyCommissionTracker employees={employees} />
              </TabsContent>

              <TabsContent value="commission-summary" className="space-y-4">
                <CommissionSummary employees={employees} />
              </TabsContent>

              <TabsContent value="level-calc" className="space-y-4">
                <LevelCalculator />
              </TabsContent>

              <TabsContent value="groups" className="space-y-4">
                <EmployeeGroupSelector />
              </TabsContent>

              <TabsContent value="excel" className="space-y-4">
                <ExcelImportExport />
              </TabsContent>

              <TabsContent value="test-data" className="space-y-4">
                <TestDataGenerator
                  employees={employees}
                  payrollData={payrollData}
                  onEmployeesChange={setEmployees}
                  onPayrollDataChange={setPayrollData}
                />
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Reports employees={employees} payrollData={payrollData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
