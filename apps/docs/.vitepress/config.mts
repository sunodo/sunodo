import { DefaultTheme, defineConfig } from "vitepress";

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
                    text: "Supported networks",
                    link: "/guide/deploying/supported-networks",
                },
                {
                    text: "Billing system",
                    link: "/guide/deploying/billing",
                },
                {
                    text: "Becoming a Validator",
                    link: "/guide/deploying/validator",
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
    lang: "en-US",
    title: "Sunodo",
    description: "Documentation",
    lastUpdated: true,
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: "Guide",
                link: "/guide/introduction/what-is-sunodo",
                activeMatch: "/guide/",
            },
            { text: "Reference", link: "/reference/contracts/" },
        ],
        sidebar: {
            "/guide/": guideSidebar(),
            "/reference/": referenceSidebar(),
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
});
