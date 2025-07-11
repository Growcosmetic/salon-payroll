"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertCircle, FileText, Database } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export default function ExcelImportExport() {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importMessage, setImportMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setSelectedFile(file)
        setImportMessage("")
      } else {
        toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)")
        setSelectedFile(null)
      }
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file Excel")
      return
    }

    setIsImporting(true)
    setImportMessage("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/employees/import", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setImportMessage(`✅ ${result.message}`)
        toast.success(result.message)
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
        
        // Dispatch custom event to refresh employee list
        window.dispatchEvent(new CustomEvent("employees-imported"))
      } else {
        setImportMessage(`❌ ${result.error}`)
        toast.error(result.error)
      }
    } catch (error) {
      setImportMessage("❌ Lỗi khi import file")
      toast.error("Lỗi khi import file")
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const response = await fetch("/api/employees/export")
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "danh-sach-nhan-vien.xlsx"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Export thành công!")
      } else {
        toast.error("Lỗi khi export file")
      }
    } catch (error) {
      toast.error("Lỗi khi export file")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <FileSpreadsheet className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Import/Export Excel
          </h2>
          <p className="text-gray-600 mt-2">
            Quản lý dữ liệu nhân viên thông qua file Excel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-blue-700">Import từ Excel</CardTitle>
            <CardDescription>
              Nhập danh sách nhân viên từ file Excel vào hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Chọn file Excel</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Định dạng file yêu cầu:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>• Họ tên</div>
                  <div>• Mã NV</div>
                  <div>• Chức vụ</div>
                  <div>• Bộ phận</div>
                  <div>• Nhóm</div>
                  <div>• Level</div>
                  <div>• Lương cơ bản</div>
                  <div>• Phụ cấp</div>
                  <div>• Nhân viên mới</div>
                </div>
              </div>
            </div>

            {selectedFile && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  File đã chọn: <strong>{selectedFile.name}</strong>
                </AlertDescription>
              </Alert>
            )}

            {importMessage && (
              <Alert className={importMessage.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {importMessage.includes("✅") ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={importMessage.includes("✅") ? "text-green-800" : "text-red-800"}>
                  {importMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleImport} 
              disabled={!selectedFile || isImporting}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
            >
              {isImporting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang import...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Excel
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="border-2 border-dashed border-purple-200 hover:border-purple-300 transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-purple-700">Export ra Excel</CardTitle>
            <CardDescription>
              Xuất toàn bộ danh sách nhân viên ra file Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Thông tin export:
              </h4>
              <div className="space-y-2 text-sm text-purple-700">
                <div>• Tất cả nhân viên đang hoạt động</div>
                <div>• Thông tin chi tiết: tên, mã, chức vụ, lương...</div>
                <div>• Định dạng Excel (.xlsx) chuẩn</div>
                <div>• Tự động download về máy</div>
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              variant="outline"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 border-0"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang export...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Excel
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Lưu ý khi sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Đảm bảo file Excel có đúng định dạng cột như yêu cầu</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Dữ liệu sẽ được thêm vào hệ thống, không ghi đè</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Export sẽ bao gồm tất cả nhân viên đang hoạt động</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>File Excel có thể được chỉnh sửa và import lại</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 