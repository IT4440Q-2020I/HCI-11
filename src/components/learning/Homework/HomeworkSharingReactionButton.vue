<template>
  <DecoratorButton text class="px-1 mr-2" @click="() => toggleLike(item)" :class="{'toggle-button': !!currentReaction}">
    <v-icon class="subtitle-1 grey--text mr-1">mdi-heart-outline</v-icon>
    <TextStyle font-type="body-2" inline noMargin>{{totalReaction || ''}} {{$vuetify.lang.t('$vuetify.BUTTON.LIKE')}}</TextStyle>
  </DecoratorButton>
</template>
<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      totalReaction: 0,
    }
  },
  computed: {
    ...mapGetters({
      reactions: 'reaction/getReactions',
    }),
    currentReaction() {
      return this.reactions.filter(reaction => reaction.objectId === this.item.id)[0]
    },
  },
  methods: {
    ...mapActions({
      createReaction: 'reaction/createReaction',
      removeReaction: 'reaction/removeReaction',
      fetchReactions: 'reaction/fetchReactions',
    }),
    ...mapMutations({
      updateSharedHomework: 'homework/updateSharedHomework',
    }),
    async toggleLike(homework) {
      if (this.currentReaction) {
        await this.removeReaction(this.currentReaction.id)
        this.totalReaction -= 1
      } else {
        await this.createReaction({
          objectId: homework.id,
          objectType: 'HOMEWORK',
          objectName : `Nhận xét của giảng viên vào bài của ${homework.name}`,
          type : "LOVE",
          status : true,
        })
        this.totalReaction += 1
      }
      this.updateSharedHomework({
        ...homework,
        totalReaction_LOVE: this.totalReaction,
      })
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.totalReaction = this.$utils.calculateTotalReactions(val)
        }
      },
      immediate: true,
    }
  }
}
</script>
<style lang="scss" scoped>
.iztech-theme .element.button.v-btn.v-btn--text.toggle-button {
  background-color: #79797929;
}
</style>
