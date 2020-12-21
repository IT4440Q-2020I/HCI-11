<template>
	<div></div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
	data() {
		return {
			title: '',
			titleTemplate: '',
			siteName: '',
			faviconLink: '',
			domain: '',
		}
	},
	created() {
		this.runSeo()
	},
	computed: {
		...mapGetters({
			themeData: 'vendor/getThemedata',
		}),
	},
	methods: {
		...mapActions({
			changeSeo: 'seo/change',
			savePathLoadedSeo: 'seo/savePathLoadedSeo',
		}),
		async runSeo() {
			this.setPageTitle()
			await this.setSeoMeta()
			this.savePathLoadedSeo()
		},
		setDataSeo() {
			this.siteName = this.$themeData.siteName
			this.title = this.$route.meta.title || 'Trang học'
			this.titleTemplate = this.siteName ? `${this.siteName} - %s` : null
			this.faviconLink = this.$themeData.logo_url
			this.domain = window.location.hostname
			this.setPageTitle()
			this.setSeoMeta()
			this.savePathLoadedSeo()
		},
		setPageTitle() {
			this.changeSeo({title: this.title, titleTemplate: this.titleTemplate})
		},
		setSeoMeta() {
			const params = {
				metaInfo: {
					domain: this.domain,
					url: this.domain,
					siteName: this.siteName,
					description: this.siteName,
					type: 'video_lecture',
					locale: 'vi_VN',
					image: this.faviconLink || this.$helpers.DEFAULT_IMAGE.logo,
				},
			}
			this.changeSeo(params)
		},
	},
	watch: {
		themeData: {
			handler() {
				this.setDataSeo()
			},
			immediate: true,
		},
	},
}
</script>