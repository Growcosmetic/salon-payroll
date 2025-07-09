import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)

    const payrollData = await prisma.payrollData.findMany({
      where: { month },
      include: {
        employee: true,
      },
      orderBy: {
        employee: {
          code: 'asc'
        }
      }
    })

    return NextResponse.json(payrollData)
  } catch (error) {
    console.error("Error fetching payroll data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const payrollData = await prisma.payrollData.upsert({
      where: {
        employeeId_month: {
          employeeId: data.employeeId,
          month: data.month,
        },
      },
      update: {
        dailyRevenue: data.dailyRevenue || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        serviceRevenue: data.serviceRevenue || 0,
        productRevenue: data.productRevenue || 0,
        facialRevenue: data.facialRevenue || 0,
        washingRevenue: data.washingRevenue || 0,
        chemicalRevenue: data.chemicalRevenue || 0,
        bleachingRevenue: data.bleachingRevenue || 0,
        cuttingRevenue: data.cuttingRevenue || 0,
        oilTreatmentRevenue: data.oilTreatmentRevenue || 0,
        keratinRevenue: data.keratinRevenue || 0,
        spaFootRevenue: data.spaFootRevenue || 0,
        nailDesignRevenue: data.nailDesignRevenue || 0,
        eyebrowThreadingRevenue: data.eyebrowThreadingRevenue || 0,
        kpiAchieved: data.kpiAchieved || false,
        kpiDetails: data.kpiDetails || {},
        bonus: data.bonus || 0,
        penalty: data.penalty || 0,
        advance: data.advance || 0,
        calculatedLevel: data.calculatedLevel || "TIÊU CHUẨN",
      },
      create: {
        employeeId: data.employeeId,
        month: data.month,
        dailyRevenue: data.dailyRevenue || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        serviceRevenue: data.serviceRevenue || 0,
        productRevenue: data.productRevenue || 0,
        facialRevenue: data.facialRevenue || 0,
        washingRevenue: data.washingRevenue || 0,
        chemicalRevenue: data.chemicalRevenue || 0,
        bleachingRevenue: data.bleachingRevenue || 0,
        cuttingRevenue: data.cuttingRevenue || 0,
        oilTreatmentRevenue: data.oilTreatmentRevenue || 0,
        keratinRevenue: data.keratinRevenue || 0,
        spaFootRevenue: data.spaFootRevenue || 0,
        nailDesignRevenue: data.nailDesignRevenue || 0,
        eyebrowThreadingRevenue: data.eyebrowThreadingRevenue || 0,
        kpiAchieved: data.kpiAchieved || false,
        kpiDetails: data.kpiDetails || {},
        bonus: data.bonus || 0,
        penalty: data.penalty || 0,
        advance: data.advance || 0,
        calculatedLevel: data.calculatedLevel || "TIÊU CHUẨN",
      },
    })

    return NextResponse.json(payrollData, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating payroll data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
