import DefaultTheme from "vitepress/theme";
import VPHomeCta from "./components/VPHomeCta.vue";
import VPHomeFeatures from "./components/VPHomeFeatures.vue";
import VPHomeFooter from "./components/VPHomeFooter.vue";
import VPHomeHero from "./components/VPHomeHero.vue";

import type { Theme } from "vitepress";

import "./custom.css";

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        app.component("VPHomeHero", VPHomeHero);
        app.component("VPHomeFeatures", VPHomeFeatures);
        app.component("VPHomeCta", VPHomeCta);
        app.component("VPHomeFooter", VPHomeFooter);
    },
} satisfies Theme;
