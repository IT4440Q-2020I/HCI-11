<template>
  <div class="d-flex pa-3 course-online-learning__cards">
    <v-card
      class="course-online-learning__card-info "
      v-for="(result, index) in initData"
      :key="index"
      flat
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-3">
            <TextStyle font-type="title-4"> {{ result.title }}</TextStyle>
          </v-list-item-title>
          <TextStyle font-type="title-3"> {{ result.data }}</TextStyle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    userCourse: Object,
    examList: Array,
    homeworksList: Array,
    courseTotalExam: Number,
    courseTotalHomework: Number,
    units: Array,
    videoList: Array,
    pdfList: Array
  },
  data() {
    return {
      submitedExam: '',
      submitedHomework: '',
      progress: ''
    }
  },
  computed: {
    initData() {
      let progressObj = {
        title: 'Tiến độ hoàn thành',
        data: this.progress ? this.progress + '%' : '0%'
      }
      let data = []
      if (this.submitedHomework && data.length < 2)
        data.push({
          title: 'Bài tập đã làm',
          data:
            this.submitedHomework && this.courseTotalHomework
              ? this.submitedHomework + '/' + this.courseTotalHomework
              : '-/-'
        })
      if (this.submitedExam && data.length < 2)
        data.push({
          title: 'Bài kiểm tra đã làm',
          data:
            this.submitedExam && this.courseTotalExam
              ? this.submitedExam + '/' + this.courseTotalExam
              : '-/-'
        })
      if (this.videoList.length && data.length < 2)
        data.push({
          title: 'Bài giảng video đã xem',
          data: this.videoList.length
            ? this.videoList.length +
            '/' +
            this.units.filter(unit => {
                return unit.type === 'vimeo'
            }).length
            : '-/-'
        })
      if (this.pdfList.length && data.length < 2)
        data.push({
          title: 'Bài giảng pdf đã xem',
          data: this.pdfList.length
            ? this.pdfList.length +
            '/' +
            this.units.filter(unit => {
                return unit.type === 'pdf'
            }).length
            : '-/-'
        })
      data.push(progressObj)
      return data
    }
  },
  watch: {
    userCourse: {
      handler(val) {
        if (val) {
          val.dataDetails
            ? (this.progress = Math.floor(val.dataDetails.progress))
            : (this.progress = '0')
        }
      },
      immediate: true
    },
    homeworksList: {
      handler(val) {
        if (val) {
          this.submitedHomework = val.length
        }
      },
      immediate: true
    },
    examList: {
      handler(val) {
        if (val) {
          this.submitedExam = val.length
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.course-online-learning__card-info {
  border: 1px solid #e6e4eb;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  flex-grow: 1;
  @media screen and (max-width: 778px) {
    margin-bottom: 16px;
  }
}
.course-online-learning__cards {
  @media screen and (max-width: 778px) {
    flex-direction: column;
  }
}
</style>
