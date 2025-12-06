'use client'

import { ThemeProvider } from 'next-themes'

import { Theme } from 'frosted-ui';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme='dark' enableSystem disableTransitionOnChange>
            <Theme>
                {children}
            </Theme>
        </ThemeProvider>
    )
}
