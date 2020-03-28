<template>
  <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
</template>

<script>
  import {getMusicList} from "../../api/rank.js";
  import {getMusicSource} from "../../api/song.js";

  import {createSong} from "../../common/js/song.js";

  import MusicList from "../../components/content/music-list/music-list.vue";

  import {mapGetters} from "vuex";

  export default {
    name: "top-list",
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    components: {
      MusicList
    },
    created() {
      if(!this.topList.id) {
        return this.$router.push("/rank");
      }
      this._getMusicList();
    },
    methods: {
      _getMusicList() {
        getMusicList(this.topList.id).then(list => {
          console.log(list);
          const songs = this._normalizeSongs(list.songlist);
          this._getMusicSource(songs);
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          ret.push(createSong(item.data));
        });
        return ret;
      },
      _getMusicSource(songs) {
        getMusicSource(songs).then(res => {
          this.songs = res;
          console.log(this.songs);
        })
      }
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if(this.songs.length) {
          return this.songs[0].image;
        }
      },
      ...mapGetters([
        "topList"
      ])
    }

  }
</script>

<style scoped>

</style>