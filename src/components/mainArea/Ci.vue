<template>
  <div class="shrink">
    <div class="ci w-[250px] h-[225px] mb-4 mx-auto">
      <img class="w-full h-full" src="../../assets/ci.png" alt="" />
    </div>

    <!-- <a
      class="btn btn-sm border-none block w-48 mt-4 mx-auto bg-red-600 text-white"
      target="_blank"
      href="https://www.youtube.com/channel/UCNLxbtdTe-fFl8uDUS6tMcw?sub_confirmation=1"
      >訂閱我的 Youtube 頻道</a
    > -->
    <div class="w-full mx-auto text-center">
      <p class="text-red-400 mb-4">麻煩幫忙按個訂閱，感謝你</p>
      <div class="mx-auto" id="yt-button-container-render"></div>
    </div>
    <a
      href="https://www.facebook.com/commenthelper"
      class="block text-center mt-4 hover:underline hover:underline-offset-2 text-blue-500"
      >如有任何問題<br />請至粉絲團私訊給管理員詢問</a
    >
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  var container = document.getElementById("yt-button-container-render");
  var options = {
    channelid: "UCNLxbtdTe-fFl8uDUS6tMcw",
    layout: "full",
    count: "default",
  };
  gapi.ytsubscribe.render(container, options);
});
</script>
