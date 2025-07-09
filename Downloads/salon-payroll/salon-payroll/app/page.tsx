"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calculator, TrendingUp, DollarSign } from "lucide-react"
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

export default function SalonPayrollSystem() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollData, setPayrollData] = useState<PayrollData[]>([])
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [loading, setLoading] = useState(true)

  // Fetch employees from database
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          setEmployees(data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
    setLoading(false)
  }, [])

  // Fetch payroll data from database
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await fetch(`/api/payroll?month=${selectedMonth}`)
        if (response.ok) {
          const data = await response.json()
          setPayrollData(data)
        }
      } catch (error) {
        console.error('Error fetching payroll data:', error)
      }
    }

    fetchPayrollData()
  }, [selectedMonth])

  const totalEmployees = employees.length
  const totalPayroll = payrollData.reduce((sum, data) => {
    const employee = employees.find((emp) => emp.id === data.employeeId)
    if (!employee) return sum

    // This would use the proper calculation logic
    const totalIncome = employee.basicSalary + employee.allowance + data.bonus - data.penalty
    const netPay = totalIncome - data.advance

    return sum + netPay
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống tính lương Salon</h1>
          <p className="text-gray-600">Quản lý lương và hoa hồng cho nhân viên salon</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng lương tháng</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayroll.toLocaleString("vi-VN")}đ</div>
              <p className="text-xs text-muted-foreground">Tháng {selectedMonth}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đạt KPI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payrollData.filter((data) => data.kpiAchieved).length}/{payrollData.length}
              </div>
              <p className="text-xs text-muted-foreground">Nhân viên đạt KPI</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoa hồng hôm nay</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1.568.000đ</div>
              <p className="text-xs text-muted-foreground">+8% so với hôm qua</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="payroll" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="payroll">Bảng lương</TabsTrigger>
            <TabsTrigger value="employees">Nhân viên</TabsTrigger>
            <TabsTrigger value="data-entry">Nhập liệu</TabsTrigger>
            <TabsTrigger value="daily-commission">HH Hàng ngày</TabsTrigger>
            <TabsTrigger value="commission-summary">Tổng hợp HH</TabsTrigger>
            <TabsTrigger value="level-calc">Tính Level</TabsTrigger>
            <TabsTrigger value="groups">Nhóm NV</TabsTrigger>
            <TabsTrigger value="test-data">Test Data</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          <TabsContent value="payroll">
            <PayrollCalculation
              employees={employees}
              payrollData={payrollData}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeList employees={employees} onEmployeesChange={setEmployees} />
          </TabsContent>

          <TabsContent value="data-entry">
            <DataEntry
              employees={employees}
              payrollData={payrollData}
              onPayrollDataChange={setPayrollData}
              selectedMonth={selectedMonth}
            />
          </TabsContent>

          <TabsContent value="daily-commission">
            <DailyCommissionTracker employees={employees} />
          </TabsContent>

          <TabsContent value="commission-summary">
            <CommissionSummary employees={employees} />
          </TabsContent>

          <TabsContent value="level-calc">
            <LevelCalculator />
          </TabsContent>

          <TabsContent value="groups">
            <EmployeeGroupSelector />
          </TabsContent>

          <TabsContent value="test-data">
            <TestDataGenerator
              employees={employees}
              payrollData={payrollData}
              onEmployeesChange={setEmployees}
              onPayrollDataChange={setPayrollData}
            />
          </TabsContent>

          <TabsContent value="reports">
            <Reports employees={employees} payrollData={payrollData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
