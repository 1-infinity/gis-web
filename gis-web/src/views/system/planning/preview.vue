<template>
  <el-dialog title="预览"
             :visible.sync="visible"
             width="1024px"
             append-to-body>
    <img style="width:100%;" :src="record.url">
  </el-dialog>
</template>

<script>
export default {
  name: 'preview',
  data() {
    return {
      visible: false,
      record: {}
    }
  },
  methods: {
    init(record) {
      this.record = record
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
