"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, DollarSign, Users, Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import type { Employee } from "../types/payroll"

interface CommissionSummaryProps {
  employees: Employee[]
}

// Mock data for demonstration
const mockCommissionData = [
  {
    employeeId: "001",
    employeeName: "Nguyễn Thị Lan",
    employeeCode: "NV001",
    date: "2024-01-15",
    totalRevenue: 8900000,
    totalCommission: 712000,
    serviceCount: 5,
    productCount: 2,
  },
  {
    employeeId: "002",
    employeeName: "Trần Văn Minh",
    employeeCode: "NV002",
    date: "2024-01-15",
    totalRevenue: 4500000,
    totalCommission: 360000,
    serviceCount: 3,
    productCount: 1,
  },
  {
    employeeId: "003",
    employeeName: "Lê Thị Hoa",
    employeeCode: "NV003",
    date: "2024-01-15",
    totalRevenue: 6200000,
    totalCommission: 496000,
    serviceCount: 4,
    productCount: 2,
  },
]

const weeklyData = [
  { date: "T2", revenue: 15000000, commission: 1200000 },
  { date: "T3", revenue: 18000000, commission: 1440000 },
  { date: "T4", revenue: 12000000, commission: 960000 },
  { date: "T5", revenue: 22000000, commission: 1760000 },
  { date: "T6", revenue: 28000000, commission: 2240000 },
  { date: "T7", revenue: 35000000, commission: 2800000 },
  { date: "CN", revenue: 32000000, commission: 2560000 },
]

export default function CommissionSummary({ employees }: CommissionSummaryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedEmployee, setSelectedEmployee] = useState("all")

  const totalRevenue = mockCommissionData.reduce((sum, data) => sum + data.totalRevenue, 0)
  const totalCommission = mockCommissionData.reduce((sum, data) => sum + data.totalCommission, 0)
  const totalServices = mockCommissionData.reduce((sum, data) => sum + data.serviceCount, 0)
  const totalProducts = mockCommissionData.reduce((sum, data) => sum + data.productCount, 0)

  const filteredData =
    selectedEmployee !== "all"
      ? mockCommissionData.filter((data) => data.employeeId === selectedEmployee)
      : mockCommissionData

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng hợp hoa hồng</CardTitle>
          <CardDescription>Theo dõi và phân tích hoa hồng nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nhân viên</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhân viên</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.code} - {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thao tác</label>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString("vi-VN")}đ</div>
            <p className="text-xs text-muted-foreground">+12% so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hoa hồng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCommission.toLocaleString("vi-VN")}đ</div>
            <p className="text-xs text-muted-foreground">
              {((totalCommission / totalRevenue) * 100).toFixed(1)}% của doanh thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">Lượt dịch vụ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm bán</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu & Hoa hồng theo ngày</CardTitle>
            <CardDescription>Biểu đồ doanh thu và hoa hồng 7 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString("vi-VN")}đ`,
                    name === "revenue" ? "Doanh thu" : "Hoa hồng",
                  ]}
                />
                <Bar dataKey="revenue" fill="#8884d8" name="revenue" />
                <Bar dataKey="commission" fill="#82ca9d" name="commission" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng hoa hồng</CardTitle>
            <CardDescription>Tỷ lệ hoa hồng trên doanh thu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={weeklyData.map((item) => ({
                  ...item,
                  commissionRate: (item.commission / item.revenue) * 100,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Tỷ lệ hoa hồng"]} />
                <Line type="monotone" dataKey="commissionRate" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất nhân viên hôm nay</CardTitle>
          <CardDescription>Chi tiết doanh thu và hoa hồng từng nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Hoa hồng</TableHead>
                  <TableHead>Tỷ lệ HH</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Hiệu suất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData
                  .sort((a, b) => b.totalCommission - a.totalCommission)
                  .map((data, index) => (
                    <TableRow key={data.employeeId}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{data.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{data.employeeCode}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{data.totalRevenue.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {data.totalCommission.toLocaleString("vi-VN")}đ
                      </TableCell>
                      <TableCell>{((data.totalCommission / data.totalRevenue) * 100).toFixed(1)}%</TableCell>
                      <TableCell>{data.serviceCount}</TableCell>
                      <TableCell>{data.productCount}</TableCell>
                      <TableCell>
                        <Badge variant={index < 2 ? "default" : index < 4 ? "secondary" : "outline"}>
                          {index < 2 ? "Xuất sắc" : index < 4 ? "Tốt" : "Trung bình"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
