import type { Access } from 'payload'

import type { User } from '@/payload-types'

const roleFor = (user: unknown) => (user as User | null)?.role

export const publicOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { status: { equals: 'published' } }

export const adminOnly: Access = ({ req }) => roleFor(req.user) === 'admin'

export const canUpdateEvents: Access = ({ req }) => {
  const role = roleFor(req.user)

  if (role === 'admin') return true
  if (role === 'editor') return { status: { equals: 'draft' } }

  return false
}
