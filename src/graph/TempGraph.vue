<template>
  <div class="home" style="position: relative;">
    <div>
      <div >
        <div class="slider"  style="padding-top: 3px;">
          <vue-slider
            ref="slider"
            v-model="value"
            v-bind="sliderOptions"
            @drag-end="getData()"
          />
        </div>
        <div class="slider" style="padding-right: 17px;">
          <input type="text"
                   v-bind:style="{width: value.toString().length + 'ch'}"
                   v-on:input="resizeInput"
                   v-on:keyup.enter="getData"
                   :value="value"/>  days
        </div>
      </div>
      <div style="position: absolute; z-index:1; top: 25px; right:0; padding-top: 30px;">
        <div class="slider"  style="padding-top: 3px;">
          <vue-slider
            ref="hourSlider"
            v-model="hours"
            v-bind="hourSliderOptions"
            @drag-end="zoomHours()"
          />
        </div>
        <div class="slider">
          <input type="text"
                   v-bind:style="{width: hours.toString().length + 'ch'}"
                   v-on:input="resizeInput"
                   v-on:keyup.enter="getData"
                   :value="hours"/> hours
        </div>
      </div>
    </div>
    <div class="chart">
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
    hours: 6,
    previousHours: 6,
    loadHours: 1,
    loaded: false,
    chartdata: null,
    sliderOptions: {
      min: 1,
      max: 100,
      dotSize: 14,
      width: 200,
      height: 4,
    },
    hourSliderOptions: {
      min: 1,
      max: 24,
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
    zoomHours() {
      if (this.value > 1) {
        this.hours = 24;
        this.previousHours = 24;
      }
      if (this.hours > this.previousHours) {
        this.getData();
      }
      this.previousHours = this.hours;
      const now = moment(new Date());
      const newdataset = this.chartdata.datasets[0].data.filter(
        (d) => moment.duration(now.diff(d.t)).asHours() <= this.hours,
      );
      this.chartdata = {
        datasets: [{
          spanGaps: true,
          borderColor: 'rgb(75, 192, 192)',
          lineTension: 0.5,
          borderWidth: 2,
          pointBorderWidth: 0.4,
          pointRadius: 2,
          label: 'Temperature',
          ticks: {
            source: 'labels',
          },
          data: newdataset,
        }],
      };
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
      this.previousHours = this.hours;
      try {
        if (this.value >= 1) this.loadHours = this.value;
        if (this.value > 1) {
          this.hours = 24;
          this.previousHours = 24;
        }
        console.log('loadHours, hours', this.loadHours, this.hours);
        const userlist = await axios.get(`/api/temps/${this.loadHours}/${this.hours}`).then((res) => res);
        const data = userlist.data.map((d) => ({ y: d.temp / 100, t: moment(d.time) }));
        this.chartdata = {
          datasets: [{
            spanGaps: true,
            borderColor: 'rgb(75, 192, 192)',
            lineTension: 0.5,
            borderWidth: 2,
            pointBorderWidth: 0.4,
            pointRadius: 2,
            label: 'Temperature',
            ticks: {
              source: 'labels',
            },

            data,
          }],
        };
        if (this.hours === 1) {
          this.zoomHours();
        }
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
    padding: 2px 5px;
    border: 1px solid #ccc;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    font-size: .7em;
    outline: none;
}

input[type=text]:focus {
    padding: 2px 4px;
    border:2px solid #aaa;
}

.home {
  padding-top: 30px;
  background-color: white;
}

.chart {
  height: 300px;
  padding-top: 50px;
  padding-bottom: 20px;
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
