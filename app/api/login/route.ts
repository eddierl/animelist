import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export async function POST(request: NextRequest) {
  try {
    const { username, jobTitle } = await request.json();

    // Basic validation - you might want to add more robust validation
    if (!username || !jobTitle) {
      return NextResponse.json({ error: 'Username and job title are required' }, { status: 400 });
    }

    // Here you would typically validate credentials against a database
    // For now, we'll just accept any username/jobTitle combination

    // Generate JWT token
    const token = jwt.sign(
      { username, jobTitle },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Create response with cookie
    const response = NextResponse.json({ success: true, message: 'Login successful' });

    // Set session cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}