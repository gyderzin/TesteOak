<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class='d-flex justify-center alert' v-if="alert">
    <v-alert v-model="alert" :type="typeAlert" dense width="95%">
      <span style='font-size: small;'> {{ messageAlert }} </span>
    </v-alert>
  </div>
</template>
<script>
export default {
  props: {
    typeAlert: {
      required: true,
      type: String
    },
    messageAlert: {
      required: true,
      type: String
    },
    alertApp: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    alertApp(newVal) {
      if (newVal == true) this.alert = true
      else this.alert = false
    }
  },
  data() {
    return {
      alert: false
    }
  },
}
</script>
<style lang="css">
.alert {
  position: fixed;
  left: 40%;
  right: 40%;
  bottom: 2%;
  z-index: 1;
}
</style>