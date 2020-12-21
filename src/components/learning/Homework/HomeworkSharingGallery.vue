<template>
	<div class="gallery-container pa-6 full-height full-width d-none" :class="{'d-block': isModalOpened}">
		<v-row no-gutters style="height:5%;">
			<v-col cols="12" class="d-flex justify-end">
        <v-icon class="white--text" @click="closeModal">mdi-close</v-icon>
      </v-col>
		</v-row>
		<v-row no-gutters class="mb-5" style="height:70%;">
			<v-col cols="12" class="d-flex justify-space-between full-height">
        <v-icon class="white--text" @click="prevImage">mdi-chevron-left</v-icon>
        <ElementLoading v-if="loading" color="primary" />
        <img v-else :src="currentImage" class="gallery--image full-height rounded"/>
        <v-icon class="white--text" @click="nextImage">mdi-chevron-right</v-icon>
      </v-col>
		</v-row>
		<v-row no-gutters style="height:20%;" class="d-flex align-end">
      <v-col cols="12" class="d-flex justify-space-around">
        <img 
          v-for="(image, index) in listImages" 
          :key="index" :src="image" 
          class="gallery-footer--image gallery--image rounded cursor-pointer" 
          :class="{'image--active': index === currentIndex}"
          @click="() => changeCurrentImageByFooterImage(index)"
        />
      </v-col>
		</v-row>
	</div>
</template>
<script>
export default {
  data() {
    return {
      isModalOpened: false,
      listImages: [],
      currentIndex: 0,
      loading: false,
    }
  },
  computed: {
    currentImage() {
      return this.listImages[this.currentIndex] || ''
    },
  },
  methods: {
    openModal(listImages, index = 0) {
      this.isModalOpened = true
      this.listImages = listImages
      this.currentIndex = index
    },
    closeModal() {
      this.isModalOpened = false
      this.listImages = []
      this.currentIndex = 0
    },
    nextImage() {
      const imagesLength = this.listImages.length
      if (this.currentIndex + 1 >= imagesLength) this.currentIndex = 0
      else this.currentIndex += 1
    },
    prevImage() {
      const imagesLength = this.listImages.length
      if (this.currentIndex - 1 <= -1) this.currentIndex = imagesLength - 1
      else this.currentIndex -= 1
    },
    changeCurrentImageByFooterImage(index) {
      this.currentIndex = index
    },
  },
}
</script>
<style lang="scss" scoped>
.gallery-container {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: #30302EF9; //000000CA
}
.gallery--image {
  border: 1px solid white;
}
.gallery-footer--image {
  max-height: 127px;
  max-width: 127px;
  opacity: 0.4;
  object-fit: cover;
}
.image--active {
  opacity: 1;
}
</style>