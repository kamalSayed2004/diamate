import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const food = searchParams.get("food");

    if (!food) {
      return NextResponse.json(
        { error: "Missing food parameter" },
        { status: 400 },
      );
    }

    const macrosApiUrl =
      process.env.NEXT_PUBLIC_MACROS_API || "http://127.0.0.1:8000";
    const response = await fetch(
      `${macrosApiUrl}/macros?food=${encodeURIComponent(food)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch macros for ${food}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Macros API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch macros data" },
      { status: 500 },
    );
  }
}
