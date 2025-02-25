<script setup lang="ts">
import { StoreCacheKey } from '@/types/StoreCacheKeys'

type CacheType = {
  name: string
  key: string | StoreCacheKey
}
const caches = [
  { name: 'Profiles', key: StoreCacheKey.AllProfiles },
  { name: 'Projects', key: StoreCacheKey.AllProjects },
]

const profileStore = useProfileStore()
const entityStore = useProjectsStore()

const purge = (cache: CacheType) => {
  console.info('purge', cache)

  if (cache.key === StoreCacheKey.AllProfiles) {
    console.info('purge>match', cache.key)
    profileStore.clearCache()
  }
  if (cache.key === StoreCacheKey.AllProjects) {
    console.info('purge>match', cache.key)
    entityStore.clearCache()
  }
}
</script>
<template>
  <Button v-for="cache in caches" :key="cache.key" @click="purge(cache)" class="mr-4"
    >Invalidate {{ cache.name }}</Button
  >
</template>

<style scoped></style>
