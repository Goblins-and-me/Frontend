import { NextResponse } from 'next/server'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return NextResponse.json(
          { error: 'Invalid credentials.' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Something went wrong.' },
        { status: 500 }
      )
    }

    throw error
  }
}
