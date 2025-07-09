import { PrismaClient, EmployeeGroup, ServiceType } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

interface EmployeeRow {
  name: string;
  code: string;
  position: string;
  department: string;
  employeeGroup: EmployeeGroup;
  basicSalary: string | number;
  allowance: string | number;
  currentLevel: string;
  isNewEmployee: string | boolean;
  hireDate: string;
}

interface PayrollDataRow {
  employeeCode: string;
  month: string;
  dailyRevenue: string | number;
  monthlyRevenue: string | number;
  serviceRevenue: string | number;
  productRevenue: string | number;
  facialRevenue: string | number;
  washingRevenue: string | number;
  chemicalRevenue: string | number;
  bleachingRevenue: string | number;
  cuttingRevenue: string | number;
  oilTreatmentRevenue: string | number;
  keratinRevenue: string | number;
  spaFootRevenue: string | number;
  nailDesignRevenue: string | number;
  eyebrowThreadingRevenue: string | number;
  kpiAchieved: string | boolean;
  bonus: string | number;
  penalty: string | number;
  advance: string | number;
  calculatedLevel: string;
}

interface DailyCommissionRow {
  employeeCode: string;
  date: string;
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  serviceType: ServiceType;
  quantity: string | number;
  timesPerformed: string | number;
  timesSold: string | number;
  revenueBeforeDiscount: string | number;
  revenueAfterDiscount: string | number;
  commissionAmount: string | number;
}

async function importEmployees(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['Employees'];
  const data = XLSX.utils.sheet_to_json<EmployeeRow>(sheet);

  for (const row of data) {
    try {
      await prisma.employee.create({
        data: {
          name: row.name,
          code: row.code,
          position: row.position,
          department: row.department,
          employeeGroup: row.employeeGroup,
          basicSalary: parseInt(String(row.basicSalary)) || 0,
          allowance: parseInt(String(row.allowance)) || 0,
          currentLevel: row.currentLevel,
          isNewEmployee: String(row.isNewEmployee).toLowerCase() === 'true',
          hireDate: new Date(row.hireDate),
        },
      });
      console.log(`Imported employee: ${row.name}`);
    } catch (error) {
      console.error(`Error importing employee ${row.name}:`, error);
    }
  }
}

async function importPayrollData(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['PayrollData'];
  const data = XLSX.utils.sheet_to_json<PayrollDataRow>(sheet);

  for (const row of data) {
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
      console.log(`Imported payroll data for employee: ${row.employeeCode}`);
    } catch (error) {
      console.error(`Error importing payroll data for ${row.employeeCode}:`, error);
    }
  }
}

async function importDailyCommission(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['DailyCommission'];
  const data = XLSX.utils.sheet_to_json<DailyCommissionRow>(sheet);

  for (const row of data) {
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
          serviceType: row.serviceType,
          quantity: parseInt(String(row.quantity)) || 0,
          timesPerformed: parseInt(String(row.timesPerformed)) || 0,
          timesSold: parseInt(String(row.timesSold)) || 0,
          revenueBeforeDiscount: parseInt(String(row.revenueBeforeDiscount)) || 0,
          revenueAfterDiscount: parseInt(String(row.revenueAfterDiscount)) || 0,
          commissionAmount: parseInt(String(row.commissionAmount)) || 0,
        },
      });
      console.log(`Imported daily commission for employee: ${row.employeeCode}`);
    } catch (error) {
      console.error(`Error importing daily commission for ${row.employeeCode}:`, error);
    }
  }
}

async function main() {
  try {
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Please provide the Excel file path');
      process.exit(1);
    }

    console.log('Starting import...');
    
    // Import employees first
    await importEmployees(filePath);
    
    // Then import payroll data
    await importPayrollData(filePath);
    
    // Finally import daily commission entries
    await importDailyCommission(filePath);

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 