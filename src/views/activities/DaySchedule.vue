<template>
  <div>
    <div v-if="entries.length">
      <OpenCloseInputs
        v-for="entry in entries" :key="entry.id"
        :id="entry.id"
        :start="entry.start"
        :end="entry.end"
        :day="day"
        @removeEntry="removeEntry"
      ></OpenCloseInputs>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <p>Closed or using different options</p>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-12">
        <button type="button" class="btn btn-primary" v-on:click="addEntry">Add</button>
      </div>
    </div>
    <br>
    <hr>
  </div>
</template>

<script>
import OpenCloseInputs from './OpenCloseInputs'

export default {
  name: 'daySchedule',
  props: {
    daySchedule: Array,
    day: String
  },
  data () {
    return {
      entries: [],
      counter: 0
    }
  },
  created () {
    if (this.daySchedule && this.daySchedule.length) {
      this.entries = this.daySchedule.map(s => {
        return { id: this.counter++, start: s[0], end: s[1] }
      })
    }

    this.entries.push([{ id: this.counter++, start: '', end: '' }])
  },
  methods: {
    addEntry () {
      this.entries.push({ id: this.counter++, start: '', end: '' })
    },
    removeEntry (id) {
      this.entries = this.entries.filter(e => e.id !== id)
    }
  },
  components: {
    OpenCloseInputs
  },
}
</script>
