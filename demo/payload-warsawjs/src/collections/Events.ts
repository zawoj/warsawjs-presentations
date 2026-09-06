import { APIError, type CollectionConfig } from 'payload'

import { adminOnly, canUpdateEvents, publicOrAuthenticated } from '@/access/eventAccess'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicOrAuthenticated,
    update: canUpdateEvents,
  },
  admin: {
    defaultColumns: ['title', 'date', 'status'],
    useAsTitle: 'title',
  },
  hooks: {
    beforeChange: [
      ({ data }) => ({
        ...data,
        slug: data.slug || (data.title ? toSlug(data.title) : undefined),
      }),
    ],
  },
  endpoints: [
    {
      path: '/check-in',
      method: 'post',
      handler: async (req) => {
        if (!req.user) throw new APIError('Unauthorized', 401)

        const body = (await req.json?.()) as { eventID?: number | string } | undefined
        if (!body?.eventID) throw new APIError('eventID is required', 400)

        await req.payload.findByID({
          collection: 'events',
          id: body.eventID,
          overrideAccess: false,
          user: req.user,
        })

        return Response.json({
          ok: true,
          eventID: body.eventID,
          userID: req.user.id,
        })
      },
    },
  ],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      admin: {
        components: {
          Cell: '@/components/EventStatusCell#EventStatusCell',
        },
      },
      defaultValue: 'draft',
      options: ['draft', 'published'],
    },
  ],
}
