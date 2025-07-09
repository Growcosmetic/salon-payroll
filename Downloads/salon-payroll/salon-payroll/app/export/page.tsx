'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch('/api/export');
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Tạo blob từ response
      const blob = await response.blob();
      
      // Tạo URL để tải xuống
      const url = window.URL.createObjectURL(blob);
      
      // Tạo link tải xuống
      const link = document.createElement('a');
      link.href = url;
      link.download = 'salon-data.xlsx';
      
      // Thêm link vào document và click
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Có lỗi xảy ra khi xuất dữ liệu');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Xuất dữ liệu</CardTitle>
          <CardDescription>
            Xuất toàn bộ dữ liệu hệ thống ra file Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              File Excel sẽ bao gồm 3 sheet:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Nhân viên: Thông tin cơ bản của nhân viên</li>
              <li>Dữ liệu lương: Thông tin lương và doanh thu theo tháng</li>
              <li>Hoa hồng hàng ngày: Chi tiết hoa hồng theo từng dịch vụ</li>
            </ul>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 