import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const employee = await prisma.employee.update({
      where: { id: params.id },
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
    
    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 