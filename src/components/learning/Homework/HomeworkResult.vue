<template>
  <div>
    <v-row no-gutters class="mb-4">
      <v-col class="mb-2" cols="12">
        <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.RULES')}}</TextStyle>
      </v-col>
      <v-col cols="12">
        <v-row no-gutters class="wrapper-detail">
          <v-col class="d-flex flex-column" cols="12" sm="8" md="8" lg="8">
            <TextStyle
              class="mb-1"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.SUBMIT_AT')}}: {{moment(homework.submitTime).format('HH:mm:ss DD/MM/YYYY')}}</TextStyle>
            <TextStyle
              style="word-wrap: break-word;"
              class="mb-2"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.SUBMITTED_FILES')}}: {{homework.link ? homework.link : homework.title}}</TextStyle>
          </v-col>
          <v-col v-if="homework.mark" class="d-flex flex-column  align-end" cols="12" sm="4" md="4" lg="4">
            <TextStyle class="mb-1" font-type="body-2">
              {{$vuetify.lang.t('$vuetify.LEARNING.MARK')}}:
              <TextStyle font-type="title-4">{{homework.mark}}</TextStyle>
            </TextStyle>
            <TextStyle
              v-if="homework.notes"
              @click.native="openDialogNotes"
              class="mb-2 cursor-pointer show-comment"
              font-type="body-2"
            >{{$vuetify.lang.t('$vuetify.LEARNING.VIEW_DETAIL_OF_NOTE')}}</TextStyle>
          </v-col>
        </v-row>
        <hr class="mt-2" style="opacity: .3;" />
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500px">
      <v-card class="pa-4">
        <div class="mb-4">
          <TextStyle style="font-size: 18px;">{{$vuetify.lang.t('$vuetify.LEARNING.NOTE')}}:</TextStyle>
          <div style="max-height: 200px;overflow-x: hidden; overflow-y: scroll">
            <TextStyle>{{homework.notes}}</TextStyle>
          </div>
        </div>
        <div class="mt-3 text-right">
          <DecoratorButton @click="dialog = false" variation="primary" solid>{{$vuetify.lang.t('$vuetify.CLOSE')}}</DecoratorButton>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    homework: Object,
  },
  data() {
    return {
      moment,
      dialog: false,
    }
  },
  methods: {
    openDialogNotes() {
      this.dialog = true
    },
  },
}
</script>
<style lang="scss" scoped>
.wrapper-detail {
  .show-comment {
    color: #0084ff;
  }
  .align-end {
    justify-content: flex-end;
  }
}
@media only screen and (max-width: 768px) {
  .align-end {
    justify-content: flex-start !important;
  }
}
</style>
