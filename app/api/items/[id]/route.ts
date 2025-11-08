import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import AuditLog from "@/models/AuditLog";
import { itemSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    await dbConnect();

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const validatedData = itemSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();

    const oldItem = await Item.findById(id);

    if (!oldItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const existingItem = await Item.findOne({
      name: validatedData.data.name,
      _id: { $ne: id },
    });

    if (existingItem) {
      return NextResponse.json({ error: "An item with this name already exists" }, { status: 409 });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, validatedData.data, {
      new: true,
      runValidators: true,
    });

    const changes: string[] = [];
    if (oldItem.name !== updatedItem!.name)
      changes.push(`name: ${oldItem.name} → ${updatedItem!.name}`);
    if (oldItem.category !== updatedItem!.category)
      changes.push(`category: ${oldItem.category} → ${updatedItem!.category}`);
    if (oldItem.unit !== updatedItem!.unit)
      changes.push(`unit: ${oldItem.unit} → ${updatedItem!.unit}`);
    if (oldItem.costPrice !== updatedItem!.costPrice)
      changes.push(`cost: $${oldItem.costPrice} → $${updatedItem!.costPrice}`);
    if (oldItem.reorderThreshold !== updatedItem!.reorderThreshold)
      changes.push(`threshold: ${oldItem.reorderThreshold} → ${updatedItem!.reorderThreshold}`);

    if (changes.length > 0) {
      await AuditLog.create({
        itemId: updatedItem!._id,
        itemName: updatedItem!.name,
        action: "update",
        userId,
        userName: "User",
        changes: {
          newValue: changes.join(", "),
        },
      });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
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

    await dbConnect();

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await Item.findByIdAndDelete(id);

    await AuditLog.create({
      itemId: item._id,
      itemName: item.name,
      action: "delete",
      userId,
      userName: "User",
      changes: {
        oldValue: `Deleted item with quantity: ${item.quantity}`,
      },
    });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
