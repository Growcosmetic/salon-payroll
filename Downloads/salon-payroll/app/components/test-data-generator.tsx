"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Users, DollarSign, CheckCircle, XCircle, RefreshCw, Download, Upload } from "lucide-react"
import type { Employee, PayrollData } from "../types/payroll"

interface TestDataGeneratorProps {
  employees: Employee[]
  payrollData: PayrollData[]
  onEmployeesChange: (employees: Employee[]) => void
  onPayrollDataChange: (data: PayrollData[]) => void
}

export default function TestDataGenerator({
  employees,
  payrollData,
  onEmployeesChange,
  onPayrollDataChange,
}: TestDataGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string>("")

  const generateRandomEmployee = (index: number): Employee => {
    const names = [
      "Nguyễn Thị Lan",
      "Trần Văn Minh",
      "Lê Thị Hoa",
      "Phạm Thị Mai",
      "Hoàng Văn Nam",
      "Vũ Thị Hương",
      "Đặng Thị Linh",
      "Bùi Văn Đức",
      "Phan Thị Thu",
      "Lý Văn Tài",
      "Võ Thị Nga",
      "Đỗ Văn Hùng",
    ]

    const positions = ["Thợ chính", "Thợ phụ", "Thợ nail", "Relax", "Lễ tân"]
    const groups: Array<"THỢ CHÍNH" | "THỢ PHỤ" | "NAIL" | "RELAX"> = ["THỢ CHÍNH", "THỢ PHỤ", "NAIL", "RELAX"]
    const levels = ["THỢ MỚI", "DƯỚI TC", "TIÊU CHUẨN", "TARGET", "VƯỢT TARGET"]

    const group = groups[Math.floor(Math.random() * groups.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]

    let basicSalary = 0
    if (group === "THỢ CHÍNH") {
      basicSalary = Math.floor(Math.random() * 5000000) + 9000000 // 9M-14M
    } else if (group === "NAIL" || group === "RELAX") {
      basicSalary = Math.floor(Math.random() * 2000000) + 6000000 // 6M-8M
    }

    return {
      id: `test_${index + 100}`,
      name: names[Math.floor(Math.random() * names.length)],
      code: `NV${(index + 100).toString().padStart(3, "0")}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: group === "THỢ CHÍNH" || group === "THỢ PHỤ" ? "Styling" : group,
      employeeGroup: group,
      basicSalary,
      allowance: Math.floor(Math.random() * 400000) + 200000, // 200K-600K
      currentLevel: level,
      isNewEmployee: Math.random() < 0.2, // 20% chance of being new
    }
  }

  const generateRandomPayrollData = (employee: Employee, monthIndex: number): PayrollData => {
    const month = `2024-${(monthIndex + 1).toString().padStart(2, "0")}`

    // Generate random revenue based on employee group and level
    let baseRevenue = 20000000 // 20M base
    if (employee.currentLevel === "VƯỢT TARGET") baseRevenue = 50000000
    else if (employee.currentLevel === "TARGET") baseRevenue = 35000000
    else if (employee.currentLevel === "TIÊU CHUẨN") baseRevenue = 25000000

    const monthlyRevenue = baseRevenue + Math.floor(Math.random() * 20000000)
    const dailyRevenue = Math.floor(monthlyRevenue / 26) // Average working days

    const serviceRevenue = Math.floor(monthlyRevenue * 0.6)
    const productRevenue = Math.floor(monthlyRevenue * 0.15)
    const facialRevenue = employee.employeeGroup === "THỢ PHỤ" ? Math.floor(monthlyRevenue * 0.2) : 0
    const washingRevenue = employee.employeeGroup === "THỢ PHỤ" ? Math.floor(monthlyRevenue * 0.05) : 0
    const chemicalRevenue = employee.employeeGroup === "THỢ PHỤ" ? Math.floor(monthlyRevenue * 0.1) : 0
    const bleachingRevenue = Math.floor(monthlyRevenue * 0.05)

    // Generate KPI data based on employee group
    let kpiDetails: any = {}
    let kpiAchieved = Math.random() > 0.3 // 70% chance of achieving KPI

    if (employee.employeeGroup === "THỢ PHỤ") {
      kpiDetails = {
        facial: Math.floor(Math.random() * 8) + 2, // 2-10
        products: Math.floor(Math.random() * 4) + 1, // 1-5
        bleaching: Math.floor(Math.random() * 8) + 3, // 3-11
        hairTreatment: Math.floor(Math.random() * 6) + 2, // 2-8
        recovery: Math.floor(Math.random() * 6) + 2, // 2-8
        photoTherapy: Math.floor(Math.random() * 5) + 1, // 1-6
      }
      kpiAchieved = kpiDetails.facial >= 4 && kpiDetails.products >= 2 && kpiDetails.bleaching >= 5
    } else if (employee.employeeGroup === "THỢ CHÍNH") {
      kpiDetails = {
        keratin: Math.floor(Math.random() * 8) + 5, // 5-13
        bleaching: Math.floor(Math.random() * 6) + 2, // 2-8
        highlight: Math.floor(Math.random() * 5) + 1, // 1-6
        theNewMe: Math.floor(Math.random() * 6) + 2, // 2-8
        perm: Math.floor(Math.random() * 4) + 1, // 1-5
        tonic: Math.floor(Math.random() * 5) + 1, // 1-6
      }
      kpiAchieved = kpiDetails.keratin >= 8 && kpiDetails.bleaching >= 4 && kpiDetails.highlight >= 3
    } else if (employee.employeeGroup === "NAIL") {
      kpiDetails = {
        nailDesign: Math.floor(Math.random() * 30) + 40, // 40-70
        keratin: Math.floor(Math.random() * 6) + 4, // 4-10
        eyebrowThreading: Math.floor(Math.random() * 8) + 6, // 6-14
      }
      kpiAchieved = kpiDetails.nailDesign >= 50 && kpiDetails.keratin >= 6 && kpiDetails.eyebrowThreading >= 10
    } else if (employee.employeeGroup === "RELAX") {
      kpiDetails = {
        oilTreatment: Math.floor(Math.random() * 6) + 4, // 4-10
        keratin: Math.floor(Math.random() * 6) + 6, // 6-12
        spaFoot: Math.floor(Math.random() * 5) + 5, // 5-10
      }
      kpiAchieved = kpiDetails.oilTreatment >= 6 && kpiDetails.keratin >= 8 && kpiDetails.spaFoot >= 7
    }

    return {
      id: `payroll_${employee.id}_${month}`,
      employeeId: employee.id,
      month,
      dailyRevenue,
      monthlyRevenue,
      serviceRevenue,
      productRevenue,
      facialRevenue,
      washingRevenue,
      chemicalRevenue,
      bleachingRevenue,
      nailDesignRevenue: employee.employeeGroup === "NAIL" ? serviceRevenue : 0,
      eyebrowThreadingRevenue: employee.employeeGroup === "NAIL" ? Math.floor(monthlyRevenue * 0.1) : 0,
      kpiDetails,
      kpiAchieved,
      bonus: Math.floor(Math.random() * 1000000) + 200000, // 200K-1.2M
      penalty: Math.random() > 0.8 ? Math.floor(Math.random() * 200000) : 0, // 20% chance of penalty
      advance: Math.floor(Math.random() * 1500000) + 500000, // 500K-2M
      calculatedLevel: employee.currentLevel,
    }
  }

  const generateTestEmployees = async (count: number) => {
    setIsGenerating(true)
    const newEmployees: Employee[] = []

    for (let i = 0; i < count; i++) {
      newEmployees.push(generateRandomEmployee(i))
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    onEmployeesChange([...employees, ...newEmployees])
    setLastGenerated(`Generated ${count} employees`)
    setIsGenerating(false)
  }

  const generateTestPayrollData = async () => {
    setIsGenerating(true)
    const newPayrollData: PayrollData[] = []

    // Generate 3 months of data for all employees
    for (let monthIndex = 0; monthIndex < 3; monthIndex++) {
      for (const employee of employees) {
        newPayrollData.push(generateRandomPayrollData(employee, monthIndex))
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
    }

    onPayrollDataChange([...payrollData, ...newPayrollData])
    setLastGenerated(`Generated payroll data for ${employees.length} employees x 3 months`)
    setIsGenerating(false)
  }

  const clearAllData = () => {
    onEmployeesChange([])
    onPayrollDataChange([])
    setLastGenerated("Cleared all data")
  }

  const resetToSampleData = () => {
    // Reset to original sample data
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
    ]

    onEmployeesChange(sampleEmployees)
    onPayrollDataChange([])
    setLastGenerated("Reset to sample data")
  }

  const exportTestData = () => {
    const testData = {
      employees,
      payrollData,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(testData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `salon-test-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    totalEmployees: employees.length,
    totalPayrollRecords: payrollData.length,
    employeesByGroup: employees.reduce(
      (acc, emp) => {
        acc[emp.employeeGroup] = (acc[emp.employeeGroup] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    kpiAchievementRate:
      payrollData.length > 0
        ? Math.round((payrollData.filter((p) => p.kpiAchieved).length / payrollData.length) * 100)
        : 0,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test Data Generator
          </CardTitle>
          <CardDescription>Tạo dữ liệu mẫu để test các tính năng của hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Tạo dữ liệu</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="manage">Quản lý</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tạo nhân viên
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Button onClick={() => generateTestEmployees(5)} disabled={isGenerating} size="sm">
                        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}5 nhân viên
                      </Button>
                      <Button onClick={() => generateTestEmployees(10)} disabled={isGenerating} size="sm">
                        10 nhân viên
                      </Button>
                      <Button onClick={() => generateTestEmployees(20)} disabled={isGenerating} size="sm">
                        20 nhân viên
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tạo nhân viên ngẫu nhiên với các nhóm và level khác nhau
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Tạo dữ liệu lương
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={generateTestPayrollData}
                      disabled={isGenerating || employees.length === 0}
                      className="w-full"
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      Tạo 3 tháng dữ liệu lương
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Tạo dữ liệu lương 3 tháng cho tất cả nhân viên hiện có
                    </p>
                    {employees.length === 0 && (
                      <Alert>
                        <AlertDescription>Cần có nhân viên trước khi tạo dữ liệu lương</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {lastGenerated && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{lastGenerated}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                    <p className="text-xs text-muted-foreground">Tổng nhân viên</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.totalPayrollRecords}</div>
                    <p className="text-xs text-muted-foreground">Bản ghi lương</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.kpiAchievementRate}%</div>
                    <p className="text-xs text-muted-foreground">Tỷ lệ đạt KPI</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {payrollData.length > 0 ? Math.round(payrollData.length / employees.length) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Tháng/Nhân viên</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Phân bố nhân viên theo nhóm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.employeesByGroup).map(([group, count]) => (
                      <div key={group} className="flex justify-between items-center">
                        <Badge variant="outline">{group}</Badge>
                        <span className="font-semibold">{count} nhân viên</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Xuất/Nhập dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={exportTestData} className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Xuất dữ liệu test
                    </Button>
                    <Button className="w-full" variant="outline" disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Nhập dữ liệu test
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reset dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={resetToSampleData} className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset về mẫu gốc
                    </Button>
                    <Button onClick={clearAllData} className="w-full" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Xóa tất cả dữ liệu
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Lưu ý:</strong> Các thao tác này chỉ ảnh hưởng đến dữ liệu trong session hiện tại. Refresh
                  trang sẽ reset về dữ liệu mặc định.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
