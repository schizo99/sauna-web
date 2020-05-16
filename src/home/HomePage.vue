<template>
  <div class="home">
    <div class="temp">
      Current temp: <span
        v-if="temp"
        v-bind:style="{color: color}">
        {{ temp.last / 100 }} &#8451;
      </span>
    </div>
    <div style="color: white;">
      Last update:
      <span v-if="temp">
        {{ temp.time | moment("YYYY-MM-DD HH:mm:ss") }}
      </span>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      color: 'yellow',
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
        if (this.temp.last < 5000) this.color = 'yellow';
        else if (this.temp.last < 8000) this.color = 'orange';
        else this.color = 'red';
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
.home {
  padding: 30px;
  background-color: #555;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.temp {
  font-size: 24px;
  color: white;
}
</style>
