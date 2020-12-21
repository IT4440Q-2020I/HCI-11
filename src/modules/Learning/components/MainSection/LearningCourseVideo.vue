<template>
  <Player @ended="endVideo" @log-progress="startWatchVideo" ref="player" />
</template>
<script>
import get from 'lodash-es/get'
import Player from '@/components/onlineCourse/Player'
export default {
  props: {
    currentLesson: Object
  },
  components: {
    Player
  },
  computed: {
    duration() {
      return this.$refs['player'].duration
    },
    time() {
      return this.$refs['player'].currentTime
    }
  },
  methods: {
    async endVideo() {
      await this.$emit('endLesson', {
        duration: this.duration,
        time: this.time,
        isDone: true,
        type: 'video'
      })
      this.$emit('nextLesson')
    },
    startWatchVideo() {
      this.$emit('endLesson', {
        duration: this.duration,
        time: this.time,
        isDone: false,
        type: 'video'
      })
    },
    resetPlayerVideo() {
      if (this.$refs['player'] || this.$refs['player'].player) {
        this.$refs['player'].player.reset()
      }
    },
    updateSourceForPlayer(selectedLesson) {
      const resource = get(selectedLesson, 'resources.0') || {}
      if (!resource.origin.link) {
        this.$message.error(
          this.$vuetify.lang.t('$vuetify.MESSAGES.NOT_FOUND_VIDEO_LINK')
        )
      }
      let sources = []
      const link = resource.origin.link.includes('http')
        ? resource.origin.link
        : this.$utils.combineLinkWithBucket(resource.origin.link)
      sources.push({
        src: this.$utils.convertURL(link) || '',
        type: resource.origin.mimeType || '',
        label: 'Origin',
        res: 0
      })
      this.$refs['player'].player.updateSrc(sources)
    },
    async handleLessonVideo(selectedLesson) {
      setTimeout(() => this.$emit('showDialogDescription'), 200)
      await this.resetPlayerVideo()
      await this.updateSourceForPlayer(selectedLesson)
      this.setupSubtitleForVideo(selectedLesson)
    },
    setupSubtitleForVideo(selectedLesson) {
      if (get(selectedLesson, 'enableSubtitle')) {
        const subtitles = (
          get(selectedLesson, 'resources.0.sources') || []
        ).filter(item => item.type === 'subtitle')
        subtitles.forEach(sub => {
          this.$refs['player'].player.addRemoteTextTrack({
            kind: 'captions',
            src: sub.link,
            srclang: sub.langValue,
            label: sub.lang
            // mode: 'showing'
          })
        })
      }
    }
  },
  watch: {
    currentLesson: {
      handler(lesson) {
        if (lesson) {
          setTimeout(() => this.handleLessonVideo(lesson), 200)
        }
      },
      immediate: true
    }
  }
}
</script>
