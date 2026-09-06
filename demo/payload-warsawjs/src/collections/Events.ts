import type { CollectionConfig } from 'payload'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Events: CollectionConfig = {
  slug: 'events',
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
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'published'],
    },
  ],
}
