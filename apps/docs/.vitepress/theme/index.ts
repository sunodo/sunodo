import DefaultTheme from "vitepress/theme";
import VPHomeHero from "./components/VPHomeHero.vue";
import VPHomeFeatures from "./components/VPHomeFeatures.vue";
import VPHomeCta from "./components/VPHomeCta.vue";
import VPHomeFooter from "./components/VPHomeFooter.vue";

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
