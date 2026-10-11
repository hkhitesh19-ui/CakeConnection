import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_USERNAMES = [
  'admin@cakeconnection.in',
  'order.cakeconnection@gmail.com',
  'admin'
];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'CakeAdmin@2026#';

    const normalizedUser = (username || '').trim().toLowerCase();
    const isValidUser = VALID_USERNAMES.some(u => u.toLowerCase() === normalizedUser);
    const isValidPass = (password || '').trim() === adminPassword;

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { success: false, error: 'Invalid Admin ID or Password' },
        { status: 401 }
      );
    }

    // Set secure auth cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'authenticated', {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  return NextResponse.json({
    authenticated: isAuthenticated
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}
