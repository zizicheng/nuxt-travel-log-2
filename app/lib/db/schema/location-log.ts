import type z from "zod";

import { int, real, snakeCase, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-orm/zod";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "~/lib/zod-schema";

import { user } from "./auth";
import { location } from "./location";

export const locationLog = snakeCase.table("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: "custom",
      message: "Start Date must be before End Date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: "custom",
      message: "End Date must be after Start Date",
      path: ["endedAt"],
    });
  }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;
