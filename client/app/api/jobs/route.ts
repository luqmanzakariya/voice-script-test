import { postAssignJobServer, getJobsServer } from "@/service/server/jobs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const response = await postAssignJobServer(payload);

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (_) {
    return NextResponse.json({ message: "failed update job" }, { status: 401 });
  }
}

export async function GET() {
  try {
    const response = await getJobsServer();
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: "failed get data job" },
      { status: 401 },
    );
  }
}
