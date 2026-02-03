import { z } from 'zod';

// Key-value constant for match statuses (lowercase values)
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// listMatchesQuerySchema: optional limit as a coerced positive integer (max 100)
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// matchIdParamSchema: required id as a coerced positive integer
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ISO 8601 regex (allows fractional seconds and timezone offsets)
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const isoString = z.string().refine((s) => iso8601Regex.test(s), { message: 'Invalid ISO 8601 date string' });

// createMatchSchema
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: isoString,
    endTime: isoString,
    homeScore: z.coerce.number().int().min(0).optional(),
    awayScore: z.coerce.number().int().min(0).optional(),
  })
  .superRefine((value, ctx) => {
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);

    if (Number.isNaN(start)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['startTime'], message: 'startTime is not a valid date' });
      return;
    }

    if (Number.isNaN(end)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'endTime is not a valid date' });
      return;
    }

    if (end <= start) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'endTime must be after startTime' });
    }
  });

// updateScoreSchema: requires homeScore and awayScore as coerced non-negative integers
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});
