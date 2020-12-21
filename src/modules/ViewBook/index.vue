<template>
	<MainLayout :has-dark-theme="false">
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<div v-else>
			<div class="my-8">
				<TextStyle font-type="title-2" justify="center"
					>{{$vuetify.lang.t('$vuetify.FOOTER_BOOK')}}: "{{ getBookById && getBookById.title }}"</TextStyle
				>
				<PdfViewer ebookPdf :pdf-link="pdfLink" />
			</div>
			<div v-if="booksByTopicId.length > 0" class="pa-3">
				<Heading level="h3">{{$vuetify.lang.t('$vuetify.SAME_TOPIC_BOOK')}}</Heading>
				<v-layout wrap>
					<v-flex	xs6	sm6 md3	v-for="(item, j) in booksByTopicId"	:key="j" class="pa-3">
						<div
							@click="clickHandlerEbook(item.id)"
							class="book-topic full-height cursor-pointer"
						>
							<div class="book-topic_image">
								<img 
									v-if="item.previewImage" 
									class="full-width full-height" 
									:src="$utils.combineLinkWithBucket(item.previewImage.link)"	alt	
								/>
								<img v-else	src="https://placehold.it/160x240&text=Book%20cover" alt />
							</div>
							<div class="pa-3">
								<div class="mb-2">
									<TextStyle font-type="subtitle-1">{{
										item.title ? item.title : ''
									}}</TextStyle>
								</div>
								<div>
									<TextStyle font-type="caption-2" variation="subtext">
										{{
											item.authors && item.authors[0]
												? item.authors[0].fullname
												: ''
										}}</TextStyle
									>
								</div>
							</div>
						</div>
					</v-flex>
				</v-layout>
			</div>
		</div>
	</MainLayout>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
import PdfViewer from '@/components/learning/PdfViewer'
import get from 'lodash-es/get'
export default {
	components: {
		MainLayout,
		PdfViewer,
	},
	data() {
		return {
			loading: true,
			pdfLink: '',
		}
	},
	async created() {
		await this.fetchBookById(this.$route.params.id)
		await this.fetchBooks()
		this.loading = false
	},
	methods: {
		...mapActions({
			fetchBookById: 'ebook/fetchBookById',
			fetchBooks: 'ebook/fetchBooks'
		}),
		clickHandlerEbook(id) {
      this.$router.push(`/ebook-detail/${id}`)
    },
	},
	computed: {
		...mapGetters({
			getBookById: 'ebook/getBookById',
			books: 'ebook/getBooks'
		}),
		booksByTopicId() {
      if (this.getBookById && this.getBookById.topics && this.getBookById.topics.length) {
				const topic = this.getBookById.topics[0]
				if (!topic || !topic.id) return []
        return this.books.filter((item) => {
          return (
            item &&
            item.topics &&
            item.topics.length &&
            item.topics[0].id === topic.id &&
            item.id !== this.getBookById.id
          )
        })
      }
      return []
    },
	},
	watch: {
		getBookById: {
			handler(v) {
				if (v) {
					let link = get(v, 'data.resource.origin.link')
					if (link) {
						this.pdfLink =
							link.indexOf('https') > -1
								? link
								: this.$utils.combineLinkWithBucket(link)
					}
				}
			},
		},
	},
}
</script>
<style lang="scss" scoped>
.book-topic {
	border: 1px solid #dddbda;
	border-radius: 4px;
	&_image {
		width: 100%;
		padding-top: 150%;
		position: relative;
	}
	img {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		max-height: 100%;
		z-index: 1;
		object-fit: cover;
		transform: translateX(-50%) translateY(-50%);
	}
	&:hover {
		box-shadow: 0px 4px 8px rgba(9, 30, 66, 0.25);
	}
}
</style>
