"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Edit, Trash2, Download } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { Employee } from "../types/payroll"

interface DailyCommissionEntry {
  id: string
  employeeId: string
  date: string
  serviceCode: string
  serviceName: string
  serviceGroup: string
  serviceType: "SERVICE" | "PRODUCT"
  quantity: number
  timesPerformed: number
  timesSold: number
  revenueBeforeDiscount: number
  revenueAfterDiscount: number
  commissionAmount: number
}

interface DailyCommissionTrackerProps {
  employees: Employee[]
}

const serviceList = [
  { code: "NADPH", name: "NHUỘM TÓC DÀI HAIR ARTIST", group: "HÓA CHẤT NỮ DÀI", type: "SERVICE" as const },
  { code: "U1AD", name: "UỐN TÓC DÀI HAIR ARTIST", group: "HÓA CHẤT NỮ DÀI", type: "SERVICE" as const },
  { code: "FACIAL01", name: "FACIAL BASIC", group: "FACIAL", type: "SERVICE" as const },
  { code: "FACIAL02", name: "FACIAL PREMIUM", group: "FACIAL", type: "SERVICE" as const },
  { code: "KERATIN01", name: "KERATIN TREATMENT", group: "TREATMENT", type: "SERVICE" as const },
  { code: "HIGHLIGHT01", name: "HIGHLIGHT BASIC", group: "COLORING", type: "SERVICE" as const },
  { code: "PERM01", name: "PERM BASIC", group: "STYLING", type: "SERVICE" as const },
  { code: "NAIL01", name: "NAIL DESIGN BASIC", group: "NAIL", type: "SERVICE" as const },
  { code: "NAIL02", name: "NAIL DESIGN PREMIUM", group: "NAIL", type: "SERVICE" as const },
  { code: "PROD01", name: "SHAMPOO PREMIUM", group: "HAIR CARE", type: "PRODUCT" as const },
  { code: "PROD02", name: "CONDITIONER PREMIUM", group: "HAIR CARE", type: "PRODUCT" as const },
  { code: "PROD03", name: "HAIR MASK", group: "TREATMENT", type: "PRODUCT" as const },
]

export default function DailyCommissionTracker({ employees }: DailyCommissionTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [commissionEntries, setCommissionEntries] = useState<DailyCommissionEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<Partial<DailyCommissionEntry>>({})
  const [isEditing, setIsEditing] = useState(false)

  const handleAddEntry = () => {
    setEditingEntry({
      date: format(selectedDate, "yyyy-MM-dd"),
      employeeId: selectedEmployee,
      quantity: 0,
      timesPerformed: 0,
      timesSold: 0,
      revenueBeforeDiscount: 0,
      revenueAfterDiscount: 0,
      commissionAmount: 0,
    })
    setIsEditing(true)
  }

  const handleSaveEntry = () => {
    if (!editingEntry.serviceCode || !editingEntry.employeeId) return

    const selectedService = serviceList.find((s) => s.code === editingEntry.serviceCode)
    if (!selectedService) return

    const newEntry: DailyCommissionEntry = {
      id: editingEntry.id || Date.now().toString(),
      employeeId: editingEntry.employeeId!,
      date: editingEntry.date!,
      serviceCode: editingEntry.serviceCode,
      serviceName: selectedService.name,
      serviceGroup: selectedService.group,
      serviceType: selectedService.type,
      quantity: editingEntry.quantity || 0,
      timesPerformed: editingEntry.timesPerformed || 0,
      timesSold: editingEntry.timesSold || 0,
      revenueBeforeDiscount: editingEntry.revenueBeforeDiscount || 0,
      revenueAfterDiscount: editingEntry.revenueAfterDiscount || 0,
      commissionAmount: editingEntry.commissionAmount || 0,
    }

    if (editingEntry.id) {
      setCommissionEntries(commissionEntries.map((entry) => (entry.id === editingEntry.id ? newEntry : entry)))
    } else {
      setCommissionEntries([...commissionEntries, newEntry])
    }

    setEditingEntry({})
    setIsEditing(false)
  }

  const handleEditEntry = (entry: DailyCommissionEntry) => {
    setEditingEntry(entry)
    setIsEditing(true)
  }

  const handleDeleteEntry = (id: string) => {
    setCommissionEntries(commissionEntries.filter((entry) => entry.id !== id))
  }

  const calculateCommission = () => {
    if (!editingEntry.revenueAfterDiscount || !selectedEmployee) return

    const employee = employees.find((emp) => emp.id === selectedEmployee)
    if (!employee) return

    const selectedService = serviceList.find((s) => s.code === editingEntry.serviceCode)
    if (!selectedService) return

    // Simple commission calculation - this would be more complex based on employee level and service type
    let commissionRate = 0.1 // Default 10%

    // This would be calculated based on employee level and service type
    if (selectedService.type === "SERVICE") {
      commissionRate = 0.08 // 8% for services
    } else {
      commissionRate = 0.12 // 12% for products
    }

    const commission = (editingEntry.revenueAfterDiscount || 0) * commissionRate
    setEditingEntry({ ...editingEntry, commissionAmount: commission })
  }

  const filteredEntries = commissionEntries.filter(
    (entry) =>
      entry.date === format(selectedDate, "yyyy-MM-dd") &&
      (selectedEmployee === "all" || entry.employeeId === selectedEmployee),
  )

  const dailyTotal = filteredEntries.reduce((sum, entry) => sum + entry.commissionAmount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theo dõi hoa hồng hàng ngày</CardTitle>
          <CardDescription>Nhập và theo dõi hoa hồng từ dịch vụ và sản phẩm hàng ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Chọn ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Nhân viên</Label>
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
              <Label>Thao tác</Label>
              <Button onClick={handleAddEntry} disabled={selectedEmployee === "all"} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Thêm dịch vụ
              </Button>
            </div>
          </div>

          {/* Entry Form */}
          {isEditing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{editingEntry.id ? "Chỉnh sửa" : "Thêm"} dịch vụ/sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dịch vụ/Sản phẩm</Label>
                    <Select
                      value={editingEntry.serviceCode || "NADPH"}
                      onValueChange={(value) => setEditingEntry({ ...editingEntry, serviceCode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ/sản phẩm" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceList.map((service) => (
                          <SelectItem key={service.code} value={service.code}>
                            {service.name} ({service.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Số lần thực hiện</Label>
                    <Input
                      type="number"
                      value={editingEntry.timesPerformed || ""}
                      onChange={(e) => setEditingEntry({ ...editingEntry, timesPerformed: Number(e.target.value) })}
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Số lần bán hàng</Label>
                    <Input
                      type="number"
                      value={editingEntry.timesSold || ""}
                      onChange={(e) => setEditingEntry({ ...editingEntry, timesSold: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Doanh thu trước giảm giá</Label>
                    <Input
                      type="number"
                      value={editingEntry.revenueBeforeDiscount || ""}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, revenueBeforeDiscount: Number(e.target.value) })
                      }
                      placeholder="6200000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Doanh thu sau giảm giá</Label>
                    <Input
                      type="number"
                      value={editingEntry.revenueAfterDiscount || ""}
                      onChange={(e) => {
                        setEditingEntry({ ...editingEntry, revenueAfterDiscount: Number(e.target.value) })
                      }}
                      onBlur={calculateCommission}
                      placeholder="5952000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hoa hồng</Label>
                    <Input
                      type="number"
                      value={editingEntry.commissionAmount || ""}
                      onChange={(e) => setEditingEntry({ ...editingEntry, commissionAmount: Number(e.target.value) })}
                      placeholder="476160"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveEntry}>{editingEntry.id ? "Cập nhật" : "Thêm"}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{filteredEntries.length}</div>
                <p className="text-xs text-muted-foreground">Dịch vụ/Sản phẩm</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {filteredEntries.reduce((sum, entry) => sum + entry.revenueAfterDiscount, 0).toLocaleString("vi-VN")}đ
                </div>
                <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{dailyTotal.toLocaleString("vi-VN")}đ</div>
                <p className="text-xs text-muted-foreground">Tổng hoa hồng</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Daily Entries Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Chi tiết hoa hồng ngày {format(selectedDate, "dd/MM/yyyy", { locale: vi })}</CardTitle>
              <CardDescription>
                {selectedEmployee !== "all"
                  ? `Nhân viên: ${employees.find((emp) => emp.id === selectedEmployee)?.name}`
                  : "Tất cả nhân viên"}
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Mã DV/SP</TableHead>
                  <TableHead>Tên dịch vụ/sản phẩm</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>SL thực hiện</TableHead>
                  <TableHead>SL bán</TableHead>
                  <TableHead>DT trước giảm giá</TableHead>
                  <TableHead>DT sau giảm giá</TableHead>
                  <TableHead>Hoa hồng</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const employee = employees.find((emp) => emp.id === entry.employeeId)
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee?.name}</div>
                          <div className="text-sm text-muted-foreground">{employee?.code}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{entry.serviceCode}</TableCell>
                      <TableCell>{entry.serviceName}</TableCell>
                      <TableCell>{entry.serviceGroup}</TableCell>
                      <TableCell>
                        <Badge variant={entry.serviceType === "SERVICE" ? "default" : "secondary"}>
                          {entry.serviceType === "SERVICE" ? "Dịch vụ" : "Sản phẩm"}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.timesPerformed}</TableCell>
                      <TableCell>{entry.timesSold}</TableCell>
                      <TableCell>{entry.revenueBeforeDiscount.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>{entry.revenueAfterDiscount.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {entry.commissionAmount.toLocaleString("vi-VN")}đ
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditEntry(entry)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
