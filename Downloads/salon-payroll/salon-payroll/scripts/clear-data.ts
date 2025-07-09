import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang xóa dữ liệu...');
  await prisma.dailyCommissionEntry.deleteMany();
  await prisma.payrollData.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.systemSettings.deleteMany();
  await prisma.auditLog.deleteMany();
  // Không xóa user admin
  console.log('✅ Đã xóa toàn bộ dữ liệu mẫu (trừ tài khoản admin).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 