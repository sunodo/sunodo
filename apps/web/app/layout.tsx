import { MantineProvider } from "@mantine/core";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <MantineProvider defaultColorScheme="dark">
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
