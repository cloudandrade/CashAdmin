import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validations";
import {
  SESSION_COOKIE_NAME,
  sessionCookieMaxAgeSec,
  signSessionToken,
} from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    const token = await signSessionToken(user._id.toString());

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionCookieMaxAgeSec(),
    });

    return NextResponse.json({
      ok: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível entrar" },
      { status: 500 }
    );
  }
}
