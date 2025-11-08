import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import AuditLog from "@/models/AuditLog";
import { quantityAdjustmentSchema } from "@/lib/validations";
import mongoose from "mongoose";

// POST /api/items/[id]/adjust - Adjust item quantity
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = quantityAdjustmentSchema.safeParse({
      ...body,
      itemId: id,
    });

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const { delta, reason } = validatedData.data;
    const oldQuantity = item.quantity;
    const newQuantity = oldQuantity + delta;

    // Prevent negative quantities
    if (newQuantity < 0) {
      return NextResponse.json(
        { error: "Adjustment would result in negative quantity" },
        { status: 400 }
      );
    }

    // Update quantity
    item.quantity = newQuantity;
    await item.save();

    // Create audit log
    await AuditLog.create({
      itemId: item._id,
      itemName: item.name,
      action: "quantity_adjust",
      userId,
      userName: "User",
      changes: {
        oldValue: oldQuantity,
        newValue: newQuantity,
        delta,
        reason: reason || undefined,
      },
    });

    return NextResponse.json({
      item,
      adjustment: {
        oldQuantity,
        newQuantity,
        delta,
      },
    });
  } catch (error) {
    console.error("Error adjusting quantity:", error);
    return NextResponse.json({ error: "Failed to adjust quantity" }, { status: 500 });
  }
}
