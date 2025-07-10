import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })

    // Transform data for Excel
    const excelData = employees.map((emp) => ({
      "Họ tên": emp.name,
      "Mã NV": emp.code,
      "Chức vụ": emp.position,
      "Bộ phận": emp.department,
      "Nhóm": emp.employeeGroup === "THO_PHU" ? "THỢ PHỤ" : 
              emp.employeeGroup === "THO_CHINH" ? "THỢ CHÍNH" :
              emp.employeeGroup === "RELAX" ? "RELAX" : "NAIL",
      "Level": emp.currentLevel,
      "Lương cơ bản": emp.basicSalary,
      "Phụ cấp": emp.allowance,
      "Nhân viên mới": emp.isNewEmployee ? "Có" : "Không",
      "Ngày thuê": emp.hireDate.toLocaleDateString("vi-VN"),
    }))

    // Create workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Họ tên
      { wch: 10 }, // Mã NV
      { wch: 15 }, // Chức vụ
      { wch: 15 }, // Bộ phận
      { wch: 12 }, // Nhóm
      { wch: 15 }, // Level
      { wch: 12 }, // Lương cơ bản
      { wch: 12 }, // Phụ cấp
      { wch: 12 }, // Nhân viên mới
      { wch: 15 }, // Ngày thuê
    ]
    worksheet["!cols"] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên")

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Return file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=danh-sach-nhan-vien.xlsx",
      },
    })
  } catch (error) {
    console.error("Error exporting employees:", error)
    return NextResponse.json(
      { error: "Lỗi khi export file Excel" },
      { status: 500 }
    )
  }
} 