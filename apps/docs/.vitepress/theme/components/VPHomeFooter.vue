<script setup lang="ts">
import { useData } from "vitepress";
const { frontmatter: fm } = useData();
</script>

<template>
    <footer class="footer">
        <div class="container">
            <div class="footer__in">
                <div class="dark">
                    <img :src="fm.footer.logo" alt="" class="logo" />
                </div>
                <div class="footer-nav">
                    <a
                        v-for="link in fm.footer.navSite"
                        :href="link.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        :key="link.text"
                    >
                        {{ link.text }}
                    </a>
                </div>
                <div class="footer-social">
                    <a
                        v-for="link in fm.footer.navSocial"
                        :href="link.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        :key="link.text"
                    >
                        <span v-html="link.icon"></span>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: var(--vp-c-black);
    color: var(--vp-c-white);
    padding: 3rem;
}
.container {
    margin: 0 auto;
    max-width: calc(var(--vp-layout-max-width) - 15vw);
    padding: 0px 24px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .container {
        padding: 48px 32px;
    }
}

.footer__in {
    display: grid;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .footer__in {
        grid-template-columns: repeat(3, 1fr);
    }
}

.footer-nav {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    font-size: 1rem;
}

.footer-social {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    font-size: 1rem;
}
</style>
