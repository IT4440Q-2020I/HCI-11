<template>
	<div></div>
</template>
<script>
import moment from 'moment'
export default {
	mounted() {
		const affiliateId = this.$route.query.affiliate
		const relationId = this.$route.params.id
		if (affiliateId && relationId)
			this.saveAffiliatesStorage(affiliateId, relationId)
	},
	methods: {
		saveAffiliatesStorage(affiliateId, relationId) {
			let data = JSON.parse(localStorage.getItem('affiliates'))
			if (!data) data = {}
			if (!data || (data && !data[affiliateId])) {
				data[affiliateId] = {
					affiliateId: affiliateId,
					relationId: relationId,
					timestamp: moment(new Date().valueOf()).toISOString(),
				}
				localStorage.setItem('affiliates', JSON.stringify(data))
			}
		},
	},
}
</script>