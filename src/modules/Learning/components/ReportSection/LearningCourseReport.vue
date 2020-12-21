<template>
	<div class="report-content">
		<Wrapper ph0>
			<Wrapper>
				<Title
					noMargin
					heading-text="Tiến độ học tập"
					:sub-text="'Tương tác học lần cuối lúc' + ' ' + lastView"
					justify="center"
				></Title>
			</Wrapper>
			<LearningCourseReportCard
				:examList="examList"
				:homeworksList="homeworksList"
				:userCourse="userCourse"
				:courseTotalHomework="courseTotalHomework"
				:courseTotalExam="courseTotalExam"
				:units="units"
				:pdfList="pdfList"
				:videoList="videoList"
			/>
			<LearningCourseExamTable
				@handleLesson="goToUnit => handleLesson(goToUnit)"
				:examList="examList"
				:units="units"
			/>
			<LearningCourseHomeworkTable
				@handleLesson="goToUnit => handleLesson(goToUnit)"
				:homeworksList="homeworksList"
				:units="units"
			/>
			<LearningCourseVideoTable
				@handleLesson="goToUnit => handleLesson(goToUnit)"
				:units="units"
				:videoList="videoList"
			/>
			<LearningCoursePDFTable
				@handleLesson="goToUnit => handleLesson(goToUnit)"
				:pdfList="pdfList"
				:units="units"
			/>
		</Wrapper>
	</div>
</template>

<script>
import get from 'lodash-es/get'
import {mapActions, mapGetters} from 'vuex'
import LearningCourseReportCard from '@/modules/Learning/components/ReportSection/LearningCourseReportCard'
import LearningCourseExamTable from '@/modules/Learning/components/ReportSection/LearningCourseExamTable'
import LearningCourseHomeworkTable from '@/modules/Learning/components/ReportSection/LearningCourseHomeworkTable'
import LearningCoursePDFTable from '@/modules/Learning/components/ReportSection/LearningCoursePDFTable'
import LearningCourseVideoTable from '@/modules/Learning/components/ReportSection/LearningCourseVideoTable'
import moment from 'moment'
export default {
	components: {
		LearningCourseExamTable,
		LearningCourseHomeworkTable,
		LearningCoursePDFTable,
		LearningCourseReportCard,
		LearningCourseVideoTable
	},
	props: {
		userCourse: Object,
		units: Array,
		objectUnits: Object
	},
	data() {
		return {
			moment,
			lastView: '',
			progress: ''
		}
	},
	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
			homeworks: 'homework/getHomeworks',
			submissions: 'submission/getSubmissions'
		}),
		courseTotalHomework() {
			return this.units.filter(unit => {
				return unit.type === 'homework'
			}).length
		},
		homeworksList() {
			const uniqueHomework = this.homeworks.filter(
				(elem, index) =>
					this.homeworks.findIndex(obj => obj.unit === elem.unit) === index
			)
			return uniqueHomework.map(homework => {
				return {
					...homework,
					title:
						homework.unit && this.objectUnits[homework.unit]
							? this.objectUnits[homework.unit].title
							: ''
				}
			})
		},
		examList() {
			return this.submissions.map(sub => {
        const keys = Object.keys(this.objectUnits)
        console.log(this.objectUnits)
				const exams = {...sub}
				keys.forEach(data => {
					if (this.objectUnits[data].exam == sub.exam) {
						exams.title = this.objectUnits[data].title
					}
				})
				return exams
			})
		},
		courseTotalExam() {
			return this.units.filter(unit => {
				return unit.exam
			}).length
		},
		videoList() {
			return this.units
				.filter(unit => {
					return unit.type === 'vimeo'
				})
				.map(videoUnit => {
					const views = get(this.userCourse, 'dataDetails.views', [])
					console.log('map')
					if (views.some(item => item.unitId === videoUnit.id))
						views.forEach(videoView => {
							if (videoUnit.id === videoView.unitId)
								videoUnit.time = Date.parse(videoView.updatedAt)
							videoUnit.isDone = videoView.isDone
						})
					return videoUnit
				})
				.sort(function(a, b) {
					return b.time - a.time
				})
				.filter(video => {
					return video.isDone === true
				})
		},
		pdfList() {
			return this.units
				.filter(unit => {
					return unit.type === 'pdf'
				})
				.map(pdfUnit => {
					const views = get(this.userCourse, 'dataDetails.views', [])
					if (views.some(item => item.unitId === pdfUnit.id))
						views.forEach(pdfView => {
							if (pdfView.unitId === pdfUnit.id) pdfUnit.time = pdfView.time
							pdfUnit.isDone = pdfView.isDone
						})
					return pdfUnit
				})
				.sort(function(a, b) {
					return b.time - a.time
				})
				.filter(pdf => {
					return pdf.isDone === true
				})
		}
	},
	methods: {
		...mapActions({
			fetchResultHomework: 'homework/fetchHomeworks',
			fetchSubmissions: 'submission/fetchLastSubmission'
		}),
		handleLesson(goToUnit) {
			this.$emit('handleLesson', goToUnit)
		}
	},
	watch: {
		userCourse: {
			handler(val) {
				if (val) {
					this.lastView = moment(val.updatedAt).format(
						'HH:mm, [ngày] DD/MM/YYYY'
					)
				}
			},
			immediate: true
		},
		authUser: {
			handler(val) {
				if (val) {
					this.fetchResultHomework({
						userId: this.authUser.id,
						course: this.$route.params.courseId
					})
					this.fetchSubmissions({
						userId: this.authUser.id,
						courseId: this.$route.params.courseId
					})
				}
			},
			immediate: true
		}
	}
}
</script>

<style lang="scss" scoped>
.report-content {
	height: 100%;
	overflow: auto;
}
</style>
