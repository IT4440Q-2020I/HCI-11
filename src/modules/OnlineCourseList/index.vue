<template>
	<MainLayout @scrollToFilter="scrollToFilter">
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<OnlineCourseList
			v-else
			:newestItems="newestItems"
			:highlightItems="highlightItems"
			:filterItems="filterItems"
			:courseTopics="topics"
			@onRedirectToCourse="(id) => $router.push(`/course-online-detail/${id}`)"
			@onRequestBuyCourse="requestBuyCourse"
			@onFilterChanged="onFilterChanged"
      :ownedItems="ownedItems"
		/>
	</MainLayout>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
export default {
	components: {
		MainLayout,
	},
	data() {
		return {
			newestItems: [],
			topics: [],
			highlightItems: [],
			filterItems: [],
			loading: true,
      currentTopic: this.$route.query.topic,
      ownedItems: []
		}
	},
	async mounted() {
		await this.init()
		if (this.$route.query.topic) {
			this.scrollToFilter()
		}
	},
	computed: {
		...mapGetters({
      authUser: 'auth/getAuthUser',
			isAuthenticated: 'auth/getAuthenticated',
			userPermissions: 'userPermission/getUserPermissions',
			getCourses: 'onlineCourse/getCourses',
			getTopics: 'topic/getOnlineTopics',
		}),
		topicInHeader() {
			return this.$route.query.topic
		},
	},
	methods: {
		...mapActions({
			fetchCourses: 'onlineCourse/fetchCourses',
      fetchTopics: 'topic/fetchTopics',
      fetchUserPermissions: 'userPermission/fetchUserPermissions',
      addCourseToCart: 'cart/addToCart',
		}),
		setTopicFilter(topicId) {
			let topicFather = this.getTopics.filter(topic => !topic.parentId)
			let options = []
			topicFather.forEach(topic => {
				options.push(topic)
				let topicChild = this.getTopics.filter(val => val.parentId === topic.id)
				options = options.concat(topicChild)
			});
			this.topics = [
				{
					label: this.$vuetify.lang.t('$vuetify.TOPIC'),
					id: 'topic-1',
					value: topicId ? [topicId] : [],
					options: options.map((topic) => {
						return {
							label: topic.title,
							value: topic.id,
						}
					}),
				},
			]
		},
		scrollToFilter() {
			setTimeout(async () => {
				let filterLocation = document.getElementsByClassName('filter-result')[0]
				if (filterLocation) {
					filterLocation.scrollIntoView()
				}
			}, 1000)
		},
		async init() {
			await this.fetchTopics({type: 'online'})
			await this.fetchCourses({status: 'published', _skip: 0, _limit: 4})
			this.newestItems = this.getCourses
			this.highlightItems = this.getCourses
			this.loading = false
		},
		async onFilterChanged(filters) {
			const filterItems = filters[0].value
			if (filterItems.length === 0) {
				await this.fetchCourses({status: 'published'})
			} else {
				await this.fetchCourses({
					status: 'published',
					topics_in: filterItems,
				})
			}
			this.filterItems = this.getCourses
		},
		requestBuyCourse(item) {
      if (item.isFree) {
        this.$router.push(`/course-online-detail/${item.id}`)
      } else {
        try {
          this.addCourseToCart(item)
          this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.ADD_TO_CART_SUCCESS'))
        } catch (error) {
          this.$message.error(error)
        }
      }
    },
	},
	watch: {
    isAuthenticated: {
			async handler(val) {
				this.loading = true
				if (val) {
					try {
            await this.fetchUserPermissions(this.authUser.id)
            this.ownedItems = this.userPermissions.map(val => val.id)
						this.loading = false
					} catch (error) {
						this.loading = false
						this.$message.error(error)
					}
				} else {
          this.ownedItems = []
          setTimeout(() => {
            this.loading = false
          }, 500);
        }
			},
			immediate: true,
		},
		topicInHeader: {
			handler(val) {
				if (val) {
					this.scrollToFilter()
					this.setTopicFilter(val)
					this.onFilterChanged(this.topics)
				}
			},
			immediate: true,
		},
		getTopics: {
			handler(value) {
				if (value) {
					this.setTopicFilter(this.topicInHeader)
					this.onFilterChanged(this.topics)
				}
			},
			immediate: true,
		},
	},
}
</script>
<style>
* {
	scroll-behavior: smooth;
}
</style>