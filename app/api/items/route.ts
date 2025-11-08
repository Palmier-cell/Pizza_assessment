import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import AuditLog from "@/models/AuditLog";
import { itemSchema, searchParamsSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const validatedParams = searchParamsSchema.safeParse({
      search: search || undefined,
      category: category || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: validatedParams.error.issues },
        { status: 400 }
      );
    }

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;


    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  
    const [items, total] = await Promise.all([
      Item.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Item.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

 
    const existingItem = await Item.findOne({ name: validatedData.data.name });
    if (existingItem) {
      return NextResponse.json(
        { error: "An item with this name already exists" },
        { status: 409 }
      );
    }

 
    const item = await Item.create({
      ...validatedData.data,
      createdBy: userId,
    });


    await AuditLog.create({
      itemId: item._id,
      itemName: item.name,
      action: "create",
      userId,
      userName: "User", 
      changes: {
        newValue: `Created with quantity: ${item.quantity}`,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
