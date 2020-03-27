<template>
  <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script>
  import {mapGetters} from "vuex";

  import {ERR_OK} from "../../api/config.js";
  import {getSingerDetail} from "../../api/singer.js";
  import {getMusicSource} from "../../api/song.js";

  import {createSong} from "../../common/js/song.js";

  import MusicList from "../../components/content/music-list/music-list.vue";

  export default {
    name: "singer-detail",
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        "singer"  // 将getters中的singer取出来使用
      ])
    },
    created() {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail() {  // 根据vuex中的歌手id 获取歌手的详细数据 数据中包含歌手的所有音乐的详细信息 但是没有播放地址
        const singerId = this.singer.id;
        if(!singerId) this.$router.push("/singer");
        getSingerDetail(singerId).then(res => {
          if(res.code === ERR_OK) {
            let songs = this._normalizeSong(res.data.list);  // 调用格式化歌曲数据的方法 把获取到的当前歌手的所有音乐数据传入 返回包含多个对象的数组 对象中是已经格式化好的音乐数据
            this._getMusicSource(songs);  // 由于格式化完毕的数据中没有音乐的播放地址 所以调用该方法 方法中获取songs数组中所有音乐的播放地址 并将播放地址添加到每一个对象中
          }
        })
      },
      _normalizeSong(songList) {  // 格式化所有音乐数据的方法 用于将一些需要用到的数据提取出来 最终形成一个包含多个对象的数据 并将数组返回
        let ret = [];
        songList.forEach(item => {
          let {musicData} = item;
          if(musicData.songid && musicData.albummid) {  // 严谨判断 如果这两项在源数据中不存在 则不处理当前项 因为这两项不存在的话会影响项目正常运行
            ret.push(createSong(musicData));
          }
        });

        return ret;

      },
      _getMusicSource(songs) {
        getMusicSource(songs).then(res => {
          this.songs = res;
          console.log(this.songs);

        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>