<template>
	<MainLayout>
		<div v-if="isAuthUser">
			<CertificateView :link="pdfLink" />
			<NewestCourses />
		</div>
	</MainLayout>
</template>

<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import CertificateView from '@/modules/CertificateDetail/components/CertificateView'
import NewestCourses from '@/modules/CertificateDetail/components/NewestCourses'
import {mapActions, mapGetters} from 'vuex'
export default {
	components: {
		MainLayout,
		CertificateView,
		NewestCourses,
	},
	async created() {
		await this.fetchUserCertificate(this.$route.params.id)
		this.setPdfLink()
	},
	methods: {
		...mapActions({
			fetchUserCertificate: 'userCertificate/fetchUserCertificate',
		}),
		setPdfLink() {
			if (this.getUserCertificate && this.getUserCertificate.userId === this.authUser.id) {
				this.pdfLink = `https://izteach-resource-bigdat.s3-ap-southeast-1.amazonaws.com/${this.getUserCertificate.pdf}`
			}
		}
	},
	data() {
		return {
			pdfLink: ''
		}
	},
	computed: {
		...mapGetters({
			getUserCertificate: 'userCertificate/getUserCertificate',
			userPermissions: 'userPermission/getUserPermissions',
			isAuthenticated: 'auth/getAuthenticated',
			authUser: 'auth/getAuthUser',
		}),
		isAuthUser() {
			return this.isAuthenticated && this.authUser.id === this.getUserCertificate.userId
		},
	},
}
</script>
