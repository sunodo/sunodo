<script setup lang="ts">
import { useData } from "vitepress";
const { frontmatter: fm } = useData();
import { ref, onMounted, onBeforeUnmount } from "vue";
import { VPButton } from "vitepress/theme";

const cardBg = ref<HTMLElement>();

// move with mouse
const moveBg = (e: MouseEvent) => {
    const cardBgEl = cardBg.value;
    const cardEl = cardBgEl?.parentElement;
    const cardRect = cardEl?.getBoundingClientRect();
    const xMove = e.clientX - cardRect?.left!;
    const yMove = e.clientY - cardRect?.top!;

    if (cardBgEl) {
        cardBgEl.style.setProperty("--x", `${xMove}px`);
        cardBgEl.style.setProperty("--y", `${yMove}px`);
    }
};

onMounted(() => {
    window.addEventListener("mousemove", moveBg);
});

onBeforeUnmount(() => {
    window.removeEventListener("mousemove", moveBg);
});
</script>

<template>
    <div class="card">
        <div class="card-bg" ref="cardBg"></div>
        <div class="card__in">
            <h1 class="card__title">{{ fm.hero.name }}</h1>
            <div class="actions">
                <VPButton
                    v-for="(action, i) in fm.hero.actions"
                    :href="action.link"
                    class="btn"
                    size="big"
                    :text="action.text"
                    :theme="action.theme"
                    :key="i"
                    :class="{
                        'btn--outline': action.theme === 'sponsor',
                    }"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    background-color: var(--vp-c-black);
    color: var(--vp-c-white);
    border-radius: 1.5rem;
    padding: 2rem;
    text-wrap: balance;
    position: relative;
    overflow: hidden;
}

@media (min-width: 640px) {
    .card {
        padding: 3rem;
    }
}

@media (min-width: 640px) {
    .card {
        padding: 4rem;
    }
}

.card__title {
    font-size: var(--font-size-h2);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
    text-wrap: balance;
    max-width: 30ch;
}

.card__in {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2rem;
    position: relative;
    z-index: 1;
}

.card-bg {
    position: absolute;
    width: 50%;
    aspect-ratio: 1;
    background-color: var(--vp-c-brand-2);
    border-radius: 50%;
    left: var(--x);
    top: var(--y);
    transform: translate(-50%, -50%);
    transform-origin: center center;
    filter: blur(100px);
    opacity: 0.25;
    z-index: 0;
}

.actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0.5rem;
}

@media (min-width: 640px) {
    .actions {
        gap: 1rem;
        flex-direction: row;
    }
}

.btn {
    border-radius: 6px !important;
}

.btn--outline {
    border: 1px solid var(--vp-c-brand-2) !important;
    color: var(--vp-c-brand-2) !important;
}
</style>
