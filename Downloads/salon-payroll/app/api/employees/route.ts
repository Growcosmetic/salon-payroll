import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Tạm thời bỏ authentication để test
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

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
    // Tạm thời bỏ authentication để test
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

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
