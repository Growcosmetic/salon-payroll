import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Lấy dữ liệu nhân viên
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });

    // Lấy dữ liệu lương
    const payrollData = await prisma.payrollData.findMany({
      include: {
        employee: true,
      },
      orderBy: [
        { month: 'desc' },
        { employee: { name: 'asc' } },
      ],
    });

    // Lấy dữ liệu hoa hồng hàng ngày
    const dailyCommissions = await prisma.dailyCommissionEntry.findMany({
      include: {
        employee: true,
      },
      orderBy: [
        { date: 'desc' },
        { employee: { name: 'asc' } },
      ],
    });

    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();

    // Tạo sheet nhân viên
    const employeeSheet = XLSX.utils.json_to_sheet(
      employees.map(emp => ({
        'Mã nhân viên': emp.code,
        'Tên nhân viên': emp.name,
        'Chức vụ': emp.position,
        'Phòng ban': emp.department,
        'Nhóm': emp.employeeGroup,
        'Lương cơ bản': emp.basicSalary,
        'Phụ cấp': emp.allowance,
        'Cấp độ': emp.currentLevel,
        'Nhân viên mới': emp.isNewEmployee ? 'Có' : 'Không',
        'Ngày vào làm': emp.hireDate.toISOString().split('T')[0],
      }))
    );
    XLSX.utils.book_append_sheet(workbook, employeeSheet, 'Nhân viên');

    // Tạo sheet dữ liệu lương
    const payrollSheet = XLSX.utils.json_to_sheet(
      payrollData.map(payroll => ({
        'Mã nhân viên': payroll.employee.code,
        'Tên nhân viên': payroll.employee.name,
        'Tháng': payroll.month,
        'Doanh thu ngày': payroll.dailyRevenue,
        'Doanh thu tháng': payroll.monthlyRevenue,
        'Doanh thu dịch vụ': payroll.serviceRevenue,
        'Doanh thu sản phẩm': payroll.productRevenue,
        'Doanh thu facial': payroll.facialRevenue,
        'Doanh thu gội': payroll.washingRevenue,
        'Doanh thu hóa chất': payroll.chemicalRevenue,
        'Doanh thu tẩy': payroll.bleachingRevenue,
        'Doanh thu cắt': payroll.cuttingRevenue,
        'Doanh thu dầu dưỡng': payroll.oilTreatmentRevenue,
        'Doanh thu keratin': payroll.keratinRevenue,
        'Doanh thu spa chân': payroll.spaFootRevenue,
        'Doanh thu nail': payroll.nailDesignRevenue,
        'Doanh thu cạo lông mày': payroll.eyebrowThreadingRevenue,
        'Đạt KPI': payroll.kpiAchieved ? 'Có' : 'Không',
        'Thưởng': payroll.bonus,
        'Phạt': payroll.penalty,
        'Tạm ứng': payroll.advance,
        'Cấp độ tính toán': payroll.calculatedLevel,
      }))
    );
    XLSX.utils.book_append_sheet(workbook, payrollSheet, 'Dữ liệu lương');

    // Tạo sheet hoa hồng hàng ngày
    const commissionSheet = XLSX.utils.json_to_sheet(
      dailyCommissions.map(commission => ({
        'Mã nhân viên': commission.employee.code,
        'Tên nhân viên': commission.employee.name,
        'Ngày': commission.date.toISOString().split('T')[0],
        'Mã dịch vụ': commission.serviceCode,
        'Tên dịch vụ': commission.serviceName,
        'Nhóm dịch vụ': commission.serviceGroup,
        'Loại dịch vụ': commission.serviceType,
        'Số lượng': commission.quantity,
        'Số lần thực hiện': commission.timesPerformed,
        'Số lần bán': commission.timesSold,
        'Doanh thu trước giảm giá': commission.revenueBeforeDiscount,
        'Doanh thu sau giảm giá': commission.revenueAfterDiscount,
        'Hoa hồng': commission.commissionAmount,
      }))
    );
    XLSX.utils.book_append_sheet(workbook, commissionSheet, 'Hoa hồng hàng ngày');

    // Tạo buffer từ workbook
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Trả về file Excel
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="salon-data.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
} 