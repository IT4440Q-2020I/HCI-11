<template>
	<div class="py-9 px-4 bg-white newest-course">
		<TextStyle font-type="title-3" class="mb-3" inline no-margin
			>Có thể bạn quan tâm</TextStyle
		>
		<Grid :col-number="4" v-if="!loading">
			<div
				:class="{'grid-item': true}"
				v-for="(item, i) in onlineCourses"
				:key="i"
				:item="item"
			>
				<CardOnlineCourse
					:item="item"
					:show-subjects="false"
					:show-description="true"
					:title-char-limit="40"
					:owned-by-user="ownedItemIds.indexOf(item.id) !== -1"
					@onRedirectToCourse="redirectToCourse"
					@onRequestBuyCourse="requestBuyCourse"
				></CardOnlineCourse>
			</div>
		</Grid>
	</div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
	data() {
		return {
			loading: false,
		}
	},
	async created() {
    this.loading = true
    await this.fetchOnlineCourses({status: 'published', _skip: 0, _limit: 4})
    this.loading = false
	},
	computed: {
		...mapGetters({
      onlineCourses: 'onlineCourse/getCourses',
      userPermissions: 'userPermission/getUserPermissions',
    }),
    ownedItemIds() {
      return this.userPermissions.map(v=>v.id)
    }
	},
	methods: {
		...mapActions({
			fetchOnlineCourses: 'onlineCourse/fetchCourses',
		}),
		redirectToCourse() {
			console.log('to course')
		},
		requestBuyCourse() {
			console.log('buy course')
		},
  },
}
</script>
<style lang="scss" scoped>
.newest-course {
	position: relative;
}
.newest-course::after {
	content: '';
	display: block;
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100vw;
	max-width: 1920px;
	height: 100%;
	background: #fff;
	z-index: -1;
}
</style>