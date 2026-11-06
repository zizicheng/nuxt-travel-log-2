import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 5);

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

  const existingLocation = await db.query.location.findFirst({
    where: {
      name: result.data.name,
      userId: event.context.user.id,
    },
  });
  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    });
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: {
      slug,
    },
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await db.query.location.findFirst({
      where: {
        slug: idSlug,
      },
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();

    return created;
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
