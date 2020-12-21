<template>
	<MainLayout :has-dark-theme="false">
		<AffiliateDetect />
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<OfflineCourseDetail
			v-else
			:item="item"
			@onGoToTeacherDetail="(id) => $router.push(`/teacher-detail/${id}`)"
		/>
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import AffiliateDetect from '@/components/AffiliateDetect'
import {mapGetters, mapActions} from 'vuex'
export default {
	async created() {
		await this.fetchOfflineCourse(this.$route.params.id)
		await this.fetchClasses({course: this.$route.params.id})
		this.loading = false
	},
	data() {
		return {
			loading: true,
		}
	},
	components: {
		MainLayout,
		AffiliateDetect,
	},
	methods: {
		...mapActions({
			fetchOfflineCourse: 'offlineCourse/fetchCourseById',
			fetchClasses: 'offlineClass/fetchClasses',
		}),
	},
	computed: {
		...mapGetters({
			getOfflineCourse: 'offlineCourse/getCourseById',
			getClasses: 'offlineClass/getClasses',
		}),
		item() {
			if (this.getOfflineCourse && this.getClasses) {
				return {
					...this.getOfflineCourse,
					classes: this.getClasses,
					authors: this.getOfflineCourse.authors.map((author) => {
						if (author.avatar) {
							return {
								...author,
								avatar: this.$utils.wrapperLinkImage(author.avatar),
							}
						} else return author
					}),
				}
			} else {
				return null
			}
		},
	},
}
</script>