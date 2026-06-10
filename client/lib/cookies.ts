import { cookies } from "next/headers";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export type SessionRecord = Record<string, string>;

export type SessionResponse = {
  status: number;
  message: string;
};

export async function getSession(key: string): Promise<SessionRecord | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(key)?.value;

  if (!value) {
    return null;
  }

  return { [key]: value };
}

export async function setSession(
  name: string,
  data: SessionRecord,
): Promise<SessionResponse> {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  cookieStore.set(name, data[name], {
    expires,
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set("expiresAt", expires.toISOString(), {
    expires,
    httpOnly: true,
    sameSite: "lax",
  });

  return { status: 200, message: "Success" };
}

export async function deleteSession(name: string): Promise<SessionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
  cookieStore.delete("expiresAt");

  return { status: 200, message: "Success" };
}

export async function hasSession(key: string): Promise<boolean> {
  const session = await getSession(key);
  return session !== null;
}
