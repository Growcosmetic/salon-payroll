"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Save } from "lucide-react"

interface KpiCriteria {
  id: string
  month: string
  name: string
  targetValue: number
  unit: string
  weight: number
  order: number
}

export default function KpiCriteriaManager({ selectedMonth }: { selectedMonth: string }) {
  const [criteria, setCriteria] = useState<KpiCriteria[]>([])
  const [loading, setLoading] = useState(false)
  const [newCriteria, setNewCriteria] = useState<Partial<KpiCriteria>>({ name: "", targetValue: 0, unit: "", weight: 1, order: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<KpiCriteria>>({})

  useEffect(() => {
    if (!selectedMonth) return
    setLoading(true)
    fetch(`/api/kpi-criteria?month=${selectedMonth}`)
      .then(res => res.json())
      .then(data => setCriteria(data))
      .finally(() => setLoading(false))
  }, [selectedMonth])

  const handleAdd = async () => {
    if (!newCriteria.name) return
    const res = await fetch("/api/kpi-criteria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCriteria, month: selectedMonth }),
    })
    if (res.ok) {
      const created = await res.json()
      setCriteria([...criteria, created])
      setNewCriteria({ name: "", targetValue: 0, unit: "", weight: 1, order: (criteria.length + 1) })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá tiêu chí này?")) return
    const res = await fetch(`/api/kpi-criteria?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setCriteria(criteria.filter(c => c.id !== id))
    }
  }

  const handleEdit = (c: KpiCriteria) => {
    setEditingId(c.id)
    setEditData({ ...c })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    const res = await fetch("/api/kpi-criteria", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editData, id: editingId }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCriteria(criteria.map(c => (c.id === editingId ? updated : c)))
      setEditingId(null)
      setEditData({})
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tiêu chí KPI tháng {selectedMonth}</CardTitle>
        <CardDescription>Tuỳ chỉnh các tiêu chí KPI áp dụng cho tháng này</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên tiêu chí</TableHead>
              <TableHead>Giá trị mục tiêu</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Trọng số</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((c) => (
              editingId === c.id ? (
                <TableRow key={c.id}>
                  <TableCell><Input value={editData.name || ""} onChange={e => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                  <TableCell><Input type="number" value={editData.targetValue || 0} onChange={e => setEditData({ ...editData, targetValue: Number(e.target.value) })} /></TableCell>
                  <TableCell><Input value={editData.unit || ""} onChange={e => setEditData({ ...editData, unit: e.target.value })} /></TableCell>
                  <TableCell><Input type="number" value={editData.weight || 1} onChange={e => setEditData({ ...editData, weight: Number(e.target.value) })} /></TableCell>
                  <TableCell><Input type="number" value={editData.order || 0} onChange={e => setEditData({ ...editData, order: Number(e.target.value) })} /></TableCell>
                  <TableCell>
                    <Button size="sm" onClick={handleSaveEdit}><Save className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Huỷ</Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.targetValue}</TableCell>
                  <TableCell>{c.unit}</TableCell>
                  <TableCell>{c.weight}</TableCell>
                  <TableCell>{c.order}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Sửa</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              )
            ))}
            <TableRow>
              <TableCell><Input value={newCriteria.name || ""} onChange={e => setNewCriteria({ ...newCriteria, name: e.target.value })} placeholder="Tên tiêu chí" /></TableCell>
              <TableCell><Input type="number" value={newCriteria.targetValue || 0} onChange={e => setNewCriteria({ ...newCriteria, targetValue: Number(e.target.value) })} placeholder="0" /></TableCell>
              <TableCell><Input value={newCriteria.unit || ""} onChange={e => setNewCriteria({ ...newCriteria, unit: e.target.value })} placeholder="Đơn vị" /></TableCell>
              <TableCell><Input type="number" value={newCriteria.weight || 1} onChange={e => setNewCriteria({ ...newCriteria, weight: Number(e.target.value) })} placeholder="1" /></TableCell>
              <TableCell><Input type="number" value={newCriteria.order || criteria.length + 1} onChange={e => setNewCriteria({ ...newCriteria, order: Number(e.target.value) })} placeholder="Thứ tự" /></TableCell>
              <TableCell>
                <Button size="sm" onClick={handleAdd}><Plus className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 