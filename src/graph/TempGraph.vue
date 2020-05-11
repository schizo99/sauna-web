<template>
  <div class="chart">
    <div class="slider">
      <vue-slider
        ref="slider"
        v-model="value"
        v-bind="sliderOptions"
        @drag-end="getData()"
      />
      <input type="text"
             v-bind:style="{width: value.toString().length + 'ch'}"
             v-on:input="resizeInput"
             v-on:keyup.enter="getData"
             :value="value"/>  days
    </div>
    <div >
      <LineChart
        v-if="loaded"
        :styles="styles"
        :chart-data="chartdata"
        :options="options"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import VueSlider from 'vue-slider-component';
import LineChart from './Chart.vue';
import 'vue-slider-component/theme/antd.css';


export default {
  name: 'TempGraph',
  components: { LineChart, VueSlider },
  data: () => ({
    value: 1,
    loadHours: 1,
    loaded: false,
    chartdata: null,
    sliderOptions: {
      min: 1,
      dotSize: 14,
      width: 200,
      height: 4,
    },
    styles: {
      height: '300px',
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
          ticks: {
            maxTicksLimit: 10,
            sampleSize: 10,
          },
          time: {
            unit: 'minute',
            stepSize: 3,
            tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
            displayFormats: {
              millisecond: 'HH:mm:ss.SSS',
              second: 'HH:mm:ss',
              minute: 'HH:mm',
              hour: 'HH',
            },
          },
          // round: 'day'
        }],
      },
    },
  }),
  methods: {
    resizeInput(event) {
      const input = event.target;
      input.style.width = `${input.value.length}ch`;
    },
    async getData(event) {
      if (event) {
        const input = event.target;
        this.value = event.target.value;
        if (!this.value > 0) {
          input.style.width = '1ch';
          this.value = 1;
        }
      }
      try {
        if (this.value > 1) this.loadHours = this.value;
        const userlist = await axios.get(`/api/temps/${this.loadHours}`).then((res) => res);
        const data = userlist.data.map((d) => ({ y: d.temp / 100, t: moment(d.time) }));
        this.chartdata = {
          datasets: [{
            spanGaps: true,
            borderColor: 'rgb(75, 192, 192)',
            lineTension: 0.5,
            borderWidth: 4,
            pointBorderWidth: 0.4,
            label: 'Temperature',
            ticks: {
              source: 'labels',
            },
            data,
          }],
        };
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  async mounted() {
    this.loaded = false;
    this.getData();
  },
};
</script>
<style scoped>

input[type=text] {
    padding: 5px;
    border: 1px solid #ccc;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    font-size: .7em;
    outline: none;
}

input[type=text]:focus {
    padding: 4px;
    border:2px solid #aaa;
}

.chart {
  height: 350px;
}
.slider {
  padding-right: 10px;
  float: right;
}
.header-item {
  display: inline-block;
  padding: 5px 10px;
  font-size: 22px;
}
.nav-link {
  text-decoration: none;
  color: inherit;
}
</style>
