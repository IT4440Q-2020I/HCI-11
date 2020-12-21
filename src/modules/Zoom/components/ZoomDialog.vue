<template>
	<div class="text-center z-index" v-if="dialog">
		<v-dialog v-model="dialog" width="500" scrollable>
			<v-card v-if="!loading">
				<v-card-title class="title" primary-title>
					Lớp học trực tuyến
					<span class="ml-2 red--circle"></span>
					<v-spacer />
					<v-icon @click="dialog = false">mdi-close</v-icon>
				</v-card-title>
				<v-card-text v-if="zooms.length > 0" style="min-height: 300px;">
					<div
						class="item d-flex justify-space-between pa-3 my-3"
						v-for="(item, index) in zooms"
						:key="index"
					>
						<div>
							<div class="subtitle-1 font-weight-medium">{{ item.title }}</div>
							<div class="mt-2">
								<v-icon small class="mr-2">mdi-account-supervisor</v-icon>
								{{ item.teacher }}
								<span class="ml-2">-</span>
								<v-icon small class="ml-2 mr-2">mdi-clock-outline</v-icon>
								{{ item.startTime | beautiTime }}
							</div>
						</div>
            <div class="d-flex align-center">
              <v-btn
                color="primary"
                depressed
                :disabled="isFinished(item.endTime) == 'Đã kết thúc' ? true : false"
                :href="item.link"
                target="_blank"
              >
                {{ isFinished(item.endTime) }}
              </v-btn>
            </div>
					</div>
				</v-card-text>
				<v-card-text v-else>
					<p class="font-weight-medium subtitle-1">
						Chưa có phòng học Zoom theo lịch
					</p>
				</v-card-text>
			</v-card>
			<v-card v-else>
				<base-loading fluid color="primary" style="height: 500px" />
			</v-card>
		</v-dialog>
	</div>
	<p v-else></p>
</template>

<script>
import moment from 'moment'
export default {
	props: {state: Boolean, zooms: Array, loading: Boolean},
	watch: {
		async state() {
			this.dialog = true
		},
	},
	data() {
		return {
			dialog: false,
		}
	},
	filters: {
		beautiDate(date) {
			return moment(date).format('DD/MM/YYYY')
		},
		beautiTime(date) {
			return moment(date).format('HH:mm')
		},
	},
	methods: {
		isFinished(end) {
			let endDate = moment(end)
			if (moment().diff(endDate) < 0) {
				return ' Tham gia'
			} else {
				return 'Đã kết thúc'
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.fixed {
	position: fixed;
}
.red--circle {
	border-radius: 50%;
	background-color: red;
	width: 8px;
	height: 8px;
}
.item {
	background: #f8f8f8;
	border: 1px solid #e6e4eb;
	box-sizing: border-box;
	border-radius: 4px;
}
.z-index {
	z-index: 9999;
	position: fixed;
}
</style>
