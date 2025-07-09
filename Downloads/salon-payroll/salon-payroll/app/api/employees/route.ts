import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        code: data.code,
        position: data.position,
        department: data.department,
        employeeGroup: data.employeeGroup,
        basicSalary: data.basicSalary || 0,
        allowance: data.allowance || 0,
        currentLevel: data.currentLevel,
        isNewEmployee: data.isNewEmployee || false,
      },
    })
    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
