"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Upload, Edit } from "lucide-react"
import type { Employee, PayrollData } from "../types/payroll"
import ImportExcelComponent from "./import-excel"
import KpiCriteriaManager from "./kpi-criteria-manager"

interface DataEntryProps {
  employees: Employee[]
  payrollData: PayrollData[]
  onPayrollDataChange: (data: PayrollData[]) => void
  selectedMonth: string
}

export default function DataEntry({ employees, payrollData, onPayrollDataChange, selectedMonth }: DataEntryProps) {
  const [editingData, setEditingData] = useState<Partial<PayrollData>>({})
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveData = async () => {
    if (!selectedEmployee || !editingData.month) return

    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingData,
          employeeId: selectedEmployee,
        }),
      })
      if (res.ok) {
        setMessage("Lưu dữ liệu thành công!")
      } else {
        setMessage("Có lỗi khi lưu dữ liệu!")
      }
    } catch (err) {
      setMessage("Có lỗi khi lưu dữ liệu!")
    }
    setSaving(false)
    setEditingData({})
    setSelectedEmployee("")
  }

  const handleEditData = (data: PayrollData) => {
    setEditingData(data)
    setSelectedEmployee(data.employeeId)
  }

  const monthlyData = payrollData.filter((data) => data.month === selectedMonth)

  const months = [
    { value: "2024-01", label: "Tháng 1/2024" },
    { value: "2024-02", label: "Tháng 2/2024" },
    { value: "2024-03", label: "Tháng 3/2024" },
    { value: "2024-04", label: "Tháng 4/2024" },
    { value: "2024-05", label: "Tháng 5/2024" },
    { value: "2024-06", label: "Tháng 6/2024" },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Criteria Manager */}
      <KpiCriteriaManager selectedMonth={selectedMonth} />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Nhập thủ công</TabsTrigger>
          <TabsTrigger value="import">Import Excel</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Nhập dữ liệu lương</CardTitle>
              <CardDescription>Nhập doanh thu, KPI, thưởng phạt cho từng nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Nhân viên</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.code} - {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="month">Tháng</Label>
                    <Select
                      value={editingData.month || selectedMonth}
                      onValueChange={(value) => setEditingData({ ...editingData, month: value })}
                    >
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyRevenue">Doanh thu ngày TB (VNĐ)</Label>
                    <Input
                      id="dailyRevenue"
                      type="number"
                      value={editingData.dailyRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, dailyRevenue: Number(e.target.value) })}
                      placeholder="2000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue">Doanh thu tháng (VNĐ)</Label>
                    <Input
                      id="monthlyRevenue"
                      type="number"
                      value={editingData.monthlyRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, monthlyRevenue: Number(e.target.value) })}
                      placeholder="50000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceRevenue">Doanh thu dịch vụ (VNĐ)</Label>
                    <Input
                      id="serviceRevenue"
                      type="number"
                      value={editingData.serviceRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, serviceRevenue: Number(e.target.value) })}
                      placeholder="15000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productRevenue">Doanh thu sản phẩm (VNĐ)</Label>
                    <Input
                      id="productRevenue"
                      type="number"
                      value={editingData.productRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, productRevenue: Number(e.target.value) })}
                      placeholder="2000000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facialRevenue">Doanh thu Facial (VNĐ)</Label>
                    <Input
                      id="facialRevenue"
                      type="number"
                      value={editingData.facialRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, facialRevenue: Number(e.target.value) })}
                      placeholder="1000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="washingRevenue">Doanh thu gội đầu (VNĐ)</Label>
                    <Input
                      id="washingRevenue"
                      type="number"
                      value={editingData.washingRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, washingRevenue: Number(e.target.value) })}
                      placeholder="500000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chemicalRevenue">Doanh thu hóa chất (VNĐ)</Label>
                    <Input
                      id="chemicalRevenue"
                      type="number"
                      value={editingData.chemicalRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, chemicalRevenue: Number(e.target.value) })}
                      placeholder="800000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bleachingRevenue">Doanh thu tẩy (VNĐ)</Label>
                    <Input
                      id="bleachingRevenue"
                      type="number"
                      value={editingData.bleachingRevenue || ""}
                      onChange={(e) => setEditingData({ ...editingData, bleachingRevenue: Number(e.target.value) })}
                      placeholder="300000"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kpiAchieved"
                      checked={editingData.kpiAchieved || false}
                      onCheckedChange={async (checked) => {
                        setEditingData({ ...editingData, kpiAchieved: checked as boolean })
                        if (selectedEmployee && editingData.month) {
                          setSaving(true)
                          setMessage("")
                          try {
                            const res = await fetch("/api/payroll", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                ...editingData,
                                employeeId: selectedEmployee,
                                kpiAchieved: checked as boolean,
                              }),
                            })
                            if (res.ok) {
                              setMessage("Cập nhật KPI thành công!")
                            } else {
                              setMessage("Có lỗi khi cập nhật KPI!")
                            }
                          } catch (err) {
                            setMessage("Có lỗi khi cập nhật KPI!")
                          }
                          setSaving(false)
                        }
                      }}
                    />
                    <Label htmlFor="kpiAchieved">
                      Đạt KPI (4 Facial, 2 SP, 5 Tẩy, 4 Hấp dầu, 4 Phục hồi, 3 Ánh sác)
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonus">Thưởng khác (VNĐ)</Label>
                    <Input
                      id="bonus"
                      type="number"
                      value={editingData.bonus || ""}
                      onChange={(e) => setEditingData({ ...editingData, bonus: Number(e.target.value) })}
                      placeholder="500000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advance">Tạm ứng (VNĐ)</Label>
                    <Input
                      id="advance"
                      type="number"
                      value={editingData.advance || ""}
                      onChange={(e) => setEditingData({ ...editingData, advance: Number(e.target.value) })}
                      placeholder="1000000"
                    />
                  </div>

                  <Button onClick={handleSaveData} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {editingData.id ? "Cập nhật" : "Lưu dữ liệu"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import dữ liệu từ Excel</CardTitle>
              <CardDescription>Import dữ liệu từ file Excel vào hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>File Excel cần có 3 sheet:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Employees: Thông tin nhân viên</li>
                  <li>PayrollData: Dữ liệu lương</li>
                  <li>DailyCommission: Hoa hồng hàng ngày</li>
                </ul>
                <ImportExcelComponent />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Month Data */}
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu tháng hiện tại</CardTitle>
          <CardDescription>Danh sách dữ liệu đã nhập cho tháng {selectedMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Doanh thu DV</TableHead>
                <TableHead>Doanh thu SP</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Thưởng</TableHead>
                <TableHead>Phạt</TableHead>
                <TableHead>Tạm ứng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((data) => {
                const employee = employees.find((emp) => emp.id === data.employeeId)
                if (!employee) return null

                return (
                  <TableRow key={data.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{data.serviceRevenue.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{data.productRevenue.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Badge variant={data.kpiAchieved ? "default" : "secondary"}>
                        {data.kpiAchieved ? "Đạt" : "Không đạt"}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.bonus.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{data.penalty.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{data.advance.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEditData(data)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {message && <div className="text-sm text-green-600 mt-2">{message}</div>}
    </div>
  )
}
