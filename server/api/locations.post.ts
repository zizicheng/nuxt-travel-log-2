import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    throw createError({
      statusCode: 422,
      statusMessage,
      data,
    });
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
