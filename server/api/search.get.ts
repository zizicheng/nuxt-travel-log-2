import { Buffer } from "node:buffer";
import { ProxyAgent, fetch as undiciFetch } from "undici";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

import defineAuthenticatedEventHandler from "./../utils/define-authenticated-event-handler";
import sendZodError from "./../utils/send-zod-error";

// eslint-disable-next-line node/no-process-env
const proxyAgent = process.env.NUXT_NODE_ENV === "development"
  ? new ProxyAgent("http://127.0.0.1:1080")
  : undefined;

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    // Disable browser HTTP caching
    setResponseHeader(event, "Cache-Control", "no-store");

    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return sendZodError(result.error);
    }

    try {
      const response = await undiciFetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        dispatcher: proxyAgent,
        headers: {
          "User-Agent": "nuxt-travel-log-2 | https://github.com/nuxt-travel-log-2",
        },
      });
      if (!response.ok) {
        throw createError({
          statusCode: 504,
          statusMessage: "Unable to reach search API.",
        });
      }

      const results = await response.json() as NominatimResult[];
      return results;
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: "Unable to reach search API.",
      });
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim-debug",
    getKey: async (event) => {
      const query = await getQuery(event);
      // return query.q?.toString() || "";
      const q = query.q?.toString() || "";
      return Buffer.from(q, "utf-8").toString("hex");
    },
  }),
);
