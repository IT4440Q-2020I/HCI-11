<template>
  <div>
    <OverlayForVideoAndPDF v-if="!validateTime" :unit="currentLesson" />
    <div
      v-else-if="!validateTimesWatchVideo()"
      class="d-flex justify-center mt-4"
    >
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.EXCEED_VIDEO_WATCHING_TIMES')}}</TextStyle>
    </div>

    <VimeoPlayer
      v-else
      v-show="readyToPlay"
      :link="linkVimeo"
      @ended="handleEndVimeo"
      ref="vimeoPlayer"
    />
  </div>
</template>
<script>
import get from 'lodash-es/get'
import {mapGetters} from 'vuex'
import OverlayForVideoAndPDF from '@/components/learning/Overlay/OverlayForVideoAndPDF'
import VimeoPlayer from '@/components/onlineCourse/VimeoPlayer'
export default {
  components: {
    VimeoPlayer,
    OverlayForVideoAndPDF,
  },
  props: {
    currentLesson: Object,
  },
  data() {
    return {
      readyToPlay: false,
    }
  },
  computed: {
    ...mapGetters({
      conditionWatchVideo: 'vendor/getExceedWatchVideo',
      authuser: 'auth/getAuthUser',
    }),
    validateTime() {
      return this.$utils.validateTimeForLesson(this.currentLesson.settings)
    },
    linkVimeo() {
      return get(this.currentLesson, 'vimeo.origin.link')
    },
  },
  methods: {
    validateTimesWatchVideo() {
      let data = JSON.parse(localStorage.getItem('exceed-times-watch-video'))
      let lesson = get(
        data,
        `${this.authuser.id}.${this.currentLesson.id}`,
        null
      )
      if (
        this.conditionWatchVideo &&
        this.conditionWatchVideo.isCountExceedWatchVideo
      ) {
        const countExceedWatchVideo = this.conditionWatchVideo
          .countExceedWatchVideo
        if (countExceedWatchVideo && lesson && countExceedWatchVideo < lesson) {
          return false
        } else return true
      } else return true
    },
    exceedTimesWatchVideo() {
      if (
        this.conditionWatchVideo &&
        this.conditionWatchVideo.isCountExceedWatchVideo
      ) {
        const authUserId = this.authuser.id
        let data = JSON.parse(localStorage.getItem('exceed-times-watch-video'))
        let payload = data ? data : {}
        let lesson = get(
          payload,
          `${authUserId}.${this.currentLesson.id}`,
          null
        )
        if (lesson) {
          payload[authUserId][this.currentLesson.id]++
        } else {
          payload[authUserId] = {
            ...payload[authUserId],
            [this.currentLesson.id]: 1,
          }
        }
        localStorage.setItem(
          'exceed-times-watch-video',
          JSON.stringify(payload)
        )
      }
    },
    async handleEndVimeo(data) {
      this.exceedTimesWatchVideo()
      await this.$emit('endLesson', {
        duration: data.duration,
        time: data.time,
        isDone: true,
        type: 'vimeo',
      })
      this.$emit('nextLesson')
    },
  },
  watch: {
    currentLesson: {
      handler(lesson) {
        this.readyToPlay = false
        if (lesson) {
          setTimeout(() => {
            this.readyToPlay = true
            if (this.validateTime) this.$emit('showDialogDescription')
          }, 200)
        }
      },
      immediate: true,
    },
  },
}
</script>
