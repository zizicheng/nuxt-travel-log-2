import { findLocation } from "~/lib/db/queries/location";
import { insertLocationLog } from "~/lib/db/queries/location-log";
import { InsertLocationLog } from "~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    });
  }

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!result.success) {
    return sendZodError(result.error);
  }

  return insertLocationLog(location.id, result.data, event.context.user.id);
});
