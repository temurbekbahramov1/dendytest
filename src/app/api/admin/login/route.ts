import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Check if admin user exists, if not create one
    let adminUser = await db.adminUser.findUnique({
      where: { username },
    })

    if (!adminUser) {
      // Create default admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash("parolyoq", 10)
      adminUser = await db.adminUser.create({
        data: {
          username: "dendyuz",
          password: hashedPassword,
        },
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error during admin login:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}