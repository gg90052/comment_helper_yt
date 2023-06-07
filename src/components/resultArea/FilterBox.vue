<template>
  <div class="filterBox bg-white border p-4 mb-2">
    <div class="grid grid-cols-[300px_1fr_300px]">
      <div>
        <div class="form-control">
          <label class="label justify-start cursor-pointer">
            <span class="label-text">排除重複留言</span> 
            <input @change="filterAll" type="checkbox" v-model="filterState.removeDuplicate" class="toggle toggle-primary ml-4" checked />
          </label>
        </div>
        <!-- <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">至少要 @ 多少人</span>
          </label>
          <select @change="filterAll" class="select select-bordered select-sm w-8/12" v-model="filterState.hasTag">
            <option :value="0" selected>0人(不需＠)</option>
            <option :value="1">1人</option>
            <option :value="2">2人</option>
            <option :value="3">3人</option>
          </select>
        </div> -->
      </div>
      <div>
        <p class="text-blue-700 text-3xl w-full text-center">篩選區塊</p>
        <div class="w-full flex justify-start items-center mt-10">
          <p>截止時間：</p>
          <datepicker @update:modelValue="onChangeDate" inputFormat="yyyy-MM-dd" class="pl-2 border inline-block" v-model="filterState.endDate" />
          <datepicker @update:modelValue="onChangeTime" inputFormat="HH:mm" minimumView="time" startingView="time" class="pl-2 border inline-block" v-model="filterState.endTime" />
        </div>
      </div>
      <div class="text-center">
        <div class="form-control">
          <label class="input-group input-group-sm">
            <span class="whitespace-nowrap">搜尋名字</span>
            <input @input="searchKeyWord" v-model="filterState.searchName" type="text" class="rounded-none w-full pl-2 border input-bordered max-w-xs" placeholder="搜尋名字"/>
          </label>
        </div>
        <div class="form-control mt-2">
          <label class="input-group input-group-sm">
            <span class="whitespace-nowrap">搜尋留言</span>
            <input @input="searchKeyWord" v-model="filterState.searchComment" type="text" class="rounded-none w-full pl-2 border input-bordered max-w-xs" :placeholder="'搜尋留言'"/>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Datepicker from 'vue3-datepicker'
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

const filterState = reactive({
  searchName: '',
  searchComment: '',
  removeDuplicate: true,
  hasTag: 0,
  filterTime: new Date(),
  endDate: new Date(),
  endTime: new Date(),
  reaction: 'ALL',
});


const onChangeDate = (date) => {
  const d = dayjs(date);
  filterState.endTime = d.endOf('day').toDate();
  filterState.filterTime = d.endOf('day').toDate();
  filterAll();
}
const onChangeTime = (time) => {
  const t = dayjs(time);
  const d = dayjs(filterState.filterTime).set('hour', t.hour()).set('minute', t.minute());
  filterState.filterTime = d.toDate();
  filterAll();
}

const searchKeyWord = debounce(()=>{
  filterAll();
}, 500);

const filterAll = () => {
  let rawData = JSON.parse(JSON.stringify(dataStore.rawData));
  //截止時間、按讚跟分享沒有時間
  rawData = rawData.filter(item=>{
    const d = dayjs(item.time);
    return d.isBefore(filterState.filterTime);
  });
  //搜尋留言
  rawData = rawData.filter(item=>{
    return item.comment.includes(filterState.searchComment);
  });
  //移除重複
  if (filterState.removeDuplicate){
    if (rawData.length > 0 && rawData[0].from){
      rawData = [...new Map(rawData.map((item) => {
        return [item.author_url, item];
      })).values()];
    }else{
      rawData = [...new Map(rawData.map((item) => [item.author_url, item])).values()];
    }
  }
  //搜尋名字
  if (filterState.searchName !== ''){
    rawData = rawData.filter(item=>{
      return item.name.includes(filterState.searchName);
    });
  }
  dataStore.setFilterData(rawData);
  dataStore.setFilterChange(true);
};

onMounted(()=>{
  filterAll();
});

defineExpose({
  filterAll,
})

</script>