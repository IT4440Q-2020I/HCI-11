<template>
  <div class="template learning">
    <v-navigation-drawer
      class="learning__menu--out"
      style="box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.16); transition-property: transform, min-width, width;"
      :mini-variant="isShow"
      mini-variant-width="88"
      :width="280"
      :mobile-breakpoint="600"
      :style="{
        'min-width': isShow ? '88px' : '280px',
        height: `calc(100vh - ${reducedHeight}px)`,
      }"
      permanent
    >
      <slot name="sidebar" :toggle="toggle" :theme="{ primaryColor }" :is-mini="isShow"></slot>
    </v-navigation-drawer>
    <v-navigation-drawer
      class="learning__menu--mobile"
      width="600"
      stateless
      absolute
      :value="learningMobile"
    >
      <slot name="sidebar-mobile" :toggleSidebarMobile="toggleMobile" :theme="{ primaryColor }"></slot>
    </v-navigation-drawer>
    <div :style="`max-height: calc(100vh - ${reducedHeight}px); width: 1px; flex: 1`">
      <div class="learning__header">
        <div class="learning__header--left">
          <slot
            :openRightSideBar="openRightSideBar"
            :closeRightSideBar="closeRightSideBar"
            :is-mini="isShow"
            :theme="{ primaryColor }"
            :toggleSidebarMobile="toggleMobile"
            :toggleOverlayRightSidebar="toggleOverlayRightSidebar"
            name="learning__header--left"
          ></slot>
        </div>
        <div class="learning__header--right">
          <slot
            :theme="{ primaryColor }"
            :openRightSideBar="openRightSideBar"
            :closeRightSideBar="closeRightSideBar"
            :toggleOverlayRightSidebar="toggleOverlayRightSidebar"
            name="learning__header--right"
            :overlayRightSidebar="overlayRightSidebar"
          ></slot>
        </div>
      </div>
      <div :style="`height: calc(100vh - 60px - ${reducedHeight}px); position: relative`">
        <div
          style="transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) all; height: 100%;"
          :class="{ 'learning__content--is-shrink': overlayRightSidebar }"
        >
          <slot
            :openRightSideBar="openRightSideBar"
            :closeRightSideBar="closeRightSideBar"
            :toggleOverlayRightSidebar="toggleOverlayRightSidebar"
            :theme="{ primaryColor }"
            :is-mini="isShow"
          ></slot>
        </div>

        <v-navigation-drawer
          style="box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.16); height: 100%; flex: none; background-color: #F8F8F8;"
          right
          :width="280"
          absolute
          v-model="overlayRightSidebar"
        >
          <slot
            name="overlay-right-sidebar"
            :openRightSideBar="openRightSideBar"
            :closeRightSideBar="closeRightSideBar"
            :toggleOverlayRightSidebar="toggleOverlayRightSidebar"
            :theme="{ primaryColor }"
          ></slot>
        </v-navigation-drawer>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    reducedHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      learningMobile: true,
      isShow: false,
      overlayRightSidebar: false,
    }
  },
  computed: {
    primaryColor() {
      return this.$themeData.color_primary
    },
  },
  methods: {
    toggle() {
      this.isShow = !this.isShow
    },
    toggleMobile() {
      this.learningMobile = !this.learningMobile
    },
    openRightSideBar() {
      this.overlayRightSidebar = true
    },
    closeRightSideBar() {
      this.overlayRightSidebar = false
    },
    toggleOverlayRightSidebar() {
      this.overlayRightSidebar = !this.overlayRightSidebar
    },
  },
}
</script>
<style lang="scss" scoped>
.template.learning {
  display: flex;
  overflow: hidden;
  position: relative;
  .learning__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 4;
    min-height: 55px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.16);
    background: '#fff';
    top: 0;
    height: fit-content;
  }
  .v-navigation-drawer__border {
    display: none !important;
  }
  .learning__content--is-shrink {
    padding-right: 280px;
  }
}
.learning__menu--mobile {
  display: none;
}
@media screen and (max-width: 900px) {
  .learning__content--is-shrink {
    padding-right: 0 !important;
  }
}
@media screen and (max-width: 600px) {
  aside.v-navigation-drawer.learning__menu--out {
    display: none;
  }
  .learning__menu--mobile {
    display: inherit;
  }
  aside.v-navigation-drawer.overlay-right-sidebar {
    display: inherit;
  }
}
</style>