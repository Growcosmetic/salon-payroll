const XLSX = require('xlsx');

// Sample data
const sampleData = [
  {
    "Họ tên": "Nguyễn Thị Lan",
    "Mã NV": "NV001",
    "Chức vụ": "Thợ chính",
    "Bộ phận": "Styling",
    "Nhóm": "THỢ CHÍNH",
    "Level": "TIÊU CHUẨN",
    "Lương cơ bản": 12000000,
    "Phụ cấp": 500000,
    "Nhân viên mới": "Không"
  },
  {
    "Họ tên": "Trần Văn Minh",
    "Mã NV": "NV002",
    "Chức vụ": "Thợ phụ",
    "Bộ phận": "Styling",
    "Nhóm": "THỢ PHỤ",
    "Level": "THỢ PHỤ LEVEL 3",
    "Lương cơ bản": 0,
    "Phụ cấp": 300000,
    "Nhân viên mới": "Không"
  },
  {
    "Họ tên": "Lê Thị Hoa",
    "Mã NV": "NV003",
    "Chức vụ": "Thợ nail",
    "Bộ phận": "Nail",
    "Nhóm": "NAIL",
    "Level": "TIÊU CHUẨN",
    "Lương cơ bản": 7000000,
    "Phụ cấp": 400000,
    "Nhân viên mới": "Không"
  },
  {
    "Họ tên": "Phạm Thị Mai",
    "Mã NV": "NV004",
    "Chức vụ": "Relax",
    "Bộ phận": "Relax",
    "Nhóm": "RELAX",
    "Level": "THỢ MỚI",
    "Lương cơ bản": 6000000,
    "Phụ cấp": 200000,
    "Nhân viên mới": "Có"
  }
];

// Create workbook
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Set column widths
const columnWidths = [
  { wch: 20 }, // Họ tên
  { wch: 10 }, // Mã NV
  { wch: 15 }, // Chức vụ
  { wch: 15 }, // Bộ phận
  { wch: 12 }, // Nhóm
  { wch: 15 }, // Level
  { wch: 12 }, // Lương cơ bản
  { wch: 12 }, // Phụ cấp
  { wch: 12 }, // Nhân viên mới
];
worksheet["!cols"] = columnWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên");

// Write to file
XLSX.writeFile(workbook, "public/sample-employees.xlsx");

console.log("Sample Excel file created: public/sample-employees.xlsx"); 