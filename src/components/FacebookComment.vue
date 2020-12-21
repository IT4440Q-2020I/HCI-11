<template>
  <div v-if="isCommentShown">
    <BaseLoading v-if="loading" class="mt-2" color="primary" block />
    <div v-else class="fb-comments mt-6" :data-href="dataUrl" data-numposts="5" data-width="100%" data-lazy="true"></div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  props: {
    isCommentShown: Boolean,
    appId: String,
    url: String,
  },
  computed: {
    dataUrl() {
      if (this.url && this.url.length > 0) {
        return this.url
      }
      return window.location.href
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    this.setFbAppId()
    this.savePathLoadedSeo()
    setTimeout(() => {
      if (window.FB) {
				window.FB.init({
					appId: this.appId,
					status: true,
					xfbml: true,
					version: 'v2.7',
				})
			}
      this.loading = false
    }, 5000)
  },
  methods: {
    ...mapActions({
			changeSeo: 'seo/change',
			savePathLoadedSeo: 'seo/savePathLoadedSeo',
    }),
    setFbAppId() {
      this.changeSeo({metaInfo: {fbAppId: this.appId}})
    },
  }
}
</script>