<template>
	<MainLayout :has-dark-theme="false">
		<AffiliateDetect />
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<BookDetail
			v-else
			:item="getEbook"
			:rates="rateByBook"
			:ratingCount="ratingCount"
			@loadMoreRating="loadMoreRating"
			:ownedByUser="isBought"
			:ratedData="userRate"
			@postRating="onRateCourse"
			@onRedirectToBook="redirectToBook"
			@onRequestBuyBook="BuyBook"
		/>
	</MainLayout>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
import AffiliateDetect from '@/components/AffiliateDetect'
export default {
	components: {
		MainLayout,
		AffiliateDetect,
	},
	data() {
		return {
			loading: true,
			ratingFetchParams: {
				objectId: this.$route.params.id,
				objectType: 'BOOK',
			},
			limit: 0,
			pageNumbe: 0,
			rowperPage: 1,
		}
	},
	async created() {
		await this.initData()
		this.loading = false
	},
	computed: {
		...mapGetters({
			getBookById: 'ebook/getBookById',
			rateByBook: 'rating/rateByCourse',
			ratingCount: 'rating/countRate',
			ratingAverage: 'rating/averageRate',
			userRate: 'rating/currentUserRate',
			isUserSignedIn: 'auth/getAuthenticated',
			userProfile: 'auth/getAuthUser',
			permissionAccessBook: 'userPermission/getPermissionAccessCourse',
		}),
		isBought() {
			if (this.isUserSignedIn) {
				if (this.getBookById.isFree) {
					return true
				} else {
					return !!this.permissionAccessBook.read
				}
			}
			return false
		},
		getEbook() {
			return {
				...this.getBookById,
				authors: this.getBookById.authors.map((author) => {
					return {
						...author,
						avatar: author.avatar ? this.$utils.wrapperLinkImage(author.avatar) : undefined,
					}
				}),
				data: {
					...this.getBookById.data,
					coverImage: this.getBookById.coverImage 
						? this.$utils.wrapperLinkImage(this.getBookById.coverImage)
						: undefined,
				},
				previewImage: this.getBookById.previewImage
					? this.$utils.wrapperLinkImage(this.getBookById.previewImage)
					: undefined,
			}
		},
	},
	methods: {
		...mapActions({
			fetchBookById: 'ebook/fetchBookById',
			rateCourse: 'rating/rateCourse',
			updateRateEbook: 'rating/updateRateCourse',
			fetchRateByEbook: 'rating/fetchRateByCourse',
			fetchCurrentUserRate: 'rating/fetchCurrentUserRate',
			fetchCountRate: 'rating/fetchCountRate',
			fetchAverageRate: 'rating/fetchAverageRate',
			fetchUserCourse: 'userCourse/fetchUserCourse',
			checkPermissionAccessBook: 'userPermission/checkPermissionAccessCourse',
		}),
		async initData() {
			await this.fetchBookById(this.$route.params.id)
			await this.fetchCurrentUserRate(this.ratingFetchParams)
			await this.fetchRatingStatistic()
			await this.loadMoreRating()
		},
		async onRateCourse(stars, content) {
			let status = 'publish'
			if (
				this.getBookById &&
				this.getBookById.data &&
				this.getBookById.data.mustApproveRate
			) {
				status = 'unpublish'
			}
			const rateObject = {
				...this.ratingFetchParams,
				objectName: this.getBookById.title,
				stars,
				content,
				status,
			}
			this.$message.warning(this.$vuetify.lang.t('$vuetify.MESSAGES.SENDING_TO_SERVER'))
			try {
				if (this.userRate && this.userRate.status === 'publish') {
					await this.updateRateEbook({id: this.userRate.id, ...rateObject})
				} else {
					await this.rateCourse(rateObject)
				}
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.RATING_RECEIVED'))
				await this.fetchCurrentUserRate(this.ratingFetchParams)
			} catch {
				this.$message.error(this.$vuetify.lang.t('$vuetify.MESSAGES.SYSTEM_ERROR'))
			}
		},
		fetchRatingStatistic() {
			this.fetchCountRate(this.ratingFetchParams)
			this.fetchAverageRate(this.ratingFetchParams)
		},
		async loadMoreRating() {
			this.limit = (this.pageNumbe + 3) * this.rowperPage
			try {
				await this.fetchRateByEbook({
					...this.ratingFetchParams,
					_limit: this.limit,
					_skip: 0,
				})
				this.pageNumbe += 3
			} catch (error) {
				this.$alert.error(error)
			}
		},
		getAuthentication() {
			if (this.userProfile) {
				this.checkPermissionAccessBook(this.$route.params.id)
			}
		},
		BuyBook() {
			console.log('buy book')
		},
		redirectToBook() {
			console.log('to book')
			this.$router.push(`/view-book/${this.$route.params.id}`)
		},
	},
	watch: {
		userRate: {
			handler(val, oldVal) {
				if (val && oldVal && val.stars !== oldVal.stars) {
					this.fetchRatingStatistic()
				}
			},
		},
		userProfile: {
			handler(val) {
				if (val && val.id) {
					this.fetchCurrentUserRate(this.ratingFetchParams)
					this.getAuthentication()
				}
			},
		},
	},
}
</script>
