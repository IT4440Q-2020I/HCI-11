<template>
	<MainLayout>
		<ElementLoading v-if="loading" color="primary" style="height: 100vh" />
		<MyNotification :item-number="50" :items="notifications" />
	</MainLayout>
</template>

<script>
import {mapGetters} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout'
export default {
	components: {
		MainLayout,
	},
	data() {
		return {
			loading: false,
		}
	},
	computed: {
		...mapGetters({
			notifications: 'notification/getNotifications',
		}),
	},
}
</script>