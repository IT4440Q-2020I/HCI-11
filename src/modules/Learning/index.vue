<template>
  <div>
    <div @contextmenu.prevent="e => e.preventDefault()">
      <v-app @contextmenu.prevent="e => e.preventDefault()">
        <LearningLayout>
          <template slot="learning__header--left" slot-scope="props">
            <LearningHeaderLeft
              v-if="!isReportResult"
              :props="props"
              :currentLesson="currentUnit"
            />
            <LearningHeaderLeft v-else :props="props" />
          </template>
          <template slot="learning__header--right" slot-scope="props">
            <LearningHeaderRight
              v-show="!isReportResult"
              @changeSideBar="status => changeSideBar(status)"
              :props="props"
              :currentLesson="currentUnit"
              :currentCourse="currentCourse"
            />
          </template>
          <template slot="sidebar" slot-scope="props">
            <LearningCourseInfo
              @changeReportStatus="changeReportStatus"
              :props="props"
              :reupdatePercent="reupdatePercent"
              :courseTitle="currentCourse.title"
              :userCourse="userCourse"
            />
            <LearningSyllabusNavigation
              @change-lesson="handleLesson"
              v-show="!props.isMini"
              :syllabus="syllabus"
              :viewsOfStudent="viewsOfStudent"
              :checkDoingTest="checkDoingTest"
              :currentCourse="currentCourse"
              @openDialogAlertSubmitTest="openDialogAlertSubmitTest"
              ref="syllabus-navigation"
            />
          </template>
          <template slot="sidebar-mobile" slot-scope="props">
            <div style="flex: 1">
              <LearningCourseInfoMobile
                :props="props"
                :courseTitle="currentCourse.title"
                @changeReportStatus="changeReportStatus"
              />
              <LearningSyllabusNavigation
                @change-lesson="
                  value => {
                    handleLesson(value)
                    props.toggleSidebarMobile && props.toggleSidebarMobile()
                  }
                "
                v-show="!props.isMini"
                :syllabus="syllabus"
                :checkDoingTest="checkDoingTest"
                :currentCourse="currentCourse"
                :viewsOfStudent="viewsOfStudent"
              />
            </div>
          </template>
          <template slot="overlay-right-sidebar" slot-scope="props">
            <LearningRightSidebar
              v-if="!isReportResult"
              :props="props"
              :currentLesson="currentUnit"
              :currentCourse="currentCourse"
            />
          </template>
          <template>
            <LearningCourseReport
              v-if="isReportResult"
              :userCourse="userCourse"
              :units="units"
              :objectUnits="objectUnits"
              @handleLesson="goToUnit => handleLesson(goToUnit)"
            />
            <LearningCourseMainContent
              v-show="currentUnit.type"
              ref="main-content"
              :currentLesson="currentUnit"
              @nextLesson="nextLesson"
              @endLesson="value => endLesson(value)"
              :userCourse="userCourse"
            />
            <div
              v-show="currentUnit.id && !currentUnit.type"
              class="flex-center"
            >
              <TextStyle font-type="title-4">{{
                $vuetify.lang.t(
                  '$vuetify.LEARNING.CURRENT_LESSON_HAVE_NO_SETUP'
                )
              }}</TextStyle>
            </div>
          </template>
        </LearningLayout>
        <PopupWarningWhenDoingTest
          :dialog="isOpenDialogAlertSubmitTest"
          @onCancel="() => (isOpenDialogAlertSubmitTest = false)"
        />
        <Popup ref="popup-certificate">
          <div class="popup-certificate align-items-center flex-column">
            <ElementIcon sizePx="36" name="medal" variation="primary" />
            <div>
              <TextStyle justify="center" font-type="title-3">{{
                $vuetify.lang.t('$vuetify.CONGRATULATION')
              }}</TextStyle>
              <TextStyle justify="center" font-type="subtitle-2">{{
                $vuetify.lang.t(
                  '$vuetify.COMPLETE_COURSE_AND_RECEIVE_CERTIFICATE'
                )
              }}</TextStyle>
            </div>
            <DecoratorButton @click="redirectToCertificate">{{
              $vuetify.lang.t('$vuetify.RECEIVE_CERTIFICATE')
            }}</DecoratorButton>
          </div>
        </Popup>
      </v-app>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import LearningCourseReport from '@/modules/Learning/components/ReportSection/LearningCourseReport'
import LearningLayout from '@/modules/Learning/components/LearningLayout'
import LearningHeaderLeft from '@/modules/Learning/components/LeftSection/LearningHeaderLeft'
import LearningCourseInfo from '@/modules/Learning/components/LeftSection/LearningCourseInfo'
import LearningCourseInfoMobile from '@/modules/Learning/components/LeftSection/LearningCourseInfoMobile'
import LearningSyllabusNavigation from '@/modules/Learning/components/LeftSection/LearningSyllabusNavigation'
import LearningCourseMainContent from '@/modules/Learning/components/MainSection/LearningCourseMainContent'
import LearningHeaderRight from '@/modules/Learning/components/RightSection/LearningHeaderRight'
import LearningRightSidebar from '@/modules/Learning/components/RightSection/LearningRightSidebar'
import PopupWarningWhenDoingTest from '@/components/learning/Popup/PopupWarningWhenDoingTest'
import get from 'lodash-es/get'
export default {
  components: {
    LearningLayout,
    LearningHeaderLeft,
    LearningCourseInfo,
    LearningCourseInfoMobile,
    LearningSyllabusNavigation,
    LearningCourseMainContent,
    LearningHeaderRight,
    LearningRightSidebar,
    PopupWarningWhenDoingTest,
    LearningCourseReport
  },
  data() {
    return {
      rightPanel: false,
      defaultTab: 'tab-1',
      sidebar: 'infor',
      reupdatePercent: false,
      isOpenDialogAlertSubmitTest: false,
      isReportResult: true
    }
  },
  async mounted() {
    setTimeout(async () => {
      const isAuthenticated = await this.checkAuthentication()
      if (isAuthenticated) {
        await this.init()
        await this.checkProgressWithNewVersionOfCourse()
      } else {
        this.$router.push(
          `/course-online-detail/${this.$route.params.courseId}`
        )
      }
    }, 2000)
  },
  computed: {
    ...mapGetters({
      objectUnits: 'unit/objectUnits',
      currentCourse: 'onlineCourse/getCourse',
      userCourse: 'userCourse/getUserCourse',
      sections: 'section/sections',
      currentUnit: 'unit/getUnit',
      getUnitsBySectionId: 'unit/getUnitsBySectionId',
      units: 'unit/units',
      getUserCertificates: 'userCertificate/getUserCertificates',
      authUser: 'auth/getAuthUser',
      getCertificate: 'certificate/getOne'
    }),
    viewsOfStudent() {
      return get(this.userCourse, 'dataDetails.views')
    },
    syllabus() {
      if (!this.sections.length) return []
      return this.sections.map(section => {
        section.lessons = this.getUnitsBySectionId(section._id)
        return section
      })
    }
  },
  methods: {
    ...mapActions({
      fetchCourse: 'onlineCourse/fetchCourseById',
      fetchUserCourse: 'userCourse/fetchUserCourse',
      interactUserCourse: 'userCourse/interactUserCourse',
      createOrUpdateViews: 'userCourse/createOrUpdateViews',
      caculateCourseProgress: 'userCourse/calculateCourseProgress',
      checkPermissionAccessCourse: 'userPermission/checkPermissionAccessCourse',
      fetchUnit: 'unit/fetchUnit',
      fetchUnits: 'unit/fetchUnits',
      fetchSections: 'section/fetchSections',
      fetchComments: 'comment/fetchComments',
      fetchUserCertificates: 'userCertificate/fetchUserCertificates',
      checkCertificate: 'certificate/checkCertificate',
      createUserCerificate: 'userCertificate/createUserCerificate'
    }),
    checkProgressWithNewVersionOfCourse() {
      const oldVersion = get(this.userCourse, 'dataDetails.courseVersion', 0)
      const newVersion = get(this.currentCourse, 'data.version', 0)
      const viewData = get(this.userCourse, 'dataDetails')
      if (viewData && oldVersion < newVersion)
        this.updateProgressUserCourse(viewData)
    },
    async checkAuthentication() {
      const res = await this.checkPermissionAccessCourse(
        this.$route.params.courseId
      )
      return !!(res && res.read)
    },
    checkDoingTest() {
      return this.$refs['main-content'].checkDoingTest()
    },
    openDialogAlertSubmitTest() {
      this.isOpenDialogAlertSubmitTest = true
    },
    getDataView(duration, time, isDone, type) {
      return {
        updatedAt: new Date().toISOString(),
        resourceId: get(this.currentUnit, 'resources[0].id'),
        isDone,
        duration,
        unitId: this.currentUnit.id,
        sectionId: this.currentUnit.section,
        time,
        type
      }
    },
    async updateProgressUserCourse(viewData) {
      const progress = await this.caculateCourseProgress({
        viewsOfStudent: viewData.views,
        syllabus: this.syllabus
      })
      viewData.progress = progress
      viewData.courseVersion = this.currentCourse.data.version || 0
      try {
        await this.interactUserCourse({
          id: this.userCourse.id,
          userCourse: viewData
        })
      } catch (error) {
        this.$message.error(error)
      }
    },
    async endLesson({duration, time, isDone, type} = {}) {
      let newView = this.getDataView(duration, time, isDone, type)
      let viewData = await this.createOrUpdateViews({
        newView,
        viewsOfStudent: this.viewsOfStudent
      })
      this.updateProgressUserCourse(viewData)
    },
    changeSideBar(status) {
      this.sidebar = status
    },
    initWindowResize() {
      if (window.innerWidth > 1270) {
        this.defaultTab = 'tab-2'
      } else {
        this.defaultTab = 'tab-1'
      }
    },
    async init() {
      const course = this.$route.params.courseId
      const sectionId = this.$route.params.sectionId
      const unitId = this.$route.params.unitId
      window.addEventListener('resize', this.initWindowResize)
      this.initWindowResize()
      await this.fetchCourse(course)
      await this.fetchUnits({course})
      await this.fetchSections({course})
      await this.fetchUserCourse({courseId: course})
      this.fetchUnit(unitId)

      let selectedUnit = {
        course,
        section: sectionId,
        _id: unitId,
        id: unitId
      }
      this.$refs['syllabus-navigation'].setActiveLabel(selectedUnit)
      this.reupdatePercent = true
    },
    async handleLesson(selectedLesson) {
      this.isReportResult = false
      const currentPath = this.$route.path
      const nextPath = `/course-online-learning/${selectedLesson.course}/${selectedLesson.section}/${selectedLesson._id}`
      if (currentPath !== nextPath) {
        this.$router.push(nextPath)
        this.fetchUnit(selectedLesson._id)
      }
    },
    async changeReportStatus() {
      this.isReportResult = !this.isReportResult
    },
    getIndexCurrentSectionAndUnit() {
      const currentLesson = this.currentUnit
      let idxSection = 0
      let idxLesson = 0
      this.sections.forEach((section, indexSection) => {
        section.lessons.forEach((lesson, indexLesson) => {
          if (lesson._id === currentLesson._id) {
            idxSection = indexSection
            idxLesson = indexLesson
          }
        })
      })
      return {
        idxSection,
        idxLesson
      }
    },
    nextLesson() {
      const index = this.getIndexCurrentSectionAndUnit()
      let nextLesson = {}
      if (
        index.idxLesson ===
        this.sections[index.idxSection].lessons.length - 1
      ) {
        nextLesson = this.sections[index.idxSection + 1].lessons[0]
      } else {
        const nextIndexLesson = index.idxLesson + 1
        nextLesson = this.sections[index.idxSection].lessons[nextIndexLesson]
      }
      if (nextLesson) {
        this.$refs['syllabus-navigation'].activeLesson(nextLesson)
        this.handleLesson(nextLesson)
      }
    },
    openPopupCertificate() {
      if (this.$refs['popup-certificate']) {
        this.$refs['popup-certificate'].openPopup()
      }
    },
    async redirectToCertificate() {
      this.$refs['popup-certificate'].closePopup()
      await this.fetchUserCertificates({
        userId: this.authUser.id,
        course: this.$route.params.courseId
      })
      let userCertificateId = ''
      if (this.getUserCertificates.length === 0) {
        this.$message.loading('Đang tạo chứng chỉ...', 20000)
        const {
          expired,
          dataType,
          title,
          subTitle,
          description,
          subDescription,
          expiredTitle,
          certificationName
        } = this.getCertificate
        try {
          const newUserCertificate = await this.createUserCerificate({
            userId: this.authUser.id,
            certificate: this.getCertificate.id,
            student: this.authUser.studentId,
            course:
              this.getCertificate && this.getCertificate.course
                ? this.getCertificate.course.id
                : '',
            expired: expired,
            dataType: dataType,
            title: title,
            subTitle: subTitle,
            description: description,
            subDescription: subDescription,
            expiredTitle: expiredTitle,
            certificationName: certificationName
          })
          userCertificateId = newUserCertificate.id
        } catch (error) {
          this.$message.error('Tạo chứng chỉ không thành công!')
        }
      } else {
        userCertificateId = this.getUserCertificates[0].id
      }
      if (userCertificateId) {
        this.$message.close()
        this.$router.push(`/certificate-detail/${userCertificateId}`)
      }
    },
    async checkUserCertificate() {
      const courseHasCertificate = await this.checkCertificate(
        this.$route.params.courseId
      )
      if (courseHasCertificate) {
        this.openPopupCertificate()
      }
    }
  },
  watch: {
    userCourse: {
      async handler(val) {
        if (get(val, 'dataDetails.progress') >= 100) {
          this.checkUserCertificate()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.popup-certificate {
  padding: 16px;
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
