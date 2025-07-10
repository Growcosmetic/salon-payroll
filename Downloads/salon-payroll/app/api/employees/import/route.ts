import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const employees = data.map((row: any) => {
      // Map Vietnamese group names to enum values
      const groupMapping: { [key: string]: "THO_PHU" | "THO_CHINH" | "RELAX" | "NAIL" } = {
        "THỢ PHỤ": "THO_PHU",
        "THỢ CHÍNH": "THO_CHINH", 
        "RELAX": "RELAX",
        "NAIL": "NAIL"
      }
      
      const rawGroup = row["Nhóm"] || row["Employee Group"] || "THỢ PHỤ"
      const employeeGroup = groupMapping[rawGroup] || "THO_PHU"
      
      return {
        name: row["Họ tên"] || row["Name"] || "",
        code: row["Mã NV"] || row["Code"] || "",
        position: row["Chức vụ"] || row["Position"] || "",
        department: row["Bộ phận"] || row["Department"] || "",
        employeeGroup,
        currentLevel: row["Level"] || row["Current Level"] || "THỢ MỚI",
        basicSalary: Number(row["Lương cơ bản"]) || Number(row["Basic Salary"]) || 0,
        allowance: Number(row["Phụ cấp"]) || Number(row["Allowance"]) || 0,
        isNewEmployee: row["Nhân viên mới"] === "Có" || row["Is New Employee"] === "Yes" || false,
        isActive: true,
      }
    })

    // Lưu vào database
    const createdEmployees = await prisma.employee.createMany({
      data: employees,
      skipDuplicates: true,
    })

    return NextResponse.json({
      message: `Import thành công ${createdEmployees.count} nhân viên`,
      count: createdEmployees.count,
    })
  } catch (error) {
    console.error("Error importing employees:", error)
    return NextResponse.json(
      { error: "Lỗi khi import file Excel" },
      { status: 500 }
    )
  }
} 