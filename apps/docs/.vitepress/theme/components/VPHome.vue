<script setup lang="ts"></script>

<template>
    <div class="container">
        <VPHomeHero />
        <VPHomeFeatures />
        <VPHomeCta />
    </div>
    <VPHomeFooter />
    <Content />
</template>

<style scoped>
.container {
    margin: 0 auto;
    max-width: calc(var(--vp-layout-max-width) - 15vw);
    padding: 0px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .container {
        padding: 48px 32px 72px 32px;
    }
}
</style>
