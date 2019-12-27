<template>
  <div>
    <h2>welcome! <span>{{name}}</span></h2>
  </div>
</template>

<script>
  export default {
    name: "Welcome",
    data() {
      return {
        name: ''
      }
    },
    created() {
      this.name = sessionStorage.getItem('name');
    }
  }
</script>

<style scoped>
  span {
    color: orangered;
  }

</style>
