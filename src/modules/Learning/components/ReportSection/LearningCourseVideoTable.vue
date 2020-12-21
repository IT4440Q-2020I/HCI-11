<template>
  <Wrapper v-if="videoList && videoList.length">
    <TextStyle font-type="title-4">Bài giảng video</TextStyle>
    <v-data-table
      :footer-props="{
        pageText: '1-10' + ' trong ' + videoList.length,
        itemsPerPageOptions: [10]
      }"
      :hide-default-footer="!isFooter"
      :items-per-page="10"
      disable-sort
      :items="videoList"
      dense
      :headers="headersVideo"
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
    videoList: Array
  },
  data() {
    return {
      moment,
      headersVideo: [
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
      return this.videoList.length >= 10
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
