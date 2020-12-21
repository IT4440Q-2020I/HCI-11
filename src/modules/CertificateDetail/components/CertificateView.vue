<template>
	<div class="pt-9 pa-4">
		<div class="mb-4">
			<TextStyle font-type="title-3" justify="center"
				>{{$vuetify.lang.t('$vuetify.COMPLETE_COURSE')}}</TextStyle
			>
			<TextStyle font-type="subtitle-2" justify="center"
				>{{$vuetify.lang.t('$vuetify.REVIEW_CERTIFICATE_IN_MY_COURSE')}}</TextStyle
			>
		</div>
		<div class="certificate-wrapper">
			<CertificateDownload :pdf-link="link" @onDownload="onDownLoad"/>
		</div>
	</div>
</template>
<script>
import CertificateDownload from '@/modules/CertificateDetail/components/CertificateDownload'
export default {
	props: {
		link: String,
	},
	components: {
		CertificateDownload
	},
	methods: {
		onDownLoad() {
			window.open(this.link, '_blank')
		},
	},
}
</script>
<style lang="scss" scoped>
.certificate-wrapper {
  max-width: 560px;
  margin: 0 auto;
}
</style>