import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET) as { username: string; jobTitle: string };
      return NextResponse.json({ username: decoded.username, jobTitle: decoded.jobTitle });
    } catch (error) {
      console.error("Error", error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, jobTitle } = await request.json();
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Basic validation
    if (!username || !jobTitle) {
      return NextResponse.json({ error: 'Username and job title are required' }, { status: 400 });
    }

    // Generate new JWT token with updated data
    const token = jwt.sign(
      { username, jobTitle },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with updated cookie
    const response = NextResponse.json({ success: true, message: 'Profile updated successfully' });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}