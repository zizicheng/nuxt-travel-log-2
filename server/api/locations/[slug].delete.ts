import { removeLocationBySlug } from "~/lib/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;

  const deleted = await removeLocationBySlug(slug, event.context.user.id);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    });
  }

  setResponseStatus(event, 204);
});
