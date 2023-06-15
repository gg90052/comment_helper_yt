import { defineStore } from 'pinia';
import { store } from '@/store';

export const useDataStore = defineStore({
  id: 'app-user',
  state: () => ({
    rawData: [],
    filteredData: [],
    postData: {},
    command: '',
    drawResult: [],
    prizeList: [],
    showPrize: false,
    files: [],
    showFileTable: -1 as unknown as number,
    logged: false,
    userFbName: '',
    userFbId: '',
    needPaid: false,
    accessToken: '',
    postType: '',
    compareAnd: true,
    filterChange: false,
    videoDetail: {},
    commentCount: 0,
    liveVideo: false,
    getCommentTime: new Date(),
  }),
  getters: {},
  actions: {
    setPostData(data){
      this.postData = data;
    },
    setCommand(command){
      this.command = command;
    },
    setRawData(data) {
      this.rawData = data;
    },
    setFilterData(data) {
      this.filteredData = data;
    },
    setDrawResult(data) {
      this.drawResult = data;
    },
    setPrizeList(data) {
      this.prizeList = data;
      this.drawResult = [];
    },
    setPrizeShow(data) {
      this.showPrize = data;
    },
    setFiles(data) {
      this.files = data;
    },
    setFileTarget(data) {
      this.showFileTable = data;
    },
    setUser(data) {
      this.userFbId = data.id;
      this.userFbName = data.name;
    },
    setLoginStatus(status) {
      this.logged = status;
    },
    setNeedPay(status) {
      this.needPaid = status;
    },
    setToken(token) {
      this.accessToken = token;
    },
    setType(type) {
      this.postType = type;
    },
    setCompareAnd(status) {
      this.compareAnd = status;
    },
    setFilterChange(status) {
      this.filterChange = status;
    },
    setData(data, key: string){
      this[key] = data;
    },
  },
});

// Need to be used outside the setup
export function useDataStoreWithOut() {
  return useDataStore(store);
}