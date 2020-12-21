<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<OfflineCourseList
			v-else
			:newestItems="newestItems"
			:highlightItems="highlightItems"
			:filterItems="filterItems"
			@onFilterChanged="onFilterChanged"
			:courseTopics="topics"
			@onRedirectToCourse="(id) => showOfflineCourseDetail(id)"
			@onRequestBookCourse="(id) => showOfflineCourseDetail(id)"
		/>
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
	async created() {
		await this.fetchTopics({type: 'offline'})
		await this.fetchOfflineCourses({status: 'published'})
		this.filterItems = this.getCourses
		this.newestItems = this.getCourses.filter((v, index) => index <= 3)
		this.highlightItems = this.getCourses.filter((v, index) => index <= 3)
		this.loading = false
	},
	components: {
		MainLayout,
	},
	data() {
		return {
			newestItems: [],
			highlightItems: [],
			topics: [],
			filterItems: [],
			loading: true,
		}
	},
	methods: {
		...mapActions({
			fetchOfflineCourses: 'offlineCourse/fetchCourses',
			fetchTopics: 'topic/fetchTopics',
		}),
		showOfflineCourseDetail(id) {
			this.$router.push(`/course-offline/${id}`)
		},
		async onFilterChanged(filters) {
			const filterItems = filters[0].value
			if (filterItems.length === 0) {
				await this.fetchOfflineCourses({status: 'published'})
			} else {
				await this.fetchOfflineCourses({
					status: 'published',
					topics_in: filterItems,
				})
			}
			this.filterItems = this.getCourses
		},
		setTopicFilter(topics) {
			let topicFather = topics.filter(topic => !topic.parentId)
			let options = []
			topicFather.forEach(topic => {
				options.push(topic)
				let topicChild = topics.filter(val => val.parentId === topic.id)
				options = options.concat(topicChild)
			});
			this.topics = [
				{
					label: this.$vuetify.lang.t('$vuetify.TOPIC'),
					id: 'topic-1',
					value: [],
					options: topics.map((topic) => {
						return {
							label: topic.title,
							value: topic.id,
						}
					}),
				},
			]
		}
	},
	computed: {
		...mapGetters({
			getCourses: 'offlineCourse/getCourses',
			getTopics: 'topic/getTopics',
		}),
	},
	watch: {
		getTopics: {
			handler(value) {
				if (value) {
					this.setTopicFilter(value)
				}
			},
		},
	},
}
</script>