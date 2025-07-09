import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const employeeId = searchParams.get("employeeId")

    const where: any = {}
    if (month) where.month = month
    if (employeeId) where.employeeId = employeeId

    const payrollData = await prisma.payrollData.findMany({
      where,
      include: {
        employee: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payrollData)
  } catch (error) {
    console.error("Error fetching payroll data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const payrollData = await prisma.payrollData.upsert({
      where: {
        employeeId_month: {
          employeeId: data.employeeId,
          month: data.month,
        },
      },
      update: {
        dailyRevenue: data.dailyRevenue,
        monthlyRevenue: data.monthlyRevenue,
        serviceRevenue: data.serviceRevenue,
        productRevenue: data.productRevenue,
        facialRevenue: data.facialRevenue || 0,
        washingRevenue: data.washingRevenue || 0,
        chemicalRevenue: data.chemicalRevenue || 0,
        bleachingRevenue: data.bleachingRevenue || 0,
        kpiAchieved: data.kpiAchieved,
        kpiDetails: data.kpiDetails || {},
        bonus: data.bonus || 0,
        penalty: data.penalty || 0,
        advance: data.advance || 0,
        calculatedLevel: data.calculatedLevel,
      },
      create: {
        employeeId: data.employeeId,
        month: data.month,
        dailyRevenue: data.dailyRevenue,
        monthlyRevenue: data.monthlyRevenue,
        serviceRevenue: data.serviceRevenue,
        productRevenue: data.productRevenue,
        facialRevenue: data.facialRevenue || 0,
        washingRevenue: data.washingRevenue || 0,
        chemicalRevenue: data.chemicalRevenue || 0,
        bleachingRevenue: data.bleachingRevenue || 0,
        kpiAchieved: data.kpiAchieved,
        kpiDetails: data.kpiDetails || {},
        bonus: data.bonus || 0,
        penalty: data.penalty || 0,
        advance: data.advance || 0,
        calculatedLevel: data.calculatedLevel,
      },
    })

    return NextResponse.json(payrollData, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating payroll data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
