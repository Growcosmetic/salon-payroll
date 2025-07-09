import { PrismaClient, EmployeeGroup } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@salon.com" },
    update: {},
    create: {
      email: "admin@salon.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Created admin user:", admin.email)

  // Create sample employees
  const employees = [
    {
      name: "Nguyễn Thị Lan",
      code: "NV001",
      position: "Thợ chính",
      department: "Styling",
      employeeGroup: EmployeeGroup.THO_CHINH,
      basicSalary: 12000000,
      allowance: 500000,
      currentLevel: "TIÊU CHUẨN",
    },
    {
      name: "Trần Văn Minh",
      code: "NV002",
      position: "Thợ phụ",
      department: "Styling",
      employeeGroup: EmployeeGroup.THO_PHU,
      basicSalary: 0,
      allowance: 300000,
      currentLevel: "THỢ PHỤ LEVEL 3",
    },
    {
      name: "Lê Thị Hoa",
      code: "NV003",
      position: "Thợ nail",
      department: "Nail",
      employeeGroup: EmployeeGroup.NAIL,
      basicSalary: 7000000,
      allowance: 400000,
      currentLevel: "TIÊU CHUẨN",
    },
    {
      name: "Phạm Thị Mai",
      code: "NV004",
      position: "Relax",
      department: "Relax",
      employeeGroup: EmployeeGroup.RELAX,
      basicSalary: 6000000,
      allowance: 200000,
      currentLevel: "THỢ MỚI",
    },
    {
      name: "Hoàng Văn Nam",
      code: "NV005",
      position: "Thợ chính",
      department: "Styling",
      employeeGroup: EmployeeGroup.THO_CHINH,
      basicSalary: 14000000,
      allowance: 600000,
      currentLevel: "VƯỢT TARGET",
    },
  ]

  for (const employeeData of employees) {
    const employee = await prisma.employee.upsert({
      where: { code: employeeData.code },
      update: {},
      create: employeeData,
    })
    console.log(`✅ Created employee: ${employee.name}`)
  }

  // Create sample payroll data
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

  const allEmployees = await prisma.employee.findMany()

  for (const employee of allEmployees) {
    const payrollData = {
      employeeId: employee.id,
      month: currentMonth,
      dailyRevenue: Math.floor(Math.random() * 5000000) + 1000000,
      monthlyRevenue: Math.floor(Math.random() * 100000000) + 20000000,
      serviceRevenue: Math.floor(Math.random() * 50000000) + 10000000,
      productRevenue: Math.floor(Math.random() * 10000000) + 2000000,
      facialRevenue: employee.employeeGroup === EmployeeGroup.THO_PHU ? Math.floor(Math.random() * 20000000) : 0,
      washingRevenue: employee.employeeGroup === EmployeeGroup.THO_PHU ? Math.floor(Math.random() * 5000000) : 0,
      chemicalRevenue: Math.floor(Math.random() * 8000000),
      bleachingRevenue: Math.floor(Math.random() * 3000000),
      kpiAchieved: Math.random() > 0.3,
      kpiDetails: {
        facial: employee.employeeGroup === EmployeeGroup.THO_PHU ? Math.floor(Math.random() * 8) + 2 : 0,
        products: employee.employeeGroup === EmployeeGroup.THO_PHU ? Math.floor(Math.random() * 4) + 1 : 0,
        keratin: employee.employeeGroup === EmployeeGroup.THO_CHINH ? Math.floor(Math.random() * 8) + 5 : 0,
      },
      bonus: Math.floor(Math.random() * 1000000) + 200000,
      penalty: Math.random() > 0.8 ? Math.floor(Math.random() * 200000) : 0,
      advance: Math.floor(Math.random() * 1500000) + 500000,
      calculatedLevel: employee.currentLevel,
    }

    await prisma.payrollData.upsert({
      where: {
        employeeId_month: {
          employeeId: employee.id,
          month: currentMonth,
        },
      },
      update: {},
      create: payrollData,
    })
  }

  console.log("✅ Created sample payroll data")

  // Create system settings
  const settings = [
    { key: "company_name", value: "Salon Beauty" },
    { key: "company_address", value: "123 Đường ABC, Quận 1, TP.HCM" },
    { key: "company_phone", value: "0123456789" },
    { key: "company_email", value: "info@salon.com" },
    { key: "tax_rate", value: "10" },
    { key: "currency", value: "VND" },
  ]

  for (const setting of settings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log("✅ Created system settings")
  console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
