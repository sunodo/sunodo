<script setup lang="ts">
import { useData } from "vitepress";
const { frontmatter: fm } = useData();
import { VPButton } from "vitepress/theme";
</script>

<template>
    <div class="card">
        <div>
            <h2 v-text="fm.cta.title" class="card__title" />
            <p v-text="fm.cta.details" />
        </div>
        <VPButton
            :href="fm.cta.button.link"
            class="btn"
            size="big"
            :text="fm.cta.button.label"
            :theme="'brand'"
        />
    </div>
</template>

<style scoped>
.card {
    background-color: var(--vp-sidebar-bg-color);
    border-radius: 1.5rem;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

@media (min-width: 640px) {
    .card {
        padding: 3rem;
        text-wrap: balance;
    }
}

.card__title {
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: var(--vp-c-black);
    margin-bottom: 1rem;
    line-height: 1.2;
}

.btn {
    border-radius: 6px !important;
}
</style>
