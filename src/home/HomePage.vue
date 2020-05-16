<template>
  <div class="home">
  <div class="temp">
    Current temp: <span v-if="temp">{{ temp.last / 100 }} &#8451;</span>
  </div>
  <div>
    Last update:
    <span v-if="temp">
      {{ temp.time | moment("YYYY-MM-DD HH:mm:ss") }}
    </span>
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
    window.addEventListener('focus', async () => {
      this.focused = true;
      this.temp = await this.getTemp();
    });
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
        (result) => result.data[0]
        ,
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
