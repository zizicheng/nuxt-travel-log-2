import type { InsertLocationLog } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function findLocationLog(
  id: number,
  userId: number,
) {
  const foundLog = await db.query.locationLog.findFirst({
    where: { id, userId },
  });

  return foundLog;
}

export async function insertLocationLog(
  locationId: number,
  insertable: InsertLocationLog,
  userId: number,
) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();
  return inserted;
}
