import { getFirms } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const firms = await getFirms();
        return NextResponse.json(firms);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch firms" }, { status: 500 });
    }
}
