"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import/Export Excel
          </CardTitle>
          <CardDescription>
            Import danh sách nhân viên từ file Excel hoặc export ra file Excel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Label htmlFor="file-input" className="text-sm font-medium">
                Import từ Excel
              </Label>
            </div>
            
            <div className="space-y-2">
              <Input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Hỗ trợ file .xlsx và .xls. Các cột cần có: Họ tên, Mã NV, Chức vụ, Bộ phận, Nhóm, Level, Lương cơ bản, Phụ cấp, Nhân viên mới
              </p>
            </div>

            {selectedFile && (
              <Alert>
                <AlertDescription>
                  File đã chọn: <strong>{selectedFile.name}</strong>
                </AlertDescription>
              </Alert>
            )}

            {importMessage && (
              <Alert>
                <AlertDescription>{importMessage}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleImport} 
              disabled={!selectedFile || isImporting}
              className="w-full sm:w-auto"
            >
              {isImporting ? "Đang import..." : "Import Excel"}
            </Button>
          </div>

          <div className="border-t pt-4" />

          {/* Export Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <Label className="text-sm font-medium">
                Export ra Excel
              </Label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Export toàn bộ danh sách nhân viên đang hoạt động ra file Excel
            </p>

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isExporting ? "Đang export..." : "Export Excel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 