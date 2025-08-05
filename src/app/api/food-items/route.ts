import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const foodItems = await db.foodItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json(
      { error: "Failed to fetch food items" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameUz, nameRu, description, price, imageUrl, category, available } = body

    const foodItem = await db.foodItem.create({
      data: {
        nameUz,
        nameRu,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        available: available ?? true,
      },
    })

    return NextResponse.json(foodItem, { status: 201 })
  } catch (error) {
    console.error("Error creating food item:", error)
    return NextResponse.json(
      { error: "Failed to create food item" },
      { status: 500 }
    )
  }
}