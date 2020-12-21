<template>
	<MainLayout :has-dark-theme="false">
		<AffiliateDetect />
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<OnlineCourseDetail
			v-else
			:item="detailCourseInfo"
			:rates="rateByCourse"
			@loadMoreRating="loadMoreRating"
			@onRedirectToCourse="goToLearningPage"
			@onRequestBuyCourse="addToCart"
			@onGoToTeacherDetail="(id) => $router.push(`/teacher-detail/${id}`)"
			:ownedByUser="isBought"
			:ratedData="userRate"
			:realLearnerCount="0"
			@postRating="onRateCourse"
		>
			<template slot="facebook-comment-embed">
				<FacebookComment
					:isCommentShown="isFacebookCommentShown"
					:appId="facebookCommentAppId"
				/>
			</template>
		</OnlineCourseDetail>
	</MainLayout>
</template>

<script>
import {get, last} from 'lodash-es'
import {mapGetters, mapActions} from 'vuex'
import AffiliateDetect from '@/components/AffiliateDetect'
import MainLayout from '@/templates/layout/MainLayout.vue'
import FacebookComment from '@/components/FacebookComment'
export default {
	components: {
		MainLayout,
		AffiliateDetect,
		FacebookComment,
	},
	data() {
		return {
			loading: true,
			ratingFetchParams: {
				objectId: this.$route.params.id,
				objectType: 'ONLINE_COURSE',
			},
			limit: 0,
			pageNumbe: 0,
			rowperPage: 1,
			detailCourseInfo: {},
		}
	},
	async created() {
		await this.initData()
		this.loading = false
	},
	computed: {
		...mapGetters({
			courseDetail: 'onlineCourse/getCourse',
			getSections: 'section/sections',
			getUnitsBySectionId: 'unit/getUnitsBySectionId',
			rateByCourse: 'rating/rateByCourse',
			ratingCount: 'rating/countRate',
			ratingAverage: 'rating/averageRate',
			userRate: 'rating/currentUserRate',
			isUserSignedIn: 'auth/getAuthenticated',
			userProfile: 'auth/getAuthUser',
			permissionAccessCourse: 'userPermission/getPermissionAccessCourse',
			userCourse: 'userCourse/getUserCourse',
		}),
		isBought() {
			if (this.isUserSignedIn) {
				if (this.courseDetail.isFree) {
					return true
				} else {
					return !!this.permissionAccessCourse.read
				}
			}
			return false
		},
		getOnlineCourse() {
			return {
				...this.courseDetail,
				syllabus: this.syllabusList,
				meta: {
					...this.courseDetail.meta,
					lessonCount: this.numberUnits,
				},
			}
		},
		syllabusList() {
			if (this.getSections && this.getSections.length) {
				return this.getSections.map((section) => {
					section.type = 'group'
					section.children = this.getUnitsBySectionId(section._id)
					section.children = section.children.map((unit) => {
						unit.type = 'item'
						return unit
					})
					return section
				})
			} else {
				return []
			}
		},
		numberUnits() {
			let numberOfUnits = 0
			this.syllabusList.forEach((syllabus) => {
				numberOfUnits += syllabus.children.length
			})
			return numberOfUnits
		},
		isFacebookCommentShown() {
			return get(this.courseDetail, 'data.isFacebookCommentEmbed', false)
		},
		facebookCommentAppId() {
			return get(this.courseDetail, 'data.facebookCommentAppId', '')
		},
	},
	methods: {
		...mapActions({
			fetchCourseById: 'onlineCourse/fetchCourseById',
			fetchSections: 'section/fetchSections',
			fetchUnits: 'unit/fetchUnits',
			rateCourse: 'rating/rateCourse',
			updateRateCourse: 'rating/updateRateCourse',
			fetchRateByCourse: 'rating/fetchRateByCourse',
			fetchCurrentUserRate: 'rating/fetchCurrentUserRate',
			fetchCountRate: 'rating/fetchCountRate',
			fetchAverageRate: 'rating/fetchAverageRate',
			addCourseToCart: 'cart/addToCart',
			checkPermissionAccessCourse: 'userPermission/checkPermissionAccessCourse',
			fetchUserCourse: 'userCourse/fetchUserCourse',
			enrollUserCourse: 'userCourse/enrollUserCourse',
		}),
		async initData() {
			await this.fetchCourseById(this.$route.params.id)
			await this.fetchSections({course: this.$route.params.id})
			await this.fetchUnits({course: this.$route.params.id})
			this.detailCourseInfo = {
				...this.getOnlineCourse,
				authors: this.getOnlineCourse.authors.map((author) => {
					if (author.avatar) {
						return {
							...author,
							avatar: this.$utils.wrapperLinkImage(author.avatar),
						}
					} else return author
				}),
			}
			await this.fetchCurrentUserRate(this.ratingFetchParams)
			await this.fetchRatingStatistic()
			await this.loadMoreRating()
			if (this.isUserSignedIn)
				await this.checkPermissionAccessCourse(this.$route.params.id)
		},
		async onRateCourse(stars, content) {
			let status = 'publish'
			if (
				this.courseDetail &&
				this.courseDetail.data &&
				this.courseDetail.data.mustApproveRate
			) {
				status = 'unpublish'
			}
			const rateObject = {
				...this.ratingFetchParams,
				objectName: this.courseDetail.title,
				stars,
				content,
				status,
			}
			this.$message.warning(this.$vuetify.lang.t('$vuetify.MESSAGES.SENDING_TO_SERVER'))
			try {
				if (this.userRate && this.userRate.status === 'publish') {
					await this.updateRateCourse({id: this.userRate.id, ...rateObject})
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
		addToCart() {
			if (this.courseDetail.isFree && !this.isUserSignedIn) {
				return this.$authPopup.show('login')
			}
			try {
				this.addCourseToCart(this.courseDetail)
				this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.ADD_TO_CART_SUCCESS'))
			} catch (error) {
				this.$message.error(error)
			}
		},
		async loadMoreRating() {
			this.limit = (this.pageNumbe + 3) * this.rowperPage
			try {
				await this.fetchRateByCourse({
					...this.ratingFetchParams,
					_limit: this.limit,
					_skip: 0,
				})
				this.pageNumbe += 3
			} catch (error) {
				this.$message.error(error)
			}
		},
		getAuthentication() {
			if (this.userProfile) {
				this.fetchUserCourse({
					courseId: this.$route.params.id,
				})
				this.checkPermissionAccessCourse(this.$route.params.id)
			}
		},
		continueLearningUnit() {
			const viewsOfStudent = get(this.userCourse, 'dataDetails.views')
			const courseId = this.courseDetail.id
			let sectionId = ''
			let unitId = ''
			const lastView = last(viewsOfStudent)
			if (lastView) {
				sectionId = lastView.sectionId
				unitId = lastView.unitId
			} else {
				if (this.syllabusList.length === 0) {
					this.$message.warning(this.$vuetify.lang.t('$vuetify.MESSAGES.COURSE_HAS_NO_LESSON'))
					return
				} else {
					const firstLesson = this.syllabusList[0].children[0]
					sectionId = firstLesson ? firstLesson.section : null
					unitId = firstLesson ? firstLesson.id : null
				}
			}
			this.$router.push(
				`/course-online-learning/${courseId}/${sectionId}/${unitId}`
			)
		},
		async goToLearningPage() {
			if (!this.isUserSignedIn) {
				return this.$authPopup.show('login')
			} else {
				this.loading = true
				try {
					await this.enrollUserCourse({courseId: this.courseDetail.id})
					await this.continueLearningUnit()
					this.loading = false
				} catch (error) {
					this.$message.error(error)
				}
			}
		},
		consoleLog() {
			console.log('yo')
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
			handler(val, oldVal) {
				if (val && val.id && !oldVal) {
					this.fetchCurrentUserRate(this.ratingFetchParams)
					this.getAuthentication()
				}
			},
		},
	},
}
</script>
