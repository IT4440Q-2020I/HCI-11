<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<BookList
			v-else
			:filterItems="filterItems"
			@onFilterChanged="onFilterChanged"
			:bookTopics="topics"
			@onRedirectToBook="showEbookDetail"
			@onRequestBuyBook="showEbookDetail"
		/>
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
	async mounted() {
		await this.fetchTopics({type: 'book'})
		await this.fetchBooks()
		this.setFilterEbook()
		this.loading = false
	},
	components: {
		MainLayout,
	},
	data() {
		return {
			topics: [],
			filterItems: [],
			loading: true,
		}
	},
	methods: {
		...mapActions({
			fetchBooks: 'ebook/fetchBooks',
			fetchTopics: 'topic/fetchTopics',
		}),
		showEbookDetail(id) {
			this.$router.push(`/ebook-detail/${id}`)
		},
		async onFilterChanged(filters) {
			const filterItems = filters[0].value
			if (filterItems.length === 0) {
				await this.fetchBooks()
			} else {
				await this.fetchBooks({
					topics_in: filterItems,
				})
			}
			this.setFilterEbook()
		},
		setFilterEbook() {
			this.filterItems = this.getBooks.map((book) => {
				if (book.previewImage) {
					return {
						...book,
						previewImage: this.$utils.wrapperLinkImage(book.previewImage),
					}
				} else return book
			})
		}
	},
	computed: {
		...mapGetters({
			getBooks: 'ebook/getBooks',
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