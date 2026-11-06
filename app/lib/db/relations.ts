import { defineRelations } from "drizzle-orm";

import * as schema from "./schema/index"; // Adjust path to your schema exports

export const relations = defineRelations(schema, r => ({
  location: {
    // A location belongs to one user
    user: r.one.user({
      from: r.location.userId,
      to: r.user.id,
    }),
  },
}));
