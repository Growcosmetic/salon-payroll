const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Kiểm tra database...')
    
    // Kiểm tra employees
    const employees = await prisma.employee.findMany()
    console.log(`✅ Tìm thấy ${employees.length} nhân viên:`)
    employees.forEach(emp => {
      console.log(`  - ${emp.name} (${emp.code}) - ${emp.position}`)
    })
    
    // Kiểm tra users
    const users = await prisma.user.findMany()
    console.log(`✅ Tìm thấy ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`)
    })
    
    // Kiểm tra payroll data
    const payrollData = await prisma.payrollData.findMany()
    console.log(`✅ Tìm thấy ${payrollData.length} bản ghi payroll data`)
    
    console.log('🎉 Database hoạt động bình thường!')
  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase() 