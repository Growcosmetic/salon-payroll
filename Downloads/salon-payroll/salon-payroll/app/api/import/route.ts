import { NextResponse } from 'next/server';
import { PrismaClient, EmployeeGroup, ServiceType } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Đọc file Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);

    // Import nhân viên
    if (workbook.Sheets['Employees']) {
      const employees = XLSX.utils.sheet_to_json(workbook.Sheets['Employees']);
      for (const row of employees) {
        try {
          await prisma.employee.create({
            data: {
              name: row.name,
              code: row.code,
              position: row.position,
              department: row.department,
              employeeGroup: row.employeeGroup as EmployeeGroup,
              basicSalary: parseInt(String(row.basicSalary)) || 0,
              allowance: parseInt(String(row.allowance)) || 0,
              currentLevel: row.currentLevel,
              isNewEmployee: String(row.isNewEmployee).toLowerCase() === 'true',
              hireDate: new Date(row.hireDate),
            },
          });
        } catch (error) {
          console.error(`Error importing employee ${row.name}:`, error);
        }
      }
    }

    // Import dữ liệu lương
    if (workbook.Sheets['PayrollData']) {
      const payrollData = XLSX.utils.sheet_to_json(workbook.Sheets['PayrollData']);
      for (const row of payrollData) {
        try {
          const employee = await prisma.employee.findFirst({
            where: { code: row.employeeCode },
          });

          if (!employee) {
            console.error(`Employee not found: ${row.employeeCode}`);
            continue;
          }

          await prisma.payrollData.create({
            data: {
              employeeId: employee.id,
              month: row.month,
              dailyRevenue: parseInt(String(row.dailyRevenue)) || 0,
              monthlyRevenue: parseInt(String(row.monthlyRevenue)) || 0,
              serviceRevenue: parseInt(String(row.serviceRevenue)) || 0,
              productRevenue: parseInt(String(row.productRevenue)) || 0,
              facialRevenue: parseInt(String(row.facialRevenue)) || 0,
              washingRevenue: parseInt(String(row.washingRevenue)) || 0,
              chemicalRevenue: parseInt(String(row.chemicalRevenue)) || 0,
              bleachingRevenue: parseInt(String(row.bleachingRevenue)) || 0,
              cuttingRevenue: parseInt(String(row.cuttingRevenue)) || 0,
              oilTreatmentRevenue: parseInt(String(row.oilTreatmentRevenue)) || 0,
              keratinRevenue: parseInt(String(row.keratinRevenue)) || 0,
              spaFootRevenue: parseInt(String(row.spaFootRevenue)) || 0,
              nailDesignRevenue: parseInt(String(row.nailDesignRevenue)) || 0,
              eyebrowThreadingRevenue: parseInt(String(row.eyebrowThreadingRevenue)) || 0,
              kpiAchieved: String(row.kpiAchieved).toLowerCase() === 'true',
              bonus: parseInt(String(row.bonus)) || 0,
              penalty: parseInt(String(row.penalty)) || 0,
              advance: parseInt(String(row.advance)) || 0,
              calculatedLevel: row.calculatedLevel,
            },
          });
        } catch (error) {
          console.error(`Error importing payroll data for ${row.employeeCode}:`, error);
        }
      }
    }

    // Import hoa hồng hàng ngày
    if (workbook.Sheets['DailyCommission']) {
      const dailyCommissions = XLSX.utils.sheet_to_json(workbook.Sheets['DailyCommission']);
      for (const row of dailyCommissions) {
        try {
          const employee = await prisma.employee.findFirst({
            where: { code: row.employeeCode },
          });

          if (!employee) {
            console.error(`Employee not found: ${row.employeeCode}`);
            continue;
          }

          await prisma.dailyCommissionEntry.create({
            data: {
              employeeId: employee.id,
              date: new Date(row.date),
              serviceCode: row.serviceCode,
              serviceName: row.serviceName,
              serviceGroup: row.serviceGroup,
              serviceType: row.serviceType as ServiceType,
              quantity: parseInt(String(row.quantity)) || 0,
              timesPerformed: parseInt(String(row.timesPerformed)) || 0,
              timesSold: parseInt(String(row.timesSold)) || 0,
              revenueBeforeDiscount: parseInt(String(row.revenueBeforeDiscount)) || 0,
              revenueAfterDiscount: parseInt(String(row.revenueAfterDiscount)) || 0,
              commissionAmount: parseInt(String(row.commissionAmount)) || 0,
            },
          });
        } catch (error) {
          console.error(`Error importing daily commission for ${row.employeeCode}:`, error);
        }
      }
    }

    return NextResponse.json({ message: 'Import successful' });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
} 