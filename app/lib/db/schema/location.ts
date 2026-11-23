import type { z } from "zod";

import { int, real, snakeCase, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-orm/zod";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schema";

import type { SelectLocationLog } from "./location-log";

import { user } from "./auth";

export const location = snakeCase.table(
  "location",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    lat: real().notNull(),
    long: real().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  t => [
    unique().on(t.name, t.userId),
  ],
);

export const InsertLocation = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocation = z.infer<typeof InsertLocation>;
export type SelectLocation = typeof location.$inferSelect;
export type SelectLocationWithLogs = SelectLocation & {
  locationLogs: SelectLocationLog[];
};
