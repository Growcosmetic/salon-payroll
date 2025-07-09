"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { calculateEmployeeLevel, getLevelData, salaryLevels } from "../data/salary-levels"
import { Calculator } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function LevelCalculator() {
  const [dailyRevenue, setDailyRevenue] = useState<number>(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0)
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [manualLevel, setManualLevel] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Fetch employees from API
    const fetchEmployees = async () => {
      const res = await fetch("/api/employees")
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    }
    fetchEmployees()
  }, [])

  // Khi chọn nhân viên, set level thủ công về level hiện tại của nhân viên
  useEffect(() => {
    if (selectedEmployeeId) {
      const emp = employees.find((e) => e.id === selectedEmployeeId)
      if (emp) setManualLevel(emp.currentLevel || "")
    }
  }, [selectedEmployeeId, employees])

  const calculatedLevel = calculateEmployeeLevel(monthlyRevenue, dailyRevenue)
  const levelData = getLevelData(calculatedLevel)

  const handleSaveLevel = async () => {
    if (!selectedEmployeeId || !manualLevel) {
      setMessage("Vui lòng chọn nhân viên và cấp độ!")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/employees/${selectedEmployeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentLevel: manualLevel }),
      })
      if (res.ok) {
        setMessage("Cập nhật cấp độ thành công!")
        // Cập nhật lại employees state
        const updated = employees.map((e) =>
          e.id === selectedEmployeeId ? { ...e, currentLevel: manualLevel } : e
        )
        setEmployees(updated)
      } else {
        setMessage("Có lỗi khi cập nhật cấp độ!")
      }
    } catch (err) {
      setMessage("Có lỗi khi cập nhật cấp độ!")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tính toán Level nhân viên
          </CardTitle>
          <CardDescription>Nhập doanh thu để xác định level và tỷ lệ hoa hồng tương ứng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Chọn nhân viên</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRevenue">Doanh thu trung bình/ngày (VNĐ)</Label>
                <Input
                  id="dailyRevenue"
                  type="number"
                  value={dailyRevenue || ""}
                  onChange={(e) => setDailyRevenue(Number(e.target.value))}
                  placeholder="2000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue">Doanh thu/tháng (VNĐ)</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  value={monthlyRevenue || ""}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  placeholder="50000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Chọn cấp độ thủ công</Label>
                <Select value={manualLevel} onValueChange={setManualLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THỢ MỚI">Thợ mới</SelectItem>
                    <SelectItem value="TIÊU CHUẨN">Tiêu chuẩn</SelectItem>
                    <SelectItem value="TARGET">Target</SelectItem>
                    <SelectItem value="VƯỢT TARGET">Vượt target</SelectItem>
                    <SelectItem value="THỢ PHỤ LEVEL 1">Thợ phụ Level 1</SelectItem>
                    <SelectItem value="THỢ PHỤ LEVEL 2">Thợ phụ Level 2</SelectItem>
                    <SelectItem value="THỢ PHỤ LEVEL 3">Thợ phụ Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveLevel} disabled={saving} className="mt-2">
                {saving ? "Đang lưu..." : "Áp dụng/Lưu cấp độ"}
              </Button>
              {message && <div className="text-sm text-green-600 mt-2">{message}</div>}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Level được xác định (tự động):</Label>
                <div className="mt-2">
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {calculatedLevel}
                  </Badge>
                </div>
              </div>

              {levelData && (
                <div className="space-y-2">
                  <Label>Tỷ lệ hoa hồng:</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Dịch vụ: <span className="font-semibold">{levelData.serviceCommission}%</span>
                    </div>
                    <div>
                      Sản phẩm: <span className="font-semibold">{levelData.productCommission}%</span>
                    </div>
                    <div>
                      Facial: <span className="font-semibold">{levelData.facialCommission}%</span>
                    </div>
                    <div>
                      Gội đầu: <span className="font-semibold">{levelData.washingCommission}%</span>
                    </div>
                    <div>
                      Hóa chất: <span className="font-semibold">{levelData.chemicalCommission}%</span>
                    </div>
                    <div>
                      Tẩy: <span className="font-semibold">{levelData.bleachingCommission}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div>
                      Thưởng: <span className="font-semibold">{levelData.bonus}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Giờ làm việc: {levelData.workingHours}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Structure Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng cấp độ lương</CardTitle>
          <CardDescription>Chi tiết các level và yêu cầu doanh thu tương ứng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Doanh thu/ngày</TableHead>
                  <TableHead>Doanh thu/tháng</TableHead>
                  <TableHead>HH Dịch vụ</TableHead>
                  <TableHead>HH Sản phẩm</TableHead>
                  <TableHead>HH Facial</TableHead>
                  <TableHead>HH Gội</TableHead>
                  <TableHead>HH Hóa chất</TableHead>
                  <TableHead>HH Tẩy</TableHead>
                  <TableHead>Thưởng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryLevels.map((level) => (
                  <TableRow key={level.level} className={calculatedLevel === level.level ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">
                      <Badge variant={calculatedLevel === level.level ? "default" : "outline"}>{level.level}</Badge>
                    </TableCell>
                    <TableCell>{level.dailyRevenueMin.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{level.monthlyRevenueMin.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{level.serviceCommission}%</TableCell>
                    <TableCell>{level.productCommission}%</TableCell>
                    <TableCell>{level.facialCommission}%</TableCell>
                    <TableCell>{level.washingCommission}%</TableCell>
                    <TableCell>{level.chemicalCommission}%</TableCell>
                    <TableCell>{level.bleachingCommission}%</TableCell>
                    <TableCell>{level.bonus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* KPI Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu KPI hàng tháng</CardTitle>
          <CardDescription>Các chỉ tiêu cần đạt để không bị trừ 1% tổng hoa hồng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-muted-foreground">Facial</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Sản phẩm</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-muted-foreground">Tẩy TBC da đầu/Peel</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div className="text-sm text-muted-foreground">Hấp dầu/20 Protein/7Second</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">4</div>
              <div className="text-sm text-muted-foreground">Phục hồi</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-sm text-muted-foreground">Gói bổ sung ánh sắc</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Nếu không đạt KPI dịch vụ sẽ bị trừ 1% tổng hoa hồng tháng
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
