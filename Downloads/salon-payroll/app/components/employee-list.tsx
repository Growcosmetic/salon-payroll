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
import { Plus, Edit, Trash2, Users, Search, Filter } from "lucide-react"
import type { Employee } from "../types/payroll"
import { useEffect } from "react"

const positions = [
  "Stylist",
  "Nail Technician",
  "Facial Specialist",
  "Receptionist",
  "Manager",
  "Assistant",
  "Trainee",
  "Tài xế",
  "Kế toán",
  "Bảo vệ",
  "Thợ phụ",
  "Thợ chính",
  "Nhân viên bán hàng",
  "Nhân viên kho",
  "Nhân viên vệ sinh",
  "Nhân viên marketing",
  "Nhân viên IT",
  "Nhân viên nhân sự"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGroup, setFilterGroup] = useState("")

  // Fetch employees from API
  const fetchEmployees = async () => {
    const res = await fetch("/api/employees")
    const data = await res.json()
    if (Array.isArray(data)) onEmployeesChange(data)
  }

  // Listen for import events
  useEffect(() => {
    const handleImport = () => {
      fetchEmployees()
    }
    
    window.addEventListener("employees-imported", handleImport)
    return () => window.removeEventListener("employees-imported", handleImport)
  }, [])

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
    switch (position) {
      case "Manager":
        return "bg-purple-100 text-purple-800"
      case "Stylist":
      case "Thợ chính":
        return "bg-blue-100 text-blue-800"
      case "Nail Technician":
      case "Thợ nail":
        return "bg-pink-100 text-pink-800"
      case "Facial Specialist":
      case "Thợ facial":
        return "bg-green-100 text-green-800"
      case "Receptionist":
      case "Lễ tân":
        return "bg-yellow-100 text-yellow-800"
      case "Assistant":
      case "Thợ phụ":
        return "bg-orange-100 text-orange-800"
      case "Trainee":
      case "Thực tập sinh":
        return "bg-gray-100 text-gray-800"
      case "Tài xế":
        return "bg-indigo-100 text-indigo-800"
      case "Kế toán":
        return "bg-emerald-100 text-emerald-800"
      case "Bảo vệ":
        return "bg-red-100 text-red-800"
      case "Nhân viên bán hàng":
        return "bg-cyan-100 text-cyan-800"
      case "Nhân viên kho":
        return "bg-amber-100 text-amber-800"
      case "Nhân viên vệ sinh":
      case "Tạp vụ":
        return "bg-slate-100 text-slate-800"
      case "Nhân viên marketing":
        return "bg-fuchsia-100 text-fuchsia-800"
      case "Nhân viên IT":
        return "bg-violet-100 text-violet-800"
      case "Nhân viên nhân sự":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = !filterGroup || employee.employeeGroup === filterGroup
    return matchesSearch && matchesGroup
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Danh sách nhân viên
          </h2>
          <p className="text-gray-600">Quản lý thông tin nhân viên và mức lương</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEmployee} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
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
                  placeholder="Nhập mã nhân viên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Chức vụ *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
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
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
                <Label htmlFor="employeeGroup">Nhóm</Label>
                <Select value={formData.employeeGroup} onValueChange={(value) => setFormData({ ...formData, employeeGroup: value as "THỢ PHỤ" | "THỢ CHÍNH" | "RELAX" | "NAIL" })}>
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
                <Label htmlFor="currentLevel">Level</Label>
                <Select value={formData.currentLevel} onValueChange={(value) => setFormData({ ...formData, currentLevel: value })}>
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
                <Label htmlFor="basicSalary">Lương cơ bản</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={formData.basicSalary || ""}
                  onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                  placeholder="Nhập lương cơ bản"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowance">Phụ cấp</Label>
                <Input
                  id="allowance"
                  type="number"
                  value={formData.allowance || ""}
                  onChange={(e) => setFormData({ ...formData, allowance: Number(e.target.value) })}
                  placeholder="Nhập phụ cấp"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveEmployee} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                {editingEmployee ? "Cập nhật" : "Thêm nhân viên"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, mã, chức vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả nhóm</SelectItem>
                  {employeeGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách nhân viên ({filteredEmployees.length})</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {employees.length} tổng cộng
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Thông tin</TableHead>
                  <TableHead className="font-semibold">Chức vụ</TableHead>
                  <TableHead className="font-semibold">Nhóm</TableHead>
                  <TableHead className="font-semibold">Level</TableHead>
                  <TableHead className="font-semibold">Lương</TableHead>
                  <TableHead className="font-semibold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.code}</div>
                        <div className="text-xs text-gray-400">{employee.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPositionColor(employee.position)}>
                        {employee.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {employee.employeeGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {employee.currentLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {employee.basicSalary.toLocaleString("vi-VN")}đ
                        </div>
                        {employee.allowance > 0 && (
                          <div className="text-xs text-gray-500">
                            +{employee.allowance.toLocaleString("vi-VN")}đ phụ cấp
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
