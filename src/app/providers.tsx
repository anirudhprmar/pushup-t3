'use client'

import { ThemeProvider } from 'next-themes'
import { PostHogProvider } from '~/providers/PostHogProvider'
import PostHogPageView from '~/providers/PostHogPageView'

// import { Theme } from 'frosted-ui';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme='dark' enableSystem disableTransitionOnChange>
                {/* <Theme> */}
                    <PostHogPageView />
                    {children}
                {/* </Theme> */}
            </ThemeProvider>
        </PostHogProvider>
    )
}
