import { setSession } from "@/lib/cookies";
import { postLoginServer } from "@/service/server/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const response = await postLoginServer(payload);
    const { access_token } = response;

    await setSession("authToken", { authToken: access_token });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 401 });
  }
}
