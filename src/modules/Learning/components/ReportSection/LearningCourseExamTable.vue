<template>
  <Wrapper v-if="examList && examList.length">
    <TextStyle font-type="title-4">Bài kiểm tra</TextStyle>
    <v-data-table
      :footer-props="{
        pageText: '1-10' + ' trong ' + examList.length,
        itemsPerPageOptions: [10]
      }"
      :hide-default-footer="!isFooter"
      :items-per-page="1"
      disable-sort
      :items="examList"
      dense
      :headers="headersTest"
      class="course-online-learning__list"
    >
      <template v-slot:[`item.updatedAt`]="{item}">
        {{ moment(item.updatedAt).format('HH:mm, [ngày] DD/MM/YYYY') }}
      </template>
      <template v-slot:[`item.mark`]="{item}">
        {{ item.correct + '/' + item.total }}
      </template>
      <template v-slot:[`item.actions`]="{item}">
        <a @click="goToLesson(item.exam)">
          Xem lại
        </a>
      </template>
    </v-data-table>
  </Wrapper>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    units: Array,
    examList: Array
  },
  data() {
    return {
      moment,
      headersTest: [
        {
          text: 'Tên bài',
          align: 'start',
          value: 'title',
          width: '35%'
        },
        {text: 'Thời gian nộp bài lần cuối', value: 'updatedAt', width: '25%'},
        {text: 'Kết quả', value: 'mark', width: '15%'},
        {text: '', value: 'actions', width: '10%'}
      ]
    }
  },
  computed: {
    isFooter() {
      return this.examList.length >= 10
    }
  },
  methods: {
    goToLesson(lesson) {
      let goToUnit = this.units.find(unit => {
        return unit.exam === lesson
      })
      this.$emit('handleLesson', goToUnit)
    }
  }
}
</script>
<style lang="scss">
.course-online-learning__list {
  border: 1px solid #e6e4eb;
  box-sizing: border-box;
  border-radius: 4px;
  @media screen and (max-width: 778px) {
    margin-bottom: 16px;
  }
}
</style>
