<template>
  <div class="w-full max-w-[1280px] my-0 mx-auto">
    <HeaderComponent @pageChange="pageChange" />
    <template v-if="pageStatus === 'home'">
      <MainArea />
      <FetchResults v-if="dataStore.rawData.length > 0" />
      <GoogleAds v-else />
    </template>
    <template v-if="pageStatus === 'import'">
      <ImportUpload />
      <ImportResult v-if="dataStore.rawData.length > 0" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import HeaderComponent from "@/components/Header.vue";
import MainArea from "@/components/mainArea/MainArea.vue";
import FetchResults from "@/components/resultArea/FetchResults.vue";
import ImportUpload from "@/components/import/ImportUpload.vue";
import ImportResult from "@/components/import/ImportResult.vue";
import GoogleAds from "@/components/GoogleAds.vue";
import { useDataStore } from "@/store/modules/data";
const dataStore = useDataStore();
const pageStatus = ref("home");
const pageChange = (page) => {
  pageStatus.value = page;
};
</script>
<style scoped lang="scss"></style>
