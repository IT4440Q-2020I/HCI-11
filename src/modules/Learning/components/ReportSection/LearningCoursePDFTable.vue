<template>
  <Wrapper v-if="pdfList && pdfList.length">
    <TextStyle font-type="title-4">Bài giảng pdf</TextStyle>
    <v-data-table
      :footer-props="{
        pageText: '1-10' + ' trong ' + pdfList.length,
        itemsPerPageOptions: [10]
      }"
      :hide-default-footer="!isFooter"
      :items-per-page="10"
      disable-sort
      :items="pdfList"
      dense
      :headers="headersPDF"
      class="course-online-learning__list"
    >
      <template v-slot:[`item.time`]="{item}">
        {{ moment(item.time).format('HH:mm, [ngày] DD/MM/YYYY') }}
      </template>
      <template v-slot:[`item.actions`]="{item}">
        <a @click="goToLesson(item)">
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
    pdfList: Array
  },
  data() {
    return {
      moment,
      headersPDF: [
        {
          text: 'Tên bài',
          align: 'start',
          value: 'title',
          width: '35%'
        },
        {text: 'Thời gian hoàn thành', value: 'time', width: '40%'},
        {text: '', value: 'actions', width: '10%'}
      ]
    }
  },
  computed: {
    isFooter() {
      return this.pdfList.length >= 10
    }
  },
  methods: {
    goToLesson(lesson) {
      let goToUnit = this.units.find(unit => {
        return unit.id === lesson.id
      })
      this.$emit('handleLesson', goToUnit)
    }
  }
}
</script>
