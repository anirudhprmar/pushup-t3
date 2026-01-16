import "server-only";

import { cache } from "react";
import { createCaller } from "~/server/api/root";
import { db } from "~/server/db";

/**
 * Static API caller for use in generateStaticParams and generateMetadata
 * during static generation (SSG/ISR) where headers() is not available.
 * 
 * This bypasses authentication since SEO pages are public.
 */
const createStaticContext = cache(async () => {
  return {
    db,
    session: null,
    headers: new Headers(),
  };
});

/**
 * Static API caller - use this in generateStaticParams and generateMetadata
 * DO NOT use this for authenticated operations
 */
export const staticApi = createCaller(createStaticContext);
