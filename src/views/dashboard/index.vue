<template>
  <div class="dashboard-container">

    <Card></Card>
    <Sale></Sale>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card/index.vue'
import Sale from '@/views/dashboard/Sale/Sale'

export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
