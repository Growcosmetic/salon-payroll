"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { employeeGroups } from "../data/salary-levels"

export default function EmployeeGroupSelector() {
  const [selectedGroup, setSelectedGroup] = useState<string>("THỢ PHỤ")

  const currentLevels = employeeGroups[selectedGroup as keyof typeof employeeGroups]

  const getCommissionColumns = (group: string) => {
    switch (group) {
      case "THỢ PHỤ":
        return ["Dịch vụ", "Sản phẩm", "Facial", "Gội", "Hóa chất", "Tẩy"]
      case "THỢ CHÍNH":
        return ["Dịch vụ", "Tẩy", "Cắt"]
      case "RELAX":
        return ["Dịch vụ"]
      case "NAIL":
        return ["Dịch vụ"]
      default:
        return ["Dịch vụ"]
    }
  }

  const getCommissionValues = (level: any, group: string) => {
    switch (group) {
      case "THỢ PHỤ":
        return [
          `${level.serviceCommission}%`,
          `${level.productCommission}%`,
          `${level.facialCommission}%`,
          `${level.washingCommission}%`,
          `${level.chemicalCommission}%`,
          `${level.bleachingCommission}%`,
        ]
      case "THỢ CHÍNH":
        return [`${level.serviceCommission}%`, `${level.bleachingCommission}%`, `${level.cuttingCommission}%`]
      case "RELAX":
        return [`${level.serviceCommission}%`]
      case "NAIL":
        return [`${level.serviceCommission}%`]
      default:
        return [`${level.serviceCommission}%`]
    }
  }

  const getKpiRequirements = (group: string) => {
    switch (group) {
      case "THỢ PHỤ":
        return [
          { name: "Facial", count: 4 },
          { name: "Sản phẩm", count: 2 },
          { name: "Tẩy TBC", count: 5 },
          { name: "Hấp dầu", count: 4 },
          { name: "Phục hồi", count: 4 },
          { name: "Ánh sắc", count: 3 },
        ]
      case "THỢ CHÍNH":
        return [
          { name: "Keratin", count: 8 },
          { name: "Tẩy", count: 4 },
          { name: "Highlight", count: 3 },
          { name: "The New Me", count: 4 },
          { name: "Uốn", count: 2 },
          { name: "Chăn tóc", count: 3 },
        ]
      case "RELAX":
        return [
          { name: "Oil cao cấp", count: 6 },
          { name: "Keratin", count: 8 },
          { name: "Spa chân", count: 7 },
        ]
      case "NAIL":
        return [
          { name: "Thiết kế/Ngón", count: 50 },
          { name: "Keratin", count: 6 },
          { name: "Mặt nạ dưỡng", count: 10 },
        ]
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chọn nhóm nhân viên</CardTitle>
          <CardDescription>Xem cấu trúc lương và KPI cho từng nhóm nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn nhóm nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THỢ PHỤ">THỢ PHỤ (Assistant)</SelectItem>
              <SelectItem value="THỢ CHÍNH">THỢ CHÍNH (Main Stylist)</SelectItem>
              <SelectItem value="RELAX">RELAX</SelectItem>
              <SelectItem value="NAIL">NAIL</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cấu trúc lương - {selectedGroup}</CardTitle>
          <CardDescription>Chi tiết các level và tỷ lệ hoa hồng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Lương CB</TableHead>
                  <TableHead>Doanh thu/ngày</TableHead>
                  <TableHead>Doanh thu/tháng</TableHead>
                  {getCommissionColumns(selectedGroup).map((col) => (
                    <TableHead key={col}>HH {col}</TableHead>
                  ))}
                  <TableHead>Thưởng</TableHead>
                  <TableHead>Giờ làm việc</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLevels.map((level) => (
                  <TableRow key={level.level}>
                    <TableCell>
                      <Badge variant="outline">{level.level}</Badge>
                    </TableCell>
                    <TableCell>{level.basicSalary?.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{level.dailyRevenueMin.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{level.monthlyRevenueMin.toLocaleString("vi-VN")}đ</TableCell>
                    {getCommissionValues(level, selectedGroup).map((value, index) => (
                      <TableCell key={index}>{value}</TableCell>
                    ))}
                    <TableCell>{level.bonus}</TableCell>
                    <TableCell className="text-xs">{level.workingHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu KPI - {selectedGroup}</CardTitle>
          <CardDescription>Các chỉ tiêu cần đạt hàng tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getKpiRequirements(selectedGroup).map((kpi, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpi.count}</div>
                <div className="text-sm text-muted-foreground">{kpi.name}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Phạt KPI:</strong> Không đạt KPI dịch vụ sẽ bị trừ 2% tổng hoa hồng tháng
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Thợ mới:</strong> Không đạt KPI sẽ bị trừ 4% tổng hoa hồng tháng
              </p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Lưu ý:</strong> Nếu 2 tháng liên tiếp không đạt KPI sẽ gặp quản lý điều chỉnh lương
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
