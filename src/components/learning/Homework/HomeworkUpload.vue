<template>
  <v-row no-gutters class="mb-4">
    <v-col class="mb-2" cols="12">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT')}}</TextStyle>
    </v-col>
    <v-col class="mb-2" cols="12">
      <HomeworkSelectType @changeTypeUpload="(state) => changeTypeUpload(state)" />
    </v-col>
    <v-col cols="12">
      <HomeworkWrapper :state="state">
        <div slot="upload-part">
          <base-loading class="pa-5 full-height" v-if="loading" fluid color="primary" />
          <div v-else>
            <HomeworkUploadPart
              v-if="state ==='beforeUpload'"
              @onUploadSuccess="(fileUploaded) => onUploadSuccess(fileUploaded)"
            />
            <HomeworkWithLink
              v-else-if="state === 'link' || state === 'googleDrive'  "
              @confirm="(link) => submitHomeworkLink(link)"
            />
            <HomeworkUploadSuccess
              v-else-if="state === 'uploaded'"
              @reSubmit="reSubmit"
              @confirm="confirm"
              :fileUploaded="fileUploaded"
            />
            <HomeworkSubmitSuccess
              v-else-if="state === 'submitSuccessed'"
              :unit="unit"
              @reSubmit="reSubmit"
            />
          </div>
        </div>
      </HomeworkWrapper>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import HomeworkWrapper from '@/components/learning/Homework/HomeworkWrapper'
import HomeworkUploadPart from '@/components/learning/Homework/HomeworkUploadPart'
import HomeworkUploadSuccess from '@/components/learning/Homework/HomeworkUploadSuccess'
import HomeworkSubmitSuccess from '@/components/learning/Homework/HomeworkSubmitSuccess'
import HomeworkSelectType from '@/components/learning/Homework/HomeworkSelectType'
import HomeworkWithLink from '@/components/learning/Homework/HomeworkWithLink'
export default {
  components: {
    HomeworkWrapper,
    HomeworkUploadPart,
    HomeworkUploadSuccess,
    HomeworkSubmitSuccess,
    HomeworkSelectType,
    HomeworkWithLink,
  },
  props: {
    unit: Object,
  },
  data() {
    return {
      state: 'beforeUpload',
      fileUploaded: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'auth/getAuthUser',
    })
  },
  methods: {
    ...mapActions({
      submitHomework: 'homework/submitHomework',
    }),
    changeTypeUpload(type) {
      this.state = type
    },
    onUploadSuccess(fileUploaded) {
      this.state = 'uploaded'
      this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.UPLOAD_FILES_SUCCESS'))
      this.fileUploaded = fileUploaded
    },
    reSubmit() {
      this.fileUploaded = null
      this.state = 'beforeUpload'
    },
    submitHomeworkLink(link) {
      this.submit({
        type: 'link',
        title: this.$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.SUBMIT_WITH_LINK'),
        link,
      })
    },
    confirm() {
      this.submit({
        resources: this.fileUploaded,
        type: 'multiple-files',
        title: this.fileUploaded
          .map((file) => {
            return file.title
          })
          .join(','),
      })
    },
    async nextLesson() {
      await this.$emit('endLesson', {
        duration: new Date().getTime(),
        time: new Date().getTime(),
        isDone: true,
        type: 'homework',
      })
    },
    async submit(dynamicData) {
      this.loading = true
      try {
        const data = {
          ...dynamicData,
          state: 'submitted',
          submitTime: new Date(),
          unit: this.unit.id,
          course: this.unit.course,
          topics: 'homework',
          userId: this.authUser.id,
          name: this.authUser.name,
          email: this.authUser.email,
        }
        await this.submitHomework(data)
        this.$message.success(this.$vuetify.lang.t('$vuetify.MESSAGES.SUBMIT_HOMEWORK_SUCCESS'))
        await this.nextLesson()
        this.state = 'submitSuccessed'
        this.loading = false
      } catch (error) {
        this.$message.error(error)
      }
    },
  },
}
</script>
