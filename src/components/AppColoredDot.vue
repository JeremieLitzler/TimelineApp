<script setup lang="ts">
const {
  hexColor = '#86efac',
  height = '1.5rem',
  width = '1.5rem',
} = defineProps<{
  /**
   * Color of the dot in the #000000 format
   */
  hexColor: string | null | undefined
  /**
   * Height of the dot as a valid CSS value (number) and unit (px, em, rem, etc)
   */
  height?: string
  /**
   * Width of the dot as a valid CSS value (number) and unit (px, em, rem, etc)
   */
  width?: string
}>()
</script>
<template>
  <div
    class="rounded-xl"
    :style="`height: ${height}; width: ${width}; background-color:${hexColor}`"
  ></div>
</template>

<style scoped></style>
