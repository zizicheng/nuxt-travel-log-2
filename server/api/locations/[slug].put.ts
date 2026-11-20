import { findLocationByName, updateLocationBySlug } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation && existingLocation.slug !== slug) {
    throw createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    });
  }

  return updateLocationBySlug(result.data, slug, event.context.user.id);
});
