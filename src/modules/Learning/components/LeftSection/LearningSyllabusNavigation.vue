<template>
  <div class="pattern syllabus">
    <ElementCollapsible
      ref="collapseItem"
      class="navigation__chapter"
      v-for="(chapter, i) in syllabus"
      :key="i"
    >
      <div slot="collapsible__title">
        <TextStyle font-type="subtitle-1">{{ chapter.title }}</TextStyle>
      </div>

      <div
        class="navigation__lesson"
        :style="{
          'background-color': lesson.active
            ? $themeData.color_primary + '29'
            : 'transparent'
        }"
        @click="activeLesson(lesson)"
        v-for="(lesson, j) in chapter.lessons"
        :key="j"
      >
        <div class="lesson__status">
          <ElementIcon
            v-if="lesson.block"
            name="lock-24px"
            size="medium"
            fill="#D0D1D9"
          />
          <v-icon
            v-else-if="!lesson.block && lesson.isDone"
            :color="$themeData.color_primary"
            size="medium"
            >mdi-checkbox-marked-circle</v-icon
          >
          <!-- <ElementIcon
            v-else-if="!lesson.block && lesson.isDone"
            name="complete_icon"
            size="medium"
            :fill="$themeData.color_primary"
          /> -->
          <DecoratorProgressCircular
            v-else
            :size="16"
            :width="2"
            :value="lesson.progress"
          />
        </div>
        <div class="lesson__vertical-line"></div>
        <div class="lesson__label">
          <div class="lesson__resource" v-if="lesson.type">
            <span v-if="lesson.type === 'video' || lesson.type === 'vimeo'">
              <!-- <v-icon
                size="medium"
                :color="lesson.active ? '#707070' : '#D0D1D9'"
              >mdi-video</v-icon> -->
              <ElementIcon
                name="unit-type-video"
                :fill="lesson.active ? '#707070' : '#D0D1D9'"
                size="medium"
              ></ElementIcon>
            </span>
            <span v-else-if="lesson.type === 'homework'">
              <!-- <v-icon
                size="medium"
                :color="lesson.active ? '#707070' : '#D0D1D9'"
                >mdi-cloud-upload</v-icon
              > -->
              <ElementIcon
                name="unit-type-upload"
                size="medium"
                :fill="lesson.active ? '#707070' : '#D0D1D9'"
              ></ElementIcon>
            </span>
            <span v-else-if="lesson.type === 'test'">
              <ElementIcon
                size="medium"
                name="unit-type-test"
                :fill="lesson.active ? '#707070' : '#D0D1D9'"
              ></ElementIcon>
            </span>
            <span v-else-if="lesson.type === 'exercise'">
              <ElementIcon
                size="medium"
                name="unit-type-pdf-test"
                :fill="lesson.active ? '#707070' : '#D0D1D9'"
              ></ElementIcon>
            </span>
            <span v-else-if="lesson.type === 'pdf'">
              <!-- <v-icon
                size="medium"
                :color="lesson.active ? '#707070' : '#D0D1D9'"
              >mdi-file-document</v-icon> -->
              <ElementIcon
                size="medium"
                name="unit-type-pdf"
                :fill="lesson.active ? '#707070' : '#D0D1D9'"
              ></ElementIcon>
            </span>
            <span v-else>
              <div style="width: 16px; height: 16px"></div>
            </span>
          </div>

          <div v-else style="width: 16px; height: 16px; margin-right: 10px" />
          <div class="lesson__title">
            <TextStyle
              :style="lesson.block ? 'color: #D0D1D9;' : 'color: black;'"
              style="line-height: 1.6"
              font-type="body-2"
              noMargin
              >{{ lesson.title }}</TextStyle
            >
          </div>
        </div>
      </div>
    </ElementCollapsible>
  </div>
</template>
<script>
import get from 'lodash-es/get'
export default {
  props: {
    syllabus: Array,
    currentCourse: Object,
    viewsOfStudent: {
      type: Array,
      default: () => []
    },
    checkDoingTest: Function
  },
  data() {
    return {
      currentLesson: null,
      previousLesson: null,
      mustReadPreviousLesson: false
    }
  },
  async mounted() {
    if (this.$themeData && this.$themeData.color_primary) {
      this.$themeConfig.addStyle(
        'pattern-syllabus-nav',
        `
      .pattern.syllabus .navigation__lesson--active {box-shadow: inset -4px 0 0 0 ${this.$themeData.color_primary}}
      `
      )
    }
  },
  watch: {
    currentCourse: {
      handler(course) {
        const mustReadPreviousLesson = get(
          course,
          'meta.mustReadPreviousLesson',
          false
        )
        this.mustReadPreviousLesson = mustReadPreviousLesson
      },
      immediate: true
    },
    viewsOfStudent: {
      handler(viewsOfStudent) {
        if (viewsOfStudent && viewsOfStudent.length) {
          this.setDoneForLesson(viewsOfStudent)
          if (this.mustReadPreviousLesson) {
            this.setBlockForLesson(viewsOfStudent)
          }
        }
      },
      immediate: true,
    }
  },
  methods: {
    setDoneForLesson(viewsOfStudent) {
      const viewsDone = viewsOfStudent.filter(view => view.isDone === true)
      viewsDone.forEach(view => {
        this.syllabus.forEach(chapter => {
          chapter.lessons.forEach(lesson => {
            if (view.unitId === lesson.id) this.$set(lesson, 'isDone', true)
          })
        })
      })
    },
    checkIsDoneLesson(lesson, viewsOfStudent) {
      if (!lesson) return false
      const doneLesson = viewsOfStudent.find(view => {
        return view.unitId === lesson._id && lesson.isDone
      })
      return !!doneLesson
    },
    getIndexCurrentSectionAndUnit(lesson) {
      let idxSection = 0
      let idxLesson = 0
      this.syllabus.forEach((section, indexSection) => {
        section.lessons.forEach((unit, indexLesson) => {
          if (unit._id === lesson._id) {
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
    checkNeightborIsDone(lesson, viewsOfStudent) {
      const index = this.getIndexCurrentSectionAndUnit(lesson)
      const indexCurrentSection = index.idxSection
      const indexCurrentUnit = index.idxLesson
      let previousLesson = {}
      if (indexCurrentUnit === 0) {
        previousLesson = this.syllabus[indexCurrentSection - 1].lessons[
          this.syllabus[indexCurrentSection - 1].lessons.length - 1
        ]
      } else {
        previousLesson = this.syllabus[indexCurrentSection].lessons[
          indexCurrentUnit - 1
        ]
      }
      if (!previousLesson.type) return true
      const previousLessonIsDone = this.checkIsDoneLesson(
        previousLesson,
        viewsOfStudent
      )
      return !!previousLessonIsDone
    },
    setBlockForLesson(viewsOfStudent) {
      this.syllabus.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          if (viewsOfStudent && !viewsOfStudent.length) {
            this.$set(lesson, 'block', true)
          } else {
            if (lesson.type) {
              const isDoneLesson = this.checkIsDoneLesson(
                lesson,
                viewsOfStudent
              )
              if (isDoneLesson) {
                this.$set(lesson, 'block', false)
              } else {
                const neightborIsDone = this.checkNeightborIsDone(
                  lesson,
                  viewsOfStudent
                )
                this.$set(lesson, 'block', !neightborIsDone)
              }
            } else {
              this.$set(lesson, 'block', false)
            }
          }
        })
      })
    },
    setActiveLabel(selectedLesson) {
      this.syllabus.forEach((chapter, idxSection) => {
        chapter.lessons.forEach((lesson, idxLesson) => {
          if (this.mustReadPreviousLesson) {
            if (!this.viewsOfStudent.length) {
              const isFirstLesson = idxSection === 0 && idxLesson === 0
              this.$set(lesson, 'block', !isFirstLesson)
            }
          }
          if (selectedLesson.id === lesson.id) {
            this.$set(lesson, 'active', true)
            // this.$nextTick(() => {
            // 	this.$refs.collapseItem[idxSection].collapse()
            // })
          } else {
            this.$set(lesson, 'active', false)
          }
        })
      })
    },
    activeLesson(item) {
      if (item.block) return
      const isStarting = this.checkDoingTest()
      if (isStarting) return this.$emit('openDialogAlertSubmitTest')
      this.setActiveLabel(item)
      this.$emit('change-lesson', item)
    }
  }
}
</script>
<style lang="scss">
.pattern.syllabus {
  height: calc(100vh - 60px);
  max-height: 100vh;
  .navigation__chapter {
    margin-bottom: 0;
  }
  .navigation__label {
    user-select: none;
    cursor: pointer;
    padding: 20px 15px;
    background: #f8f8f8;
    border-bottom: none;
  }
  .navigation__label--small {
    display: flex;
    justify-content: space-between;
  }
  .navigation__label--default {
    display: flex;
  }
  .navigation__lesson {
    user-select: none;
    cursor: pointer;
    position: relative;
    padding: 15px 17px;
    display: flex;
    background: #ffffff;
    &.lesson--block {
      opacity: 0.3;
    }
    .lesson__label {
      display: flex;
    }
    .lesson__resource {
      margin-right: 10px;
    }
    .lesson__vertical-line {
      position: absolute;
      width: 2px;
      background-color: #d2d3db;
      height: calc(100% - 14px);
      top: calc(16px + 18px);
      left: calc(17px + 7px);
      z-index: 1;
    }
  }

  .navigation__lesson:last-child {
    .lesson__vertical-line {
      height: 0;
    }
  }
  .lesson__status {
    margin-right: 10px;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .element.collapsible .collapsible__action-row .collapsible__title {
  padding: 16px;
  background-color: #f2f0f1;
  margin-bottom: 0;
}
</style>
