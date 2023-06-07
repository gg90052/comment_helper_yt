<template>
  <div class="bg-white p-4 grid grid-cols-4 gap-2">
    <template v-for="(card, index) in dataStore.drawResult" :key="card.id">
      <div v-if="showPrizeTitle(index) && dataStore.prizeList.length > 0" class="col-span-4 text-white bg-blue-500 block py-2">{{ showPrizeTitle(index).title }}：<span class="text-yellow-300 font-bold mx-2">{{showPrizeTitle(index).num}}</span>名</div>
      <div class="card w-full bg-base-100 border shadow-xl text-left">
        <div class="card-body relative">
          <h2 class="card-title whitespace-nowrap">
            <div class="w-12 aspect-square overflow-hidden rounded-full">
              <img :src="card.author_pic" alt="" />
            </div>
            <a :href="card.author_url" target="_blank" class="hover:underline">{{ card.name }}</a>
          </h2>
          <p>
            <a class="text-[#D68927] hover:underline" :href="messageURL(card.comment_id)" target="_blank" v-html="card.comment"></a>
          </p>
          <p class="absolute text-xs right-4 bottom-1">{{ dayjs(card.time).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

const messageURL = computed(()=>{
  return (id) => {
    return `https://www.youtube.com/watch?v=${dataStore.videoDetail.id}&lc=${id}`;
  }
})
const titleArray = computed(()=>{
  const arr = [];
  let count = 0;
  dataStore.prizeList.forEach(item=>{
    const obj = Object.assign({count}, item);
    arr.push(obj);
    count += item.num;
  });
  return arr;
});

const showPrizeTitle = (index) => {
  return titleArray.value.find(item=>item.count === index);
}
</script>