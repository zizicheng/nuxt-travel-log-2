import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);
  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    });
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e: unknown) {
    const code
      = typeof e === "object" && e !== null
        ? (e as any).code ?? (e as any).cause?.code
        : null;

    if (code === "SQLITE_CONSTRAINT") {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug must be unique(the location name is used to generate the slug).",
      });
    }

    throw e;
  }
});
