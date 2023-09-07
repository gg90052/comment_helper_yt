<template>
  <div class="flex flex-wrap text-left items-center">
    <Ci class="mobile:w-full mobile:flex-shrink-0" />
    <div
      class="flex-shrink-0 mt-4 whitespace-nowrap ml-8 max-w-[560px] w-full items-stretch mobile:mx-auto"
    >
      <div class="flex w-full">
        <input
          v-model="YT_url"
          type="text"
          class="flex-grow w-full rounded-none input-sm input-bordered border"
          placeholder="請輸入 Youtube 影片網址"
        />
        <input
          v-model="api_key"
          type="text"
          class="rounded-none input-sm input-bordered border"
          placeholder="API金鑰（選填）"
        />
        <button class="btn btn-blue btn-sm flex-shrink-0" @click="getVideoData">
          抓留言
        </button>
      </div>
      <div class="text-red-500 mt-4">
        <p>一般影片請照舊使用，不需輸入 API 金鑰</p>
        <p>直播影片需搭配自己的 API 金鑰，請參考以下連結做申請</p>
        <a
          class="text-blue-500"
          target="_blank"
          href="https://gg90052.github.io/blog/yt_api_key/"
          >https://gg90052.github.io/blog/yt_api_key/</a
        >
      </div>
      <div class="w-full mt-4 p-4 rounded-md border-2">
        <YtVideo :id="YT_ID" class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "@/store/modules/data";
import dayjs, { type Dayjs } from "dayjs";
import Ci from "./Ci.vue";
import YtVideo from "./YtVideo.vue";

interface rawDataType {
  id: string;
  name: string;
  author_url: string;
  author_pic?: string;
  comment: string;
  comment_id: string;
  like_count: number;
  reply_count: number;
  time: Dayjs;
}

const dataStore = useDataStore();
const emit = defineEmits(["fbLogged", "showLoading", "update"]);

const YOUTUBE_API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY;
const YT_url = ref("");
const api_key = ref(localStorage.api_key || "");
const DEFAULT_ID = process.env.VUE_APP_NEW_VIDEO;
const YT_ID = computed(() => {
  return decodeUrl(YT_url.value);
});
let rawData: rawDataType[] = [];
let lastid = "";

const importShare = (shareData) => {
  localStorage.sharedposts = JSON.stringify(shareData);
  alert("匯入完成");
  dataStore.setRawData(shareData);
  dataStore.setNeedPay(true);
};
const importComment = (commentData) => {
  localStorage.commentPosts = JSON.stringify(commentData);
  alert("匯入完成");
  dataStore.setRawData(commentData);
};

const decodeUrl = (url) => {
  if (url.indexOf("watch?v=") > 0) {
    let start = url.indexOf("watch?v=") + 8;
    let end = url.indexOf("&", start) > 0 ? url.indexOf("&") : 1000;
    return url.substring(start, end);
  } else if (url.indexOf("youtu.be/") > 0) {
    let start = url.indexOf("youtu.be/") + 9;
    let end = url.indexOf("?", start) > 0 ? url.indexOf("?") : 1000;
    return url.substring(start, end);
  } else if (url === "") {
    return DEFAULT_ID;
  } else {
    return DEFAULT_ID;
  }
};

const getVideoData = async () => {
  if (YT_url.value === "") {
    alert("請輸入網址");
  } else if (YT_ID.value === DEFAULT_ID) {
    alert("非認可的網址格式");
  } else {
    emit("showLoading");
    rawData = [];
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2CliveStreamingDetails&id=${YT_ID.value}&key=${YOUTUBE_API_KEY}`
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        getComments(res);
        const video = res.items[0];
        gtag("event", "getComment", {
          channelTitle: video.snippet.channelTitle,
          title: video.snippet.title,
          channelID: video.snippet.channelId,
          videoID: video.id,
        });
      });
  }
};

const getComments = (video_data) => {
  dataStore.setData(0, "commentCount");
  dataStore.setData(video_data.items[0], "videoDetail");
  const d = new Date();
  if (video_data.items[0].snippet.liveBroadcastContent == "live") {
    if (api_key.value === "") {
      alert("直播影片請輸入 API 金鑰");
      emit("showLoading", false);
      return false;
    }
    const liveID = video_data.items[0].liveStreamingDetails.activeLiveChatId;
    dataStore.setData(true, "liveVideo");
    d.setDate(d.getDate() + 1);
    dataStore.setData(d, "getCommentTime");
    getLive(liveID).then((res) => {
      for (let i of res) {
        let obj: rawDataType = {
          id: i.id,
          name: i.authorDetails.displayName,
          author_url: i.authorDetails.channelUrl,
          author_pic: i.authorDetails.profileImageUrl,
          comment: i.snippet.displayMessage,
          comment_id: i.id,
          like_count: 0,
          reply_count: 0,
          time: dayjs(i.snippet.publishedAt),
        };
        rawData.push(obj);
      }
      lastid = res[res.length - 1].id;
      dataStore.setData(rawData, "rawData");
      // this.$store.commit('setLoading', false);
      // this.$emit('finish', yt);
      setTimeout(function () {
        keepGet(liveID);
      }, 3000);
      emit("showLoading", false);
    });
  } else {
    dataStore.setData(d, "getCommentTime");
    getNormal(YT_ID.value).then((res) => {
      // console.log(res);
      for (let i of res) {
        let obj: rawDataType = {
          id: i.id,
          name: i.snippet.topLevelComment.snippet.authorDisplayName,
          author_url: i.snippet.topLevelComment.snippet.authorChannelUrl,
          author_pic: i.snippet.topLevelComment.snippet.authorProfileImageUrl,
          comment: i.snippet.topLevelComment.snippet.textDisplay,
          comment_id: i.snippet.topLevelComment.id,
          like_count: i.snippet.topLevelComment.snippet.likeCount,
          reply_count: i.snippet.totalReplyCount,
          time: dayjs(i.snippet.topLevelComment.snippet.publishedAt),
        };
        rawData.push(obj);
      }
      // console.log(rawData);
      dataStore.setData(rawData, "rawData");
      emit("showLoading", false);
    });
  }
};

const getNormal = (id) => {
  return new Promise((resolve, reject) => {
    let datas = [];
    let api_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&order=time&videoId=${id}&key=${YOUTUBE_API_KEY}`;
    let vm = this;

    fetch(api_url)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        for (let d of res.items) {
          if (d.snippet) {
            datas.push(d);
          }
        }
        dataStore.setData(datas.length, "commentCount");
        if (res.items.length > 0 && res.nextPageToken) {
          getNext(`${api_url}&pageToken=${res.nextPageToken}`);
        } else {
          resolve(datas);
        }
      });

    function getNext(url) {
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          for (let d of res.items) {
            if (d.snippet) {
              datas.push(d);
            }
          }
          dataStore.setData(datas.length, "commentCount");
          if (res.items.length > 0 && res.nextPageToken) {
            getNext(`${api_url}&pageToken=${res.nextPageToken}`);
          } else {
            resolve(datas);
          }
        });
    }
  });
};
const getLive = (id) => {
  return new Promise((resolve, reject) => {
    let datas = [];
    let api_url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${id}&maxResults=1000&part=id%2Csnippet%2CauthorDetails&key=${api_key.value}`;

    fetch(api_url)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res.error) {
          alert(res.error.message);
          emit("showLoading", false);
          return false;
        }
        for (let d of res.items) {
          if (d.snippet) {
            datas.push(d);
          }
        }
        localStorage.api_key = api_key.value;
        resolve(datas);
      });
  });
};
const keepGet = (id) => {
  getLive(id).then((res) => {
    let arr = [];
    let counter = res.length - 1;
    while (res[counter].id !== lastid && counter > 0) {
      arr.push(res[counter]);
      counter--;
    }
    if (arr.length > 0) {
      lastid = arr[0].id;
    }
    let datas: rawDataType[] = [];
    for (let i of arr) {
      let obj: rawDataType = {
        id: i.id,
        name: i.authorDetails.displayName,
        author_url: i.authorDetails.channelUrl,
        author_pic: i.authorDetails.profileImageUrl,
        comment: i.snippet.displayMessage,
        comment_id: i.id,
        like_count: 0,
        reply_count: 0,
        time: dayjs(i.snippet.publishedAt),
      };
      datas.push(obj);
    }
    if (datas.length > 0) {
      // rawData = datas.concat(rawData);
      datas.forEach((item) => {
        rawData.push(item);
      });
    }

    dataStore.setData([], "rawData");
    dataStore.setData(rawData, "rawData");

    setTimeout(function () {
      keepGet(id);
    }, 3000);
  });
};

const getPost = (target: any, target_page: any) => {
  post.value = target;
  page.value = target_page;
};

onMounted(() => {
  window.addEventListener("importShare", function (e) {
    importShare(e.detail.data);
  });
  window.addEventListener("importComment", function (e) {
    importComment(e.detail.data);
  });
});

defineExpose({
  getPost,
});
</script>

<style scoped lang="scss">
.preview {
  max-width: 560px;
  width: 560px;
}
</style>
