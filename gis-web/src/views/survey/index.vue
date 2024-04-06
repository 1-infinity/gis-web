<template>
  <div>
<!--    <div style="margin-top: 15%; font-size: 40px;color: #888888;text-align: center">敬请期待....</div>-->
    <div style="width: 100%;height: 100vh">
      <iframe :src="url" style="width: 100%;height: 100vh;"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: [""],
  components: {},
  data() {
    return {
      url: ''
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.createUrl()
  },
  methods: {
    createUrl() {
      this.url = window.location.origin + process.env['VUE_APP_BASE_API_X']
      this.$forceUpdate()

    }
  },
};
</script>

<style scoped lang="less"></style>
