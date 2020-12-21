<template>
	<div>
		<ZoomDialog
			v-if="isSupportZoom"
			:loading="loading"
			:state="dialog"
			:zooms="data"
		/>
		<div
			v-if="isSupportZoom"
			class="d-flex fixed cursor-pointer bg-white elevation-1 pa-2 rounded-pill"
			@click.stop="fetchZooms()"
		>
			<img class="mr-1" width="30px" src="/img/icons/zoom_icon.svg" />
			<img width="80px" src="/img/icons/zoom.svg" />
			<span class="red--circle"></span>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ZoomDialog from '@/modules/Zoom/components/ZoomDialog.vue'
import moment from 'moment'
export default {
	components: {ZoomDialog},
	data() {
		return {
			loading: false,
			dialog: false,
			data: [],
		}
	},
	computed: {
		...mapGetters({
			zooms: 'zoom/getZooms',
			isAuthenticated: 'auth/getAuthenticated',
			isDisplayZoom: 'vendor/getDisplayZoom',
			authUser: 'auth/getAuthUser',
		}),
		isSupportZoom() {
			const nameCurrentPage = this.$route.name
			return (
				nameCurrentPage === 'Home' && this.isAuthenticated && this.isDisplayZoom
			)
		},
	},
	methods: {
		...mapActions({
			fetchGroup: 'userGroup/fetch',
			fetchZoom: 'zoom/fetch',
		}),
		async fetchZooms() {
			this.loading = true
			this.dialog = !this.dialog
			try {
				const listGroups = await this.fetchGroup({
					users: this.authUser.id,
				})
				const listGroupIds = listGroups.map((group) => {
					return group.id
				})
				if (listGroupIds.length !== 0) {
					await this.fetchZoom({
						group_in: listGroupIds,
					})
				}
				this.loading = false
			} catch (err) {
				this.loading = false
				this.$message.error(err)
			}
			this.data = this.zooms.filter((z) => {
				return this.inDay(z.startTime)
			})
		},
		inDay(startTime) {
			let format = 'HH:mm:ss'
			let time = moment(startTime)
			let beforeTime = moment('00:01:00', format)
			let afterTime = moment('23:59:00', format)
			return time.isBetween(beforeTime, afterTime)
		},
	},
}
</script>
<style scoped>
.fixed {
	right: 72px;
	bottom: 42px;
	position: fixed;
	z-index: 99;
	opacity: 0.85;
	box-shadow: 0px 8px 16px rgba(62, 62, 60, 0.24);
}
.red--circle {
	border-radius: 50%;
	background-color: red;
	width: 8px;
	height: 8px;
}
@media only screen and (max-width: 600px) {
	.fixed {
		right: 24px;
		bottom: 24px;
	}
}
</style>
