<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<MyLearning
			v-if="!loading && authUser"
			:onlineCourses="onlineCourses"
			:user-profile="authUser"
			:certificates="certificates"
			@onRedirectToOnlineCourse="(id) => onRedirectToOnlineCourse(id)"
			@onRedirectToOfflineCourse="(id) => onRedirectToOfflineCourse(id)"
			@onRedirectToOnlineCourseList="$router.push('/course-online')"
			@onRedirectToOfflineCourseList="$router.push('/course-offline')"
			@onRedirectToBook="(id) => onRedirectToBook(id)"
			@onRedirectToEvent="(id) => onRedirectToEvent(id)"
			@onRedirectToCertificate="(item) => onRedirectToCertificate(item)"
			@onDownLoad="(item) => openPopupDownloadCertificate(item)"
		/>
		<Popup ref="certificate-popup">
			<div class="certificate-popup">
				<CertificateDownload :pdf-link="certificateLink" @onDownload="onDownLoadCertificate"/>
			</div>
		</Popup>
	</MainLayout>
</template>

<script>
import CertificateDownload from '@/modules/CertificateDetail/components/CertificateDownload'
import {mapActions, mapGetters} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout'
export default {
	components: {
		MainLayout,
		CertificateDownload
	},
	data() {
		return {
			loading: false,
			certificateLink: ''
		}
	},
	async created() {
		await this.fetchUserCertificates({userId: this.authUser.id})
	},
	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
			isAuthenticated: 'auth/getAuthenticated',
			userPermissions: 'userPermission/getUserPermissions',
			getUserCertificates: 'userCertificate/getUserCertificates'
		}),
		certificates() {
			return this.getUserCertificates.map(v=>{
				return {
					...v,
					title: v.certificationName,
					course: v.course.title
				}
			})
		},
		onlineCourses() {
			return this.userPermissions
				.filter(
					(course) => course.type === 'online' && course.status === 'published'
				)
				.map((course) => {
					const progress = Math.floor(course.progress || 0)
					return {
						...course,
						percent: progress > 100 ? 100 : progress,
					}
				})
		},
	},
	methods: {
		...mapActions({
			fetchUserCertificates: 'userCertificate/fetchUserCertificates',
			fetchUserPermissions: 'userPermission/fetchUserPermissions',
			enrollUserCourse: 'userCourse/enrollUserCourse',
		}),
		async onRedirectToOnlineCourse(courseId) {
			this.loading = true
      await this.enrollUserCourse({ courseId })
      this.$router.push(`/course-online-learning/${courseId}/report/result`)
		},
		onRedirectToOfflineCourse(id) {
			console.log('id', id)
		},
		onRedirectToBook(id) {
			console.log(id)
		},
		onRedirectToEvent(id) {
			console.log(id)
		},
		onRedirectToCertificate(item) {
			this.$router.push(`/certificate-detail/${item.id}`)
		},
		openPopupDownloadCertificate(item) {
			this.certificateLink = item.pdf 
				? `https://izteach-resource-bigdat.s3-ap-southeast-1.amazonaws.com/${item.pdf}`
				: ''
			this.$refs['certificate-popup'].openPopup()
		},
		onDownLoadCertificate() {
			window.open(this.certificateLink, '_blank')
		}
	},
	watch: {
		isAuthenticated: {
			async handler(val) {
				this.loading = true
				if (val) {
					try {
						await this.fetchUserPermissions(this.authUser.id)
						await this.fetchUserCertificates({userId: this.authUser.id})
						this.loading = false
					} catch (error) {
						this.loading = false
						this.$message.error(error)
					}
				}
				this.loading = false
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.certificate-popup {
	width: 750px;
}
@media (max-width: 750px) {
	::v-deep .popup__inner {
		width: 100%;
	}
	.certificate-popup {
		width: 100%;
	}
}
</style>