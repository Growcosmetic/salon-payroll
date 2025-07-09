"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, TrendingUp, Users, DollarSign } from "lucide-react"
import type { Employee, PayrollData } from "../types/payroll"
import { useState } from "react"

interface ReportsProps {
  employees: Employee[]
  payrollData: PayrollData[]
}

export default function Reports({ employees, payrollData }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  const months = [
    { value: "2024-01", label: "Tháng 1/2024" },
    { value: "2024-02", label: "Tháng 2/2024" },
    { value: "2024-03", label: "Tháng 3/2024" },
    { value: "2024-04", label: "Tháng 4/2024" },
    { value: "2024-05", label: "Tháng 5/2024" },
    { value: "2024-06", label: "Tháng 6/2024" },
  ]

  // Calculate payroll for selected month
  const monthlyData = payrollData.filter((data) => data.month === selectedMonth)

  const calculatePayroll = (employee: Employee, data: PayrollData) => {
    const serviceCommission = data.serviceRevenue * (employee.serviceCommissionRate / 100)
    const productCommission = data.productRevenue * (employee.productCommissionRate / 100)
    const kpiBonus = data.kpiAchieved ? employee.kpiBonus : 0
    const totalIncome =
      employee.basicSalary +
      employee.allowance +
      serviceCommission +
      productCommission +
      kpiBonus +
      data.bonus -
      data.penalty
    const netPay = totalIncome - data.advance

    return { totalIncome, netPay, serviceCommission, productCommission }
  }

  // Summary statistics
  const totalEmployees = employees.length
  const activeEmployees = monthlyData.length
  const totalPayroll = monthlyData.reduce((sum, data) => {
    const employee = employees.find((emp) => emp.id === data.employeeId)
    if (!employee) return sum
    const { netPay } = calculatePayroll(employee, data)
    return sum + netPay
  }, 0)

  const kpiAchievers = monthlyData.filter((data) => data.kpiAchieved).length

  // Chart data - Payroll by position
  const positionData = employees.reduce(
    (acc, employee) => {
      const data = monthlyData.find((d) => d.employeeId === employee.id)
      if (!data) return acc

      const { netPay } = calculatePayroll(employee, data)
      const existing = acc.find((item) => item.position === employee.position)

      if (existing) {
        existing.amount += netPay
        existing.count += 1
      } else {
        acc.push({
          position: employee.position,
          amount: netPay,
          count: 1,
        })
      }

      return acc
    },
    [] as Array<{ position: string; amount: number; count: number }>,
  )

  // Department distribution
  const departmentData = employees.reduce(
    (acc, employee) => {
      const existing = acc.find((item) => item.department === employee.department)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({
          department: employee.department || "Khác",
          count: 1,
        })
      }
      return acc
    },
    [] as Array<{ department: string; count: number }>,
  )

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Top performers
  const topPerformers = monthlyData
    .map((data) => {
      const employee = employees.find((emp) => emp.id === data.employeeId)
      if (!employee) return null
      const { netPay, serviceCommission } = calculatePayroll(employee, data)
      return {
        employee,
        data,
        netPay,
        serviceCommission,
        totalRevenue: data.serviceRevenue + data.productRevenue,
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b?.totalRevenue || 0) - (a?.totalRevenue || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo lương</h2>
          <p className="text-muted-foreground">Thống kê và phân tích lương nhân viên</p>
        </div>
        <div className="flex space-x-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">{activeEmployees} có dữ liệu lương</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi lương</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
              {kpiAchievers}/{activeEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees > 0 ? Math.round((kpiAchievers / activeEmployees) * 100) : 0}% đạt KPI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lương TB</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeEmployees > 0 ? Math.round(totalPayroll / activeEmployees).toLocaleString("vi-VN") : 0}đ
            </div>
            <p className="text-xs text-muted-foreground">Lương trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lương theo chức vụ</CardTitle>
            <CardDescription>Tổng lương theo từng vị trí công việc</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString("vi-VN")}đ`, "Tổng lương"]} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố nhân viên theo bộ phận</CardTitle>
            <CardDescription>Số lượng nhân viên trong từng bộ phận</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, count, percent }) => `${department}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 nhân viên xuất sắc</CardTitle>
          <CardDescription>Xếp hạng theo tổng doanh thu tháng {selectedMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hạng</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Hoa hồng DV</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Thực nhận</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((performer, index) => {
                if (!performer) return null
                return (
                  <TableRow key={performer.employee.id}>
                    <TableCell>
                      <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{performer.employee.name}</div>
                        <div className="text-sm text-muted-foreground">{performer.employee.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{performer.employee.position}</TableCell>
                    <TableCell>{performer.totalRevenue.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{performer.serviceCommission.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Badge variant={performer.data.kpiAchieved ? "default" : "secondary"}>
                        {performer.data.kpiAchieved ? "Đạt" : "Không đạt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {performer.netPay.toLocaleString("vi-VN")}đ
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
