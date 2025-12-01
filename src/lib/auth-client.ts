import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { magicLinkClient } from "better-auth/client/plugins";

import { organizationClient } from "better-auth/client/plugins";
import { env } from "~/env";


export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
       plugins: [
        organizationClient(),
           adminClient(),
           magicLinkClient(),
        ],
})


