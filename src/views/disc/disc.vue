<template>
  <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
</template>

<script>
  import MusicList from "../../components/content/music-list/music-list.vue";

  import {mapGetters} from "vuex";

  import {getSongList} from "../../api/recommend.js";
  import {getMusicSource} from "../../api/song.js";
  import {createSong} from "../../common/js/song.js";

  export default {
    name: "disc",
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    created() {
      if(!this.disc.dissid) {
        this.$router.push("/recommend");
      }
      this._getSongList();
    },
    computed: {
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
      ...mapGetters([
        "disc"
      ])
    },
    methods: {
      _getSongList() {
        getSongList(this.disc.dissid).then(res => {
          if(res.data.code === 0) {
            console.log(res.data.cdlist[0].songlist);
            let songs = this._normalizeSong(res.data.cdlist[0].songlist);
            this._getMusicSource(songs);
          }
        })
      },
      _normalizeSong(songList) {
        let ret = [];
        songList.forEach(item => {
          if(item.songid && item.albummid) {
            ret.push(createSong(item));
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