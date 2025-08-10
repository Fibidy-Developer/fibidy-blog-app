import { BACKEND_URL } from "@/lib/constants";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const avatar = searchParams.get("avatar");

  if (!accessToken || !userId || !name) {
    return NextResponse.redirect("/?error=Google+OAuth+failed");
  }

  const res = await fetch(`${BACKEND_URL}/auth/verify-token`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    return NextResponse.redirect("/?error=JWT+verification+failed");
  }

  await createSession({
    user: {
      id: userId,
      name,
      avatar: avatar ?? undefined,
    },
    accessToken,
  });

  return redirect("/");
}
