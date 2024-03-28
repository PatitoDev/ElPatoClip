import { z } from 'zod';

export type ClipListRequestFilters = z.infer<typeof ClipListRequestFiltersValidator>

export const ClipListRequestFiltersValidator = z.object({
  broadcaster_id: z.string(),
  first: z.number(),
  is_featured: z.boolean(),
  after: z.string(),
  started_at: z.string(),
  ended_at: z.string()
});