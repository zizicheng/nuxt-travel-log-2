import { defineRelations } from "drizzle-orm";

import * as schema from "./schema/index";

export const relations = defineRelations(schema, r => ({
  location: {
    // A location has many location logs (One-to-Many)
    locationLogs: r.many.locationLog({
      from: r.location.id,
      to: r.locationLog.locationId,
    }),
  },
  locationLog: {
    // 1. A location log belongs to one location
    location: r.one.location({
      from: r.locationLog.locationId,
      to: r.location.id,
    }),
  },
}));
