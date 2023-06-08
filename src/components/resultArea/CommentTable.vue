<template>
  <table class="resultTable table table-auto whitespace-normal table-zebra w-full mobile:table-fixed">
    <!-- head -->
    <thead>
      <tr>
        <th class="!rounded-t-none w-[3rem] !static">序號</th>
        <th class="w-[8rem]">名稱</th>
        <th class="w-[43rem]">留言內容</th>
        <th @click="sort('like_count')" class="cursor-pointer text-center w-[6rem]">喜歡</th>
        <th @click="sort('reply_count')" class="cursor-pointer text-center w-[6rem]">回覆</th>
        <th @click="sort('time')" class="!rounded-t-none cursor-pointer w-[14rem]">留言時間</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(tr, index) in sortTableData" :key="tr.id">
        <tr>
          <td class="text-center">{{ index + 1 }}</td>
          <td class="whitespace-normal break-all"><a :href="tr.author_url" class="text-[#D68927]" target="_blank">{{ tr.name }}</a></td>
          <td class="whitespace-normal hover:underline flex flex-nowrap">
            <a class="youtubeicon" :href="messageURL(tr.comment_id)"
              target="_blank"></a>
            <a :href="messageURL(tr.comment_id)" target="_blank" v-html="tr.comment"></a>
          </td>
          <td class="text-center">
            <div class="likeicon">{{ tr.like_count }}</div>
          </td>
          <td class="text-center">
            <div class="replyicon">{{ tr.reply_count }}</div>
          </td>
          <td>{{ dayjs(tr.time).format('YYYY-MM-DD HH:mm:ss') }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const sortKey = ref('time');
const sortDir = ref(false);
const sortTableData = ref([]);
const datas = computed(()=>{
  if (props.useCompare === true){
    return dataStore.files.find(item=>item.id === dataStore.showFileTable)?.datas;
  }else{
    return props.datas.length > 0 ? props.datas : dataStore.filteredData;
  }
});
const messageURL = computed(()=>{
  return (id) => {
    return `https://www.youtube.com/watch?v=${dataStore.videoDetail.id}&lc=${id}`;
  }
})

const props = defineProps({
  useCompare: {
    type: Boolean,
    default: false,
  },
  datas: {
    type: Array,
    default: ()=>[],
  },
  sort: {
    type: Boolean,
    default: true,
  }
});

const sort = (key) => {
  if (sortKey.value === key){
    sortDir.value = !sortDir.value;
  }else{
    sortKey.value = key;
    sortDir.value = false;
  }
  sortTable();
}
const sortTable = (()=>{
  if (props.sort === true){
    const pureDatas = JSON.parse(JSON.stringify(datas.value));
    callWorker(pureDatas, sortDir.value, sortKey.value);
    worker.onmessage = function (event) {
      sortTableData.value = event.data;
    }
  }else{
    sortTableData.value = datas.value;
  }
});

const callWorker = (datas, dir, key) => {
  worker.postMessage({ datas, dir, key });
}

const code = `(function () {
  self.onmessage = function (event){
    const {datas, dir, key} = event.data;
    const sortResult = datas.sort((a, b) => {
      if (dir){
        return a[key] > b[key] ? 1 : -1;
      }else{
        return a[key] < b[key] ? 1 : -1;
      }
    });
    self.postMessage(sortResult);
  }
})();`;

const createBlobObjectURL = (code: string) => {
  const blob = new Blob([`${code}`], { type: "text/javascript" });        
  const url = URL.createObjectURL(blob); 
  return url;
};

const worker = new Worker(createBlobObjectURL(code));

//watch dataStore.filterChange
watchEffect(()=>{
  if (dataStore.filterChange === true){
    sortTable();
    dataStore.setFilterChange(false);
  }
});

defineExpose({
  sort,
});
</script>

<style lang="scss" scoped>
.youtubeicon{
  width: 28px;
  height: 20px;
  flex-shrink: 0;
  background: url(@/assets/youtube.png) center center no-repeat;
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
}
.likeicon{
  background: #bbedff;
  padding: 0 5px;
  &::before{
    content: '';
    width: 12px;
    height: 12px;
    background: url(@/assets/like.svg) center center no-repeat;
    background-size: contain;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -3px;
  }
}
.replyicon{
  background: #ffbbbb;
  padding: 0 5px;
  &::before{
    content: '';
    width: 12px;
    height: 12px;
    background: url(@/assets/reply.svg) center center no-repeat;
    background-size: contain;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -3px;
  }
}
</style>