<template>
  <div class="row schedule" :data-day="day">
    <div class="col-sm-5">
      <input type="time" class="form-control schedule-start" :value="start" />
      <small class="form-text text-muted">Opening/starting at. Example: <strong>09:00</strong></small>
    </div>
    <div class="col-sm-5">
      <input type="time" class="form-control schedule-end" :value="end" />
      <small class="form-text text-muted">Closing/ending at. Example: <strong>21:00</strong></small>
    </div>
    <div class="col-sm-2">
      <button type="button" class="btn btn-danger" @click="removeEntry(id)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'openCloseInputs',
  props: {
    id: Number,
    start: String,
    end: String,
    day: String
  },
  methods: {
    removeEntry (id) {
      this.$emit('removeEntry', id)
    }
  },
}
</script>
