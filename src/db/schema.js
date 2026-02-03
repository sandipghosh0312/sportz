import { pgEnum, pgTable, serial, text, timestamp, integer, json } from 'drizzle-orm/pg-core';

// Enum for match status (DB name: match_status)
export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// Matches table
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatus('status').notNull().default('scheduled'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Commentary table for play-by-play events
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  minute: integer('minute').notNull(),
  sequence: integer('sequence').notNull(),
  period: text('period'),
  eventType: text('event_type'),
  actor: text('actor'),
  team: text('team'),
  message: text('message').notNull(),
  metadata: json('metadata'), // stored as JSON/JSONB
  tags: text('tags').array(), // text[] (tags stored as an array)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

