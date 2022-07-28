<template>
  <a :title="title1" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title1']
}
</script>

<style>
</style>