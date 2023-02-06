import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
                    {children}
                </NextAppDirEmotionCacheProvider>
            </body>
        </html>
    );
}
