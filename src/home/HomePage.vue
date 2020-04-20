<template>
  <div class="home">
  <div class="temp">
    Current temp: <span v-if="temp">{{ temp }} &#8451;</span>
  </div>
  <div>
    <router-link to="/graph">Graph</router-link>
  </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      focused: true,
      temp: null,
    };
  },
  created() {
    window.addEventListener('focus', () => { this.focused = true; });
    window.addEventListener('blur', () => { this.focused = false; });

    this.time();
  },
  methods: {
    async time() {
      if (this.focused) {
        this.temp = await this.getTemp();
      }
      setTimeout(this.time, 5000);
    },
    getTemp() {
      return axios.get('/api/temp').then(
        (result) => result.data.last / 100,
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.temp {
  font-size: 24px;
}
</style>
