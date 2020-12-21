<template>
	<v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title class="pa-5">
        <div class="d-flex justify-space-between full-width">
          <TextStyle font-type="title-3" noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.NOTE_OF_TEACHER')}}</TextStyle>
          <v-icon @click="closePopup">mdi-close</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="10" sm="6" md="8" lg="10">
            <div class="d-flex">
              <ElementAvatar size="medium" class="mr-2" />
              <div>
              <TextStyle font-type="title-4" class="font-weight-bold" noMargin>{{item.name}}</TextStyle>
              <TextStyle font-type="body-2" class="grey--text" noMargin>{{$vuetify.lang.t('$vuetify.LAST_UPDATED')}}: {{lastUpdatedTimeLabel}}</TextStyle>
              </div>
            </div>
          </v-col>
          <v-col cols="2" sm="6" md="4" lg="2" class="d-flex justify-end">
            <div class="mark d-flex justify-center align-center rounded" :style="{'background-color': $themeData.color_primary}">
							<TextStyle font-type="title-3" class="mark--text font-weight-bold white--text" noMargin>{{item.mark}}</TextStyle>
						</div>
          </v-col>
          <v-col cols="12" class="mt-4">
            <div v-if="item.notes">{{item.notes}}</div>
            <div v-else-if="item.html" class="mt-4 mb-4 html-content" v-html="item.html"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import moment from 'moment'
export default {
	data() {
		return {
      dialog: false,
      item: {},
		}
  },
  computed: {
    lastUpdatedTimeLabel() {
      return moment(this.item.updatedAt).format('DD/MM/YYYY hh:MM').replace(' ', ' lúc ')
    },
  },
	methods: {
    openPopup(item) {
      this.item = item
      this.dialog = true
    },
    closePopup() {
      this.dialog = false
    }
  },
}
</script>
<style lang="scss" scoped>
::v-deep .html-content {
  text-align: justify;
  img {
    width: 100%;
  }
}
.mark {
	height: 48px;
	width: 48px;
}
</style>