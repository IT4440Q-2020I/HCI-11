<template>
  <div class='custom-player'>
    <video v-if='canPlay' ref='videoPlayer' controls preload='auto' class='video-js'>
      <!--          <track kind='captions' src='/learn-static/demo.vtt' srclang='vi' label='Tiếng Việt' default>-->
    </video>
    <div v-else>
      <ElementImageLazy
        style='width: 70px; margin-bottom: 20px;'
        data-source='/learn-static/img/warning-open.png'
      />
      <br />
      <TextStyle font-type='title-3' variation='warning'>{{$vuetify.lang.t('$vuetify.NOT_LOADING_VIDEO')}}</TextStyle>
      <br />
      <TextStyle variation='subtext'>{{$vuetify.lang.t('$vuetify.PLEASE_CONTACT_TECHNICAL_SUPPORT')}}</TextStyle>
    </div>

  </div>
</template>

<script>
import videojs from 'video.js'
import '@/assets/lib/videojsResolutionSwitcher/videojs-resolution-switcher.js'
import '@/assets/lib/videojsResolutionSwitcher/videojs-resolution-switcher.css'

const DEFAULT_EVENTS = [
  'loadedmetadata',
  'canplay',
  'canplaythrough',
  'durationchange',
  'volumechange',
  'play',
  'pause',
  'waiting',
  'playing',
  'ended',
  'error',
  'loadstart',
  'progress',
  'suspend',
  'abort',
  'emptied',
  'stalled',
  'loadeddata',
  'waiting',
  'seeking',
  'seeked',
  'ratechange',
  'resize',
  'timeupdate'
]
export default {
  name: 'VideoPlayer',
  props: {
    resolutions: {
      type: Array,
      default () {
        return []
      }
    },
    description: {
      type: String,
      default: '',
    },
    origin: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      player: null,
      duration: 0,
      currentTime: 0,
      canLog: true,
      canPlay: true,
      dialog: false
    }
  },
  computed: {
    timeInterval () {
      let min = 30
      return this.duration / 10 < min ? min : this.duration / 10
    }
  },
  mounted () {
    let vm = this
    this.player = videojs(
      this.$refs.videoPlayer,
      {
        controls: true,
        autoplay: false,
        plugins: {
          videoJsResolutionSwitcher: {
            default: 'low',
            dynamicLabel: true
          }
        }
      },
      function onPlayerReady () {
        let player = this
        vm.bindEventVideoJS(player, DEFAULT_EVENTS)
        player.on('resolutionchange', function () {
          console.info('Source changed to %s', player.src())
        })
      }
    )
  },
  methods: {
    bindEventVideoJS (player, events) {
      events.forEach(event => {
        player.on(event, data => {
          this.$emit(event, data)
          this.handleEvent(event, data)
        })
      })
    },
    handleEvent (event) {
      switch (event) {
        case 'canplay': {
          this.duration = this.player.duration()
          return this.duration
        }
        case 'timeupdate': {
          if (this.canLog) {
            this.$emit('log-progress')
            this.canLog = false
            setTimeout(() => {
              this.canLog = true
            }, this.timeInterval * 1000)
          }
          this.currentTime = this.player.currentTime()
          return this.currentTime
        }
        case 'error': {
          this.canPlay = false
          return this.canPlay
        }
      }
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang='scss' scoped>
$big-play-width: 3em;
$big-play-height: 1.5em;
::v-deep .custom-player {
  .video-js {
    max-height: calc(100vh - 60px - 48px);
    height: calc(100vw * 0.5625);
    width: 100%;
  }
  video {
    max-height: 100%;
  }
  .vjs-big-play-button {
    line-height: $big-play-height;
    height: $big-play-height;
    width: $big-play-width;
    left: 50%;
    top: 50%;
    margin-left: -($big-play-width / 2);
    margin-top: -($big-play-height / 2);
  }
}
</style>
