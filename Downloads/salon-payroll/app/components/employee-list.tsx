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

interface EmployeeListProps {
  employees: Employee[]
  onEmployeesChange: (employees: Employee[]) => void
}

export default function EmployeeList({ employees, onEmployeesChange }: EmployeeListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<Partial<Employee>>({})

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setFormData({
      basicSalary: 0,
      allowance: 0,
      serviceCommissionRate: 0,
      productCommissionRate: 0,
      kpiTarget: 0,
      kpiBonus: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData(employee)
    setIsDialogOpen(true)
  }

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.code || !formData.position) return

    const newEmployee: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name!,
      code: formData.code!,
      position: formData.position!,
      department: formData.department || "",
      basicSalary: formData.basicSalary || 0,
      allowance: formData.allowance || 0,
      serviceCommissionRate: formData.serviceCommissionRate || 0,
      productCommissionRate: formData.productCommissionRate || 0,
      kpiTarget: formData.kpiTarget || 0,
      kpiBonus: formData.kpiBonus || 0,
    }

    if (editingEmployee) {
      onEmployeesChange(employees.map((emp) => (emp.id === editingEmployee.id ? newEmployee : emp)))
    } else {
      onEmployeesChange([...employees, newEmployee])
    }

    setIsDialogOpen(false)
    setFormData({})
  }

  const handleDeleteEmployee = (id: string) => {
    onEmployeesChange(employees.filter((emp) => emp.id !== id))
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
                  <Label htmlFor="serviceCommissionRate">Hoa hồng dịch vụ (%)</Label>
                  <Input
                    id="serviceCommissionRate"
                    type="number"
                    value={formData.serviceCommissionRate || ""}
                    onChange={(e) => setFormData({ ...formData, serviceCommissionRate: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCommissionRate">Hoa hồng sản phẩm (%)</Label>
                  <Input
                    id="productCommissionRate"
                    type="number"
                    value={formData.productCommissionRate || ""}
                    onChange={(e) => setFormData({ ...formData, productCommissionRate: Number(e.target.value) })}
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpiTarget">Mục tiêu KPI (VNĐ)</Label>
                  <Input
                    id="kpiTarget"
                    type="number"
                    value={formData.kpiTarget || ""}
                    onChange={(e) => setFormData({ ...formData, kpiTarget: Number(e.target.value) })}
                    placeholder="15000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpiBonus">Thưởng KPI (VNĐ)</Label>
                  <Input
                    id="kpiBonus"
                    type="number"
                    value={formData.kpiBonus || ""}
                    onChange={(e) => setFormData({ ...formData, kpiBonus: Number(e.target.value) })}
                    placeholder="1000000"
                  />
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
              <TableHead>Lương cơ bản</TableHead>
              <TableHead>Hoa hồng DV</TableHead>
              <TableHead>Hoa hồng SP</TableHead>
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
                <TableCell>{employee.basicSalary.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{employee.serviceCommissionRate}%</TableCell>
                <TableCell>{employee.productCommissionRate}%</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                      <Trash2 className="h-4 w-4" />
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
