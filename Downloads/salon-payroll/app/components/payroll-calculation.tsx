"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { Employee, PayrollData } from "../types/payroll"
import { calculateEmployeeLevel, getLevelData } from "../data/salary-levels"

interface PayrollCalculationProps {
  employees: Employee[]
  payrollData: PayrollData[]
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export default function PayrollCalculation({
  employees,
  payrollData,
  selectedMonth,
  onMonthChange,
}: PayrollCalculationProps) {
  const calculatePayroll = (employee: Employee, data: PayrollData) => {
    // Calculate employee level based on revenue
    const calculatedLevel = calculateEmployeeLevel(data.monthlyRevenue, data.dailyRevenue)
    const levelData = getLevelData(calculatedLevel)

    if (!levelData) {
      return {
        level: "THỢ PHỤ LEVEL 1",
        serviceCommission: 0,
        productCommission: 0,
        facialCommission: 0,
        washingCommission: 0,
        chemicalCommission: 0,
        bleachingCommission: 0,
        totalCommission: 0,
        levelBonus: 0,
        kpiPenalty: 0,
        totalIncome: employee.basicSalary + employee.allowance,
        netPay: employee.basicSalary + employee.allowance - data.advance,
      }
    }

    // Calculate commissions based on level
    const serviceCommission = data.serviceRevenue * (levelData.serviceCommission / 100)
    const productCommission = data.productRevenue * (levelData.productCommission / 100)
    const facialCommission = data.facialRevenue * (levelData.facialCommission / 100)
    const washingCommission = data.washingRevenue * (levelData.washingCommission / 100)
    const chemicalCommission = data.chemicalRevenue * (levelData.chemicalCommission / 100)
    const bleachingCommission = data.bleachingRevenue * (levelData.bleachingCommission / 100)

    const totalCommission =
      serviceCommission +
      productCommission +
      facialCommission +
      washingCommission +
      chemicalCommission +
      bleachingCommission

    // KPI penalty: if not achieved, deduct 1% from total commission
    const kpiPenalty = !data.kpiAchieved ? totalCommission * 0.01 : 0

    const totalIncome =
      employee.basicSalary + employee.allowance + totalCommission + data.bonus - data.penalty - kpiPenalty
    const netPay = totalIncome - data.advance

    return {
      level: calculatedLevel,
      serviceCommission,
      productCommission,
      facialCommission,
      washingCommission,
      chemicalCommission,
      bleachingCommission,
      totalCommission,
      levelBonus: 0, // Will be implemented based on T13, T14, T15 logic
      kpiPenalty,
      totalIncome,
      netPay,
    }
  }

  const monthlyPayrollData = payrollData.filter((data) => data.month === selectedMonth)

  const months = [
    { value: "2024-01", label: "Tháng 1/2024" },
    { value: "2024-02", label: "Tháng 2/2024" },
    { value: "2024-03", label: "Tháng 3/2024" },
    { value: "2024-04", label: "Tháng 4/2024" },
    { value: "2024-05", label: "Tháng 5/2024" },
    { value: "2024-06", label: "Tháng 6/2024" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Bảng lương nhân viên</CardTitle>
            <CardDescription>Chi tiết lương và hoa hồng theo tháng</CardDescription>
          </div>
          <div className="flex space-x-4">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã NV</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Lương CB</TableHead>
                <TableHead>HH Dịch vụ</TableHead>
                <TableHead>HH Sản phẩm</TableHead>
                <TableHead>HH Facial</TableHead>
                <TableHead>HH Gội</TableHead>
                <TableHead>HH Hóa chất</TableHead>
                <TableHead>HH Tẩy</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Phạt KPI</TableHead>
                <TableHead>Thực nhận</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const data = monthlyPayrollData.find((d) => d.employeeId === employee.id)
                if (!data) {
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.code}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        Chưa có dữ liệu cho tháng này
                      </TableCell>
                    </TableRow>
                  )
                }

                const calculation = calculatePayroll(employee, data)

                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.code}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{calculation.level}</Badge>
                    </TableCell>
                    <TableCell>{employee.basicSalary.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.serviceCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.productCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.facialCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.washingCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.chemicalCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{calculation.bleachingCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Badge variant={data.kpiAchieved ? "default" : "destructive"}>
                        {data.kpiAchieved ? "Đạt" : "Không đạt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-600">-{calculation.kpiPenalty.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="font-bold text-green-600">
                      {calculation.netPay.toLocaleString("vi-VN")}đ
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
