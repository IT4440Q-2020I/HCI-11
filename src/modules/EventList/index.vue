<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<EventList
			v-else
			:filterItems="filterItems"
			@onFilterChanged="onFilterChanged"
			:eventTopics="topics"
			@onRedirectToEvent="(id) => showEventDetail(id)"
		/>
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
	async created() {
		await this.fetchTopics({type: 'event'})
		await this.fetchEvents()
		this.setFilterEvent()
		this.loading = false
	},
	components: {
		MainLayout,
	},
	data() {
		return {
			loading: true,
			topics: [],
			filterItems: [],
		}
	},
	methods: {
		...mapActions({
			fetchEvents: 'event/fetchEvents',
			fetchTopics: 'topic/fetchTopics',
		}),
		showEventDetail(id) {
			this.$router.push(`/event-detail/${id}`)
		},
		async onFilterChanged(filters) {
			const filterItems = filters && filters[0] ? filters[0].value : undefined
			if (!filterItems || filterItems.length === 0) {
				await this.fetchEvents()
			} else {
				await this.fetchEvents({
					topics_in: filterItems,
				})
			}
			this.setFilterEvent()
		},
		setFilterEvent() {
			if (this.getEvents && this.getEvents.length) {
				this.filterItems = this.getEvents.map((event) => {
					if (event.previewImage) {
						return {
							...event,
							previewImage: this.$utils.wrapperLinkImage(event.previewImage),
						}
					} else return event
				})
			}
		}
	},
	computed: {
		...mapGetters({
			getEvents: 'event/getEvents',
			getTopics: 'topic/getTopics',
		}),
	},
	watch: {
		getTopics: {
			handler(value) {
				if (value) {
					this.topics = [
						{
							label: this.$vuetify.lang.t('$vuetify.TOPIC'),
							id: 'topic-1',
							value: [],
							options: this.getTopics.map((topic) => {
								return {
									label: topic.title,
									value: topic.id,
								}
							}),
						},
					]
				}
			},
		},
	},
}
</script>