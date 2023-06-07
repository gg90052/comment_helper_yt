<template>
  <div class="py-4 px-3 mb-2 mt-4 bg-white shadow border-2 border-t-orange-600">
    <InputArea ref="inputArea" @showLoading="loadingDisplay"></InputArea>
    <LoadingModal :show="showLoading"></LoadingModal>
  </div>
</template>

<script setup lang="ts">

import InputArea from './InputArea.vue';
import LoadingModal from '../LoadingModal.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

const showLoading = ref(false);
const inputArea = ref();


const loadingDisplay = (show: boolean = true) => {
  showLoading.value = show;
}

</script>
<style lang="scss">
.shadow{
  box-shadow: 2px 2px 14px 0px rgba(189,189,189,1);
}
</style>