<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<TeacherDetail
			v-else
			:onlineCourses="onlineCourses"
			:offlineCourses="offlineCourses"
			:books="books"
			:teacher-profile="{
				fullname: teacher.fullname,
				title: teacher.email,
				avatar: avatarLink,
				description: teacher.description,
			}"
			@onRedirectToOnlineCourse="redirectToOnlineCourse"
			@onRedirectToOfflineCourse="redirectToOfflineCourse"
			@onRedirectToBook="redirectToBook"
			@onRequestBuyOnlineCourse="requestOnlineCourse"
			:owned-online-course-ids="ownedOnlineCourseIds"
		/>
	</MainLayout>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout'
export default {
	components: {
		MainLayout,
	},
	data() {
		return {
			loading: false,
			ownedOnlineCourseIds: []
		}
	},
	async created() {
		await this.refresh()
	},
	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
			userPermissions: 'userPermission/getUserPermissions',
			isAuthenticated: 'auth/getAuthenticated',
			getBooks: 'ebook/getBooks',
			teacher: 'teacher/getTeacher',
			onlineCourses: 'onlineCourse/getCourses',
			offlineCourses: 'offlineCourse/getCourses'
		}),
		books() {
			return this.getBooks.map((book)=>{
				return {
					...book,
					previewImage:
						book.previewImage && typeof book.previewImage === 'object'
							? this.$utils.wrapperLinkImage(book.previewImage)
							: undefined,
				}
			})
		},
		avatarLink() {
			if (this.teacher.avatar) {
				const avatar = this.$utils.wrapperLinkImage(this.teacher.avatar)
				return avatar.link
			} else return null
		},
	},
	methods: {
		...mapActions({
			addCourseToCart: 'cart/addToCart',
			fetchUserPermissions: 'userPermission/fetchUserPermissions',
			fetchBooks: 'ebook/fetchBooks',
			fetchTeacher: 'teacher/fetchTeacher',
			fetchOnlineCourse: 'onlineCourse/fetchCourses',
			fetchOfflineCourse: 'offlineCourse/fetchCourses'
		}),
		redirectToOnlineCourse(id) {
			this.$router.push(`/course-online-detail/${id}`)
		},
		redirectToOfflineCourse(id) {
			this.$router.push(`/course-offline/${id}`)
		},
		redirectToBook(id) {
			this.$router.push(`/ebook-detail/${id}`)
		},
		requestOnlineCourse(item) {
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
		async refresh() {
			this.loading = true
			await this.fetchTeacher(this.$route.params.id)
			await this.fetchOnlineCourse({
				status: 'published',
				authors: this.$route.params.id,
			})
			await this.fetchOfflineCourse({
				status: 'published',
				authors: this.$route.params.id
			})
			await this.fetchBooks({
				authors: this.$route.params.id
			})
			if (this.isAuthenticated) {
				await this.fetchUserPermissions(this.authUser.id)
				this.ownedOnlineCourseIds = this.userPermissions.map(val => val.id)
			}
			this.loading = false
		}
	},
	watch: {
		isAuthenticated: {
			async handler(val) {
				this.loading = true
				if (val) {
					try {
						await this.fetchUserPermissions(this.authUser.id)
						this.ownedOnlineCourseIds = this.userPermissions.map(val => val.id)
						this.loading = false
					} catch (error) {
						this.loading = false
						this.$message.error(error)
					}
				} else {
					this.ownedOnlineCourseIds = []
					setTimeout(() => {
						this.loading = false
					}, 500);
				}
			},
		},
	},
}
</script>