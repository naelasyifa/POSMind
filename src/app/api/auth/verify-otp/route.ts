import { NextRequest, NextResponse } from 'next/server';
import { initPayload } from '@/payload/initPayload';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const payload = await initPayload();

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent!',
    });
  } catch (error) {
    console.error('[SEND-OTP ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed sending OTP' },
      { status: 500 },
    );
  }
}
