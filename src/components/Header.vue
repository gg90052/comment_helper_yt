<template>
  <header class="w-full text-white text-3xl text-left relative mobile:text-center">
    <div class="block cursor-pointer bg-[#db4437] pl-12 py-3 font-bold mobile:pl-0">Youtube 留言抽籤小助手</div>
    <a href="#" @click.prevent="change('import')" class="absolute right-2 bottom-2 text-xs mobile:hidden">v060151640</a>
  </header>
</template>
<script lang="ts" setup>
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const emit = defineEmits(['pageChange']);
const change = (page) => {
  dataStore.$reset();
  emit('pageChange', page);
}
</script>
