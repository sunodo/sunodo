import { URL, fileURLToPath } from "node:url";
import type { DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";

const guideSidebar = (): DefaultTheme.SidebarItem[] => {
    return [
        {
            text: "Introduction",
            collapsed: false,
            items: [
                {
                    text: "What is Sunodo?",
                    link: "/guide/introduction/what-is-sunodo",
                },
                {
                    text: "Installing",
                    link: "/guide/introduction/installing",
                },
                {
                    text: "Quick start",
                    link: "/guide/introduction/quick-start",
                },
                {
                    text: "Migrating a Sunodo project",
                    link: "/guide/introduction/migrating",
                },
            ],
        },
        {
            text: "Creating",
            collapsed: false,
            items: [
                {
                    text: "Creating application",
                    link: "/guide/creating/creating-application",
                },
                {
                    text: "Available templates",
                    link: "/guide/creating/available-templates",
                },
                {
                    text: "Creating a new template",
                    link: "/guide/creating/creating-template",
                },
            ],
        },
        {
            text: "Building",
            collapsed: false,
            items: [
                {
                    text: "Building the application",
                    link: "/guide/building/building-application",
                },
                {
                    text: "Target network",
                    link: "/guide/building/target-network",
                },
                {
                    text: "Customizing",
                    link: "/guide/building/customizing",
                },
            ],
        },
        {
            text: "Running",
            collapsed: false,
            items: [
                {
                    text: "Running the application",
                    link: "/guide/running/running-application",
                },
                {
                    text: "Sending inputs",
                    link: "/guide/running/sending-inputs",
                },
            ],
        },
        {
            text: "Deploying",
            collapsed: false,
            items: [
                {
                    text: "Deploying to a public network",
                    link: "/guide/deploying/deploying-application",
                },
                {
                    text: "Self-hosted",
                    link: "/guide/deploying/self-hosted",
                },
                {
                    text: "Using a service provider",
                    link: "/guide/deploying/provider",
                },
                {
                    text: "Supported networks",
                    link: "/guide/deploying/supported-networks",
                },
            ],
        },
        {
            text: "Monitoring",
            collapsed: false,
            items: [
                {
                    text: "Monitoring tools",
                    link: "/guide/monitoring/tools",
                },
            ],
        },
    ];
};

const referenceSidebar = (): DefaultTheme.SidebarItem[] => {
    return [
        {
            text: "Smart Contracts",
            link: "/reference/contracts/",
        },
        {
            text: "CLI",
            link: "/reference/cli/",
        },
        {
            text: "Kubernetes Config",
            link: "/reference/kubernetes/",
        },
    ];
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Sunodo",
    description: "Documentation",
    lastUpdated: true,
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/logo.svg",
        siteTitle: false,
        nav: [
            {
                text: "Guide",
                link: "/guide/introduction/what-is-sunodo",
                activeMatch: "/guide/",
            },
            /*{ text: "Reference", link: "/reference/contracts/" },*/
        ],
        sidebar: {
            "/guide/": guideSidebar(),
            /*"/reference/": referenceSidebar(),*/
        },
        editLink: {
            pattern:
                "https://github.com/sunodo/sunodo/edit/main/apps/docs/:path",
            text: "Edit this page on GitHub",
        },
        socialLinks: [
            { icon: "twitter", link: "https://twitter.com/SunodoProject" },
            { icon: "github", link: "https://github.com/sunodo/sunodo" },
        ],
        search: {
            provider: "algolia",
            options: {
                appId: "A3KGKST4NL",
                apiKey: "4808497d4d3970d37a6c75f58ee1fccf",
                indexName: "sunodo",
            },
        },
    },
    sitemap: {
        hostname: "https://docs.sunodo.io",
    },
    head: [
        ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
        [
            "link",
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
            },
        ],
        ["link", { rel: "preconnect", href: "https://fonts.gstatic.com" }],
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        [
            "script",
            {
                async: "",
                src: "https://www.googletagmanager.com/gtag/js?id=G-WZBKP7577W",
            },
        ],
        [
            "script",
            {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WZBKP7577W');`,
        ],
    ],
    // Custom Home
    vite: {
        resolve: {
            alias: [
                {
                    find: /^.*\/VPHome\.vue$/,
                    replacement: fileURLToPath(
                        new URL(
                            "./theme/components/VPHome.vue",
                            import.meta.url,
                        ),
                    ),
                },
            ],
        },
        build: {
            rollupOptions: {
                external: [
                    "vp-button",
                    fileURLToPath(
                        new URL(
                            "vitepress/dist/client/theme-default/components/vpbutton.vue",
                            import.meta.url,
                        ),
                    ),
                ],
            },
        },
    },
});
