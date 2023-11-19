<script setup lang="ts">
import { useData } from "vitepress";
const { frontmatter: fm } = useData();
</script>

<template>
    <div
        v-if="fm.features"
        class="items"
        :style="{
            '--item-count': fm.features.length,
        }"
    >
        <div v-for="feature in fm.features" :key="feature.title" class="item">
            <div class="item__icon">
                <img :src="feature.icon" alt="" />
            </div>
            <div>
                <h3 class="item__title">{{ feature.title }}</h3>
                <p>{{ feature.details }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.items {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 960px) {
    .items {
        grid-template-columns: repeat(var(--item-count), 1fr);
    }
}

.item {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 1.5rem;
    border-radius: 1.5rem;
    border: 1px solid var(--vp-c-gray-1);
    gap: 1rem;
}

.item__title {
    font-weight: 600;
    color: var(--vp-c-black);
}

.item__icon {
    padding: 1rem;
    background-color: var(--vp-sidebar-bg-color);
    border-radius: 1rem;
    aspect-ratio: 1;
}

.dark .item__icon > img {
    filter: brightness(1.5);
}
</style>
