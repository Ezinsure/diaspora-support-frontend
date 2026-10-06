// src/app/api/contact/route.ts  →  POST /api/contact   (npm install zod)
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(7).max(25).regex(/^[+\d\s()-]+$/, "Invalid phone number"),
  service: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(1500),
  company: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }

  // A bot filled the hidden field: pretend it worked, do nothing
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const { company: _honeypot, ...contactRequest } = parsed.data;

  // TODO: deliver the request to your team, for example:
  //  - send an email with Resend / your SMTP provider
  //  - save it to your database or forward it to your backend API
  // Until then it is only logged on the server.
  console.info("New contact request:", { ...contactRequest, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}