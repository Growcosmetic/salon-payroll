"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function ImportExcelComponent() {
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx")) {
        setError("Vui lòng chọn file Excel (.xlsx)");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel");
      return;
    }
    try {
      setIsImporting(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Có lỗi xảy ra khi import dữ liệu");
      }
      alert("Import dữ liệu thành công!");
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi import dữ liệu");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-primary-foreground
          hover:file:bg-primary/90"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleImport}
        disabled={isImporting || !file}
        className="w-full sm:w-auto"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Đang import..." : "Import dữ liệu"}
      </Button>
    </div>
  );
} 