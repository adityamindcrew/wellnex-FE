import { cookies } from 'next/headers'

export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value
}

export const setToken = async (token: string) => {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export const removeToken = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export const isAuthenticated = async () => {
  return !!(await getToken())
} 