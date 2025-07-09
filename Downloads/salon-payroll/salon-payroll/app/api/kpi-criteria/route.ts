import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/kpi-criteria?month=YYYY-MM
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  if (!month) {
    return NextResponse.json({ error: 'Missing month' }, { status: 400 });
  }
  const criteria = await prisma.kpiCriteria.findMany({
    where: { month, isActive: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(criteria);
}

// POST /api/kpi-criteria
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { month, name, targetValue, unit, weight, order } = body;
  if (!month || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const created = await prisma.kpiCriteria.create({
      data: { month, name, targetValue, unit, weight, order },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/kpi-criteria
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  try {
    const updated = await prisma.kpiCriteria.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/kpi-criteria?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  try {
    await prisma.kpiCriteria.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 