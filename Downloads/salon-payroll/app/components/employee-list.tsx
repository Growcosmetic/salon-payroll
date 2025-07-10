"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Employee } from "../types/payroll"
import { useEffect } from "react"

const positions = [
  "Thợ chính",
  "Thợ phụ",
  "Kỹ thuật hóa chất",
  "Thợ nail",
  "Thợ facial",
  "Thực tập sinh",
  "Lễ tân",
  "Thu ngân",
  "Bảo vệ",
  "Tạp vụ",
  "Tài xế",
  "Kế toán",
]

const departments = ["Styling", "Nail", "Facial", "Front Office", "Support", "Management"]
const employeeGroups = ["THỢ PHỤ", "THỢ CHÍNH", "RELAX", "NAIL"]
const levels = ["THỢ MỚI", "DƯỚI TC", "TIÊU CHUẨN", "TARGET", "VƯỢT TARGET"]

interface EmployeeListProps {
  employees: Employee[]
  onEmployeesChange: (employees: Employee[]) => void
}

export default function EmployeeList({ employees, onEmployeesChange }: EmployeeListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<Partial<Employee>>({})

  // Fetch employees from API
  const fetchEmployees = async () => {
    const res = await fetch("/api/employees")
    const data = await res.json()
    if (Array.isArray(data)) onEmployeesChange(data)
  }

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setFormData({
      basicSalary: 0,
      allowance: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData(employee)
    setIsDialogOpen(true)
  }

  const handleSaveEmployee = async () => {
    if (!formData.name || !formData.code || !formData.position) return

    // Nếu đang sửa thì gọi API update, nếu thêm mới thì gọi API POST
    if (editingEmployee) {
      // TODO: Implement update API if needed
      // Hiện tại chỉ có POST, nên tạm thời xóa rồi thêm lại
      await fetch(`/api/employees/${editingEmployee.id}`, { method: "DELETE" })
    }
    const newEmployee: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      position: formData.position!,
      department: formData.department || "",
      basicSalary: formData.basicSalary || 0,
      allowance: formData.allowance || 0,
      employeeGroup: formData.employeeGroup as any || "THỢ PHỤ",
      currentLevel: formData.currentLevel || "THỢ MỚI",
      isNewEmployee: formData.isNewEmployee || false,
    }
    await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
    await fetchEmployees()
    setIsDialogOpen(false)
    setFormData({})
  }

  const handleDeleteEmployee = async (id: string) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" })
    await fetchEmployees()
  }

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      "Thợ chính": "bg-blue-100 text-blue-800",
      "Thợ phụ": "bg-green-100 text-green-800",
      "Kỹ thuật hóa chất": "bg-purple-100 text-purple-800",
      "Thợ nail": "bg-pink-100 text-pink-800",
      "Thợ facial": "bg-orange-100 text-orange-800",
      "Thực tập sinh": "bg-gray-100 text-gray-800",
      "Lễ tân": "bg-yellow-100 text-yellow-800",
      "Thu ngân": "bg-indigo-100 text-indigo-800",
      "Bảo vệ": "bg-red-100 text-red-800",
      "Tạp vụ": "bg-teal-100 text-teal-800",
      "Tài xế": "bg-cyan-100 text-cyan-800",
      "Kế toán": "bg-emerald-100 text-emerald-800",
    }
    return colors[position] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý thông tin nhân viên và mức lương</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddEmployee}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết của nhân viên</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Mã nhân viên *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="NV001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ *</Label>
                  <Select
                    value={formData.position || ""}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Bộ phận</Label>
                  <Select
                    value={formData.department || ""}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bộ phận" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Lương cơ bản (VNĐ)</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={formData.basicSalary || ""}
                    onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                    placeholder="5000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowance">Phụ cấp (VNĐ)</Label>
                  <Input
                    id="allowance"
                    type="number"
                    value={formData.allowance || ""}
                    onChange={(e) => setFormData({ ...formData, allowance: Number(e.target.value) })}
                    placeholder="500000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeGroup">Nhóm nhân viên</Label>
                  <Select
                    value={formData.employeeGroup || ""}
                    onValueChange={(value) => setFormData({ ...formData, employeeGroup: value as "THỢ PHỤ" | "THỢ CHÍNH" | "RELAX" | "NAIL" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLevel">Level hiện tại</Label>
                  <Select
                    value={formData.currentLevel || ""}
                    onValueChange={(value) => setFormData({ ...formData, currentLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isNewEmployee">Nhân viên mới</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isNewEmployee"
                      checked={formData.isNewEmployee || false}
                      onChange={(e) => setFormData({ ...formData, isNewEmployee: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isNewEmployee" className="text-sm">Đánh dấu nếu là nhân viên mới</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSaveEmployee}>{editingEmployee ? "Cập nhật" : "Thêm mới"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>Bộ phận</TableHead>
              <TableHead>Nhóm</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Lương cơ bản</TableHead>
              <TableHead>Phụ cấp</TableHead>
              <TableHead>Nhân viên mới</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.code}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>
                  <Badge className={getPositionColor(employee.position)}>{employee.position}</Badge>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant="outline">{employee.employeeGroup}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{employee.currentLevel}</Badge>
                </TableCell>
                <TableCell>{employee.basicSalary.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{employee.allowance.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>
                  {employee.isNewEmployee ? (
                    <Badge variant="destructive">Mới</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
