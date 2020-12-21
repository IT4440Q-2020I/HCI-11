<template>
  <Wrapper v-if="homeworksList && homeworksList.length">
    <TextStyle font-type="title-4">Bài tập</TextStyle>
    <v-data-table
      :footer-props="{
        pageText: '1-10' + ' trong ' + homeworksList.length,
        itemsPerPageOptions: [10]
      }"
      :hide-default-footer="!isFooter"
      :items-per-page="10"
      disable-sort
      :items="homeworksList"
      dense
      :headers="headersHomework"
      class="course-online-learning__list"
    >
      <template v-slot:[`item.recentHomework`]="{item}">
        {{ item.title }}
      </template>
      <template v-slot:[`item.submitTime`]="{item}">
        {{ moment(item.submitTime).format('HH:mm, [ngày] DD/MM/YYYY') }}
      </template>
      <template v-slot:[`item.mark`]="{item}">
        {{ item.mark || 'Chưa chấm điểm' }}
      </template>
      <template v-slot:[`item.actions`]="{item}">
        <a @click="goToLesson(item.unit)">
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
    homeworksList: Array,
    units: Array
  },
  data() {
    return {
      moment,
      headersHomework: [
        {
          text: 'Tên bài',
          align: 'start',
          sortable: false,
          value: 'recentHomework',
          width: '35%'
        },
        {text: 'Thời gian nộp bài lần cuối', value: 'submitTime', width: '25%'},
        {text: 'Kết quả', value: 'mark', width: '15%'},
        {text: '', value: 'actions', width: '10%'}
      ]
    }
  },
  computed: {
    isFooter() {
      return this.homeworksList.length >= 10
    }
  },
  methods: {
    goToLesson(lesson) {
      let goToUnit = this.units.find(unit => {
        return unit._id === lesson
      })
      this.$emit('handleLesson', goToUnit)
    }
  }
}
</script>
