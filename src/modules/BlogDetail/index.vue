<template>
  <MainLayout :has-dark-theme="false">
    <BlogDetail :blog="blog" />
  </MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
  components: {
    MainLayout
  },
  async created() {
    const id = this.$route.params.id
    await this.fetchBlog(id)
  },
  methods: {
    ...mapActions({
      fetchBlog: 'blog/fetchBlog'
    }),

  },
  computed: {
    ...mapGetters({
      blog: 'blog/getOne'
    })
  }
}
</script>
