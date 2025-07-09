"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users, Calculator, TrendingUp, DollarSign, FileText, Settings } from "lucide-react"

export default function TestingGuide() {
  const testScenarios = [
    {
      title: "Test cơ bản - Nhân viên và Level",
      icon: <Users className="h-4 w-4" />,
      steps: [
        "Vào tab 'Test Data' → Tạo 5-10 nhân viên",
        "Vào tab 'Nhân viên' → Kiểm tra danh sách được tạo",
        "Vào tab 'Tính Level' → Test với doanh thu khác nhau",
        "Vào tab 'Nhóm NV' → Xem cấu trúc lương từng nhóm",
      ],
      expected: "Nhân viên được tạo với các nhóm khác nhau, level tự động tính đúng",
    },
    {
      title: "Test tính lương theo Level",
      icon: <Calculator className="h-4 w-4" />,
      steps: [
        "Tạo dữ liệu lương cho nhân viên (tab Test Data)",
        "Vào tab 'Bảng lương' → Xem kết quả tính toán",
        "Kiểm tra hoa hồng theo từng loại dịch vụ",
        "Kiểm tra phạt KPI (1-4% tùy nhóm và thợ mới)",
      ],
      expected: "Lương được tính đúng theo level, hoa hồng chính xác, phạt KPI áp dụng đúng",
    },
    {
      title: "Test KPI và phạt",
      icon: <TrendingUp className="h-4 w-4" />,
      steps: [
        "Vào tab 'Nhập liệu' → Nhập KPI không đạt cho 1 nhân viên",
        "Đánh dấu nhân viên là 'thợ mới'",
        "Kiểm tra bảng lương → Xem mức phạt KPI",
        "So sánh phạt 2% (thợ cũ) vs 4% (thợ mới)",
      ],
      expected: "Phạt KPI được áp dụng đúng: 2% cho thợ cũ, 4% cho thợ mới",
    },
    {
      title: "Test hoa hồng hàng ngày",
      icon: <DollarSign className="h-4 w-4" />,
      steps: [
        "Vào tab 'HH Hàng ngày' → Chọn nhân viên và ngày",
        "Thêm các dịch vụ: Nhuộm tóc, Facial, Nail...",
        "Nhập doanh thu trước/sau giảm giá",
        "Kiểm tra hoa hồng tự động tính",
      ],
      expected: "Hoa hồng được tính theo level nhân viên và loại dịch vụ",
    },
    {
      title: "Test báo cáo và thống kê",
      icon: <FileText className="h-4 w-4" />,
      steps: [
        "Vào tab 'Tổng hợp HH' → Xem dashboard tổng quan",
        "Kiểm tra biểu đồ doanh thu theo ngày",
        "Vào tab 'Báo cáo' → Xem top performers",
        "Test xuất Excel (nút Download)",
      ],
      expected: "Báo cáo hiển thị chính xác, biểu đồ cập nhật theo dữ liệu",
    },
  ]

  const testData = [
    {
      category: "Nhân viên THỢ CHÍNH",
      samples: [
        "Level TARGET: 170M/tháng → HH 13% dịch vụ, 13% tẩy, 16% cắt",
        "Level VƯỢT TARGET: 220M/tháng → HH 15% dịch vụ, 15% tẩy, 18% cắt",
      ],
    },
    {
      category: "Nhân viên THỢ PHỤ",
      samples: [
        "Level 3: 60M/tháng → HH 7% dịch vụ, 10% SP, 15% facial",
        "TARGET: 130M/tháng → HH 9.5% dịch vụ, 12% SP, 20% facial",
      ],
    },
    {
      category: "Nhân viên NAIL",
      samples: ["TIÊU CHUẨN: 23M/tháng → HH 20%", "TARGET: 29M/tháng → HH 24%"],
    },
    {
      category: "Nhân viên RELAX",
      samples: ["TARGET: 35M/tháng → HH 30%", "VƯỢT TARGET: 50M/tháng → HH 36%"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hướng dẫn Test hệ thống
          </CardTitle>
          <CardDescription>Các bước test để kiểm tra tính năng của hệ thống lương salon</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scenarios">Kịch bản Test</TabsTrigger>
              <TabsTrigger value="data">Dữ liệu mẫu</TabsTrigger>
              <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-4">
              {testScenarios.map((scenario, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {scenario.icon}
                      {scenario.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Các bước thực hiện:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                          {scenario.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Kết quả mong đợi:</strong> {scenario.expected}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              {testData.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.samples.map((sample, sampleIndex) => (
                        <div key={sampleIndex} className="flex items-center gap-2">
                          <Badge variant="outline">Ví dụ {sampleIndex + 1}</Badge>
                          <span className="text-sm">{sample}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Dùng tab "Test Data" để tạo dữ liệu nhanh</p>
                    <p className="text-sm">• Tạo 5-10 nhân viên trước, sau đó tạo dữ liệu lương</p>
                    <p className="text-sm">• Kiểm tra từng tab một cách có hệ thống</p>
                    <p className="text-sm">• Xuất dữ liệu test để backup</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lưu ý quan trọng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Dữ liệu chỉ lưu trong session hiện tại</p>
                    <p className="text-sm">• Refresh trang sẽ reset về dữ liệu mặc định</p>
                    <p className="text-sm">• KPI khác nhau cho từng nhóm nhân viên</p>
                    <p className="text-sm">• Phạt KPI: 2% (thợ cũ) vs 4% (thợ mới)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kiểm tra tính năng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">✅ Tính level tự động theo doanh thu</p>
                    <p className="text-sm">✅ Hoa hồng đa dạng theo nhóm nhân viên</p>
                    <p className="text-sm">✅ KPI tracking và penalty</p>
                    <p className="text-sm">✅ Báo cáo và biểu đồ</p>
                    <p className="text-sm">✅ Hoa hồng hàng ngày</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Debug & Troubleshoot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Mở Developer Tools (F12) để xem console</p>
                    <p className="text-sm">• Kiểm tra Network tab khi có lỗi</p>
                    <p className="text-sm">• Reset dữ liệu nếu có vấn đề</p>
                    <p className="text-sm">• Thử với dữ liệu nhỏ trước</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
