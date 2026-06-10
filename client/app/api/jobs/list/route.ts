import { getUserReporter, getUserEditor } from "@/service/server/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reporters = await getUserReporter();
    const editors = await getUserEditor();
    return NextResponse.json(
      {
        data: {
          reporters,
          editors,
        },
      },
      { status: 200 },
    );
  } catch (_) {
    return NextResponse.json(
      { message: "failed get data job" },
      { status: 401 },
    );
  }
}
