<template>
  <n-space
    vertical
    :size="24"
    class="w-full max-w-[80rem] min-h-screen mx-auto px-4 py-16"
  >
    <!-- Title Skeleton -->
    <div class="md:px-0">
      <n-skeleton text height="36px" width="300px" class="mx-auto lg:mx-0" />
    </div>

    <!-- Steps Skeleton -->
    <n-space vertical>
      <n-skeleton text height="60px" />
      <div class="flex justify-between mt-4">
        <n-skeleton circle size="large" />
        <n-skeleton circle size="large" />
        <n-skeleton circle size="large" />
        <n-skeleton circle size="large" />
      </div>
    </n-space>

    <!-- Form Content Skeleton -->
    <n-card>
      <n-space vertical :size="24">
        <!-- Form Header -->
        <n-skeleton text height="24px" width="200px" />

        <!-- Form Fields -->
        <n-grid cols="1 s:2" :x-gap="24" :y-gap="24">
          <n-grid-item>
            <n-skeleton height="40px" />
          </n-grid-item>
          <n-grid-item>
            <n-skeleton height="40px" />
          </n-grid-item>
          <n-grid-item>
            <n-skeleton height="40px" />
          </n-grid-item>
          <n-grid-item>
            <n-skeleton height="40px" />
          </n-grid-item>
        </n-grid>

        <!-- Textarea-like Skeleton -->
        <n-skeleton height="100px" />

        <!-- Button Skeleton -->
        <div class="flex justify-end">
          <n-skeleton height="40px" width="120px" />
        </div>
      </n-space>
    </n-card>
  </n-space>
</template>
<script setup lang="ts"></script>
<style scoped></style>
