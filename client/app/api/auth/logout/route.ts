import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"),
  );
}
