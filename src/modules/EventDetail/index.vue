<template>
	<MainLayout :has-dark-theme="false">
		<AffiliateDetect />
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<EventDetail v-else :item="item" />
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import AffiliateDetect from '@/components/AffiliateDetect'
import {mapGetters, mapActions} from 'vuex'
export default {
	async created() {
		await this.fetchEventById(this.$route.params.id)
		this.loading = false
	},
	data() {
		return {
			loading: true,
		}
	},
	components: {
		MainLayout,
		AffiliateDetect,
	},
	methods: {
		...mapActions({
			fetchEventById: 'event/fetchEventById',
		}),
	},
	computed: {
		...mapGetters({
			getEventById: 'event/getEventById',
		}),
		item() {
			if (this.getEventById) {
				return {
					...this.getEventById,
					coverImage: this.getEventById.coverImage
						? this.$utils.wrapperLinkImage(this.getEventById.coverImage)
						: undefined,
					previewImage: this.getEventById.previewImage
						? this.$utils.wrapperLinkImage(this.getEventById.previewImage)
						: undefined,
				}
			} else {
				return null
			}
		},
	},
}
</script>