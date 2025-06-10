import { z } from 'zod';

export const wordsQuerySchema = z.object({
  english: z.string().optional(),
  arabic: z.string().optional(),
  part_of_speech: z.string().optional(),
  frequency: z.enum(['VERY_FREQUENT', 'FREQUENT', 'COMMON', 'UNCOMMON', 'RARE', 'NOT_DEFINED'] as const).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional()
}); 

export default wordsQuerySchema;