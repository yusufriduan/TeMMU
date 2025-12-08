import { NextResponse } from "next/server";

export async function GET(request, context) {
    const params = await context.params;
    return NextResponse.json({hello: "world", id: params.id});
}