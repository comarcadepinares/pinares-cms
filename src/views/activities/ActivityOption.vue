<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="activityOption">Edit activity option</h2>
    <h2 v-else>Create activity option</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Schedule</label>
        <div class="col-sm-10">
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Monday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.monday" day="monday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="monday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Tuesday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.tuesday" day="tuesday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="tuesday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Wednesday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.wednesday" day="wednesday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="wednesday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Thursday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.thursday" day="thursday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="thursday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Friday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.friday" day="friday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="friday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Saturday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.saturday" day="saturday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="saturday" v-else></DaySchedule>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Sunday</label>
            <div class="col-sm-10">
              <DaySchedule :daySchedule="activityOption.schedule.sunday" day="sunday" v-if="activityOption"></DaySchedule>
              <DaySchedule :daySchedule="[]" day="sunday" v-else></DaySchedule>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Price</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="price" v-if="activityOption" :value="activityOption.price" />
          <input type="number" class="form-control" id="price" v-else />
          <small class="form-text text-muted">In EUR.</small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Price by number of people</label>
        <div class="col-sm-10">
          <div class="form-check">
            <input class="form-check-input priceType" name="priceType" type="radio" value="1" :checked="!activityOption || (activityOption && activityOption.priceType == 1)">
            <label class="form-check-label">
              By person
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input priceType" name="priceType" type="radio" value="2" :checked="activityOption && activityOption.priceType == 2">
            <label class="form-check-label">
              By 2 people
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input priceType" name="priceType" type="radio" value="0" :checked="activityOption && activityOption.priceType == 0">
            <label class="form-check-label">
              All included
            </label>
          </div>
        </div>
      </div>

      <br>
      <h3>More options</h3>
      <hr><br>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Location (Point)</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="location" v-if="activityOption && activityOption.location" :value="JSON.stringify(activityOption.location)" />
          <textarea type="text" class="form-control" id="location" v-else />
          <small class="form-text text-muted">Use it if you want to overwrite the activity location</small>
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"Point","coordinates":[-2.931826114654541, 41.954184406468876]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Journey (LineString)</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="journey" v-if="activityOption && activityOption.journey" :value="JSON.stringify(activityOption.journey)" />
          <textarea type="text" class="form-control" id="journey" v-else />
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"LineString","coordinates":[ [-2.931901216506958, 41.95319502548054],[-2.9316866397857666, 41.953139172869996],[-2.931579351425171, 41.954056745268836] ]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Duration</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="duration" v-if="activityOption" :value="activityOption.duration" />
          <input type="number" class="form-control" id="duration" v-else />
          <small class="form-text text-muted">In minutes.</small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="activityOption" :value="activityOption.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Recomendations</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="recomendations" v-if="activityOption" :value="activityOption.recomendations" />
          <textarea type="text" class="form-control" id="recomendations" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Type of public</label>
        <div class="col-sm-10">
          <div class="form-group form-check" v-for="people_type in people_types" :key="people_type">
            <input type="checkbox" class="form-check-input people" :id="people_type" :checked="!activityOption || (activityOption && (!activityOption.people || !activityOption.people.length || activityOption.people.includes(people_type)))">
            <label class="form-check-label" :for="people_type">{{people_type}}</label>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">min pax</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="minPax" v-if="activityOption" :value="activityOption.minPax" />
          <input type="number" class="form-control" id="minPax" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">max pax</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="maxPax" v-if="activityOption" :value="activityOption.maxPax" />
          <input type="number" class="form-control" id="maxPax" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="activityOption">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editActivityOption">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeActivityOption">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createActivityOption" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
import DaySchedule from './DaySchedule'

export default {
  name: 'activityOption',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      activity: null,
      activityOption: null,
      people_types: [
        'children',
        'young',
        'adult',
        'old'
      ]
    }
  },
  created: function () {
    this.activity = this.$store.getters.getActivity(this.$route.params.slug)

    if (!this.activity) {
      this.$router.push('/')
    }

    if (!this.activityOption && this.$route.params.id) {
      this.activityOption = this.activity.options.find(op => op.id === parseInt(this.$route.params.id))
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    token () {
      return this.$store.state.token
    }
  },
  methods: {
    createActivityOption (event) {
      event.preventDefault()

      const activityOption = this.getActivityOptionFromForm()
      if (activityOption) {
        ws.request('post', `/activity/${this.activity.slug}/option`, activityOption, this.token)
          .then(response => {
            this.activity.options.push(response)
            this.$store.commit('updateActivity', this.activity)
            this.$router.push(`/activity/${this.activity.slug}/options`)
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editActivityOption (event) {
      event.preventDefault()

      const activityOption = this.getActivityOptionFromForm()
      if (activityOption) {
        ws.request('put', `/activity/${this.activity.slug}/option/${this.activityOption.id}`, activityOption, this.token)
          .then(response => {
            this.activity.options = this.activity.options.filter(ao => ao.id !== response.id)
            this.activity.options.push(response)
            this.$store.commit('updateActivity', this.activity)
            this.$router.push(`/activity/${this.activity.slug}/options`)
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeActivityOption (event) {
      event.preventDefault()

      ws.request('delete', `/activity/${this.activity.slug}/option/${this.activityOption.id}`, this.token)
        .then(response => {
          this.activity.options = this.activity.options.filter(ao => ao.id !== response.id)
          this.$store.commit('updateActivity', this.activity)
          this.$router.push(`/activity/${this.activity.slug}/options`)
        })
        .catch(error => {
          this.error = true
          this.errorMessage = error
        })
    },

    getActivityOptionFromForm () {
      const activityOption = new FormData()

      const schedule = this.getSchedule()
      if (schedule) {
        activityOption.append('schedule', schedule)
      }
      activityOption.append('price', parseFloat($('#price').val()))
      activityOption.append('priceType', parseInt($('.priceType:checked').val() || 1))
      activityOption.append('location', $('#location').val().trim())
      activityOption.append('journey', $('#journey').val().trim())
      if (!isNaN(parseInt($('#duration').val()))) {
        activityOption.append('duration', parseInt($('#duration').val()))
      }
      activityOption.append('description', $('#description').val().trim())
      activityOption.append('recomendations', $('#recomendations').val().trim())
      activityOption.append('people', this.getPeople())
      if (!isNaN(parseInt($('#minPax').val()))) {
        activityOption.append('minPax', parseInt($('#minPax').val()))
      }
      if (!isNaN(parseInt($('#maxPax').val()))) {
        activityOption.append('maxPax', parseInt($('#maxPax').val()))
      }
      const validation = this.validate(activityOption)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation.message
        return
      }

      var activityOptionJSON = {};
      activityOption.forEach(function(value, key){
        activityOptionJSON[key] = value;
      });

      return activityOptionJSON
    },

    getSchedule () {
      const schedule = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
      }

      const days = Object.keys(schedule)

      let count = 0
      const entries = $('.schedule')
      entries.each( (_, entry) => {
        const el = $(entry)
        const day = el.data('day')
        const start = el.find('.schedule-start').val()
        const end = el.find('.schedule-end').val()
        if (day && day != '' && days.includes(day) && start && start != '' && end && end != '') {
          schedule[day].push([start, end])
          count++
        }
      })

      if (count > 0) {
        return JSON.stringify(schedule)
      }
    },

    getPeople () {
      const entries = $('.people:checked')
      if (!entries || !entries.length) {
        return this.people_types
      } else {
        const people = []
        this.people_types.forEach(id => {
          if ($(`#${id}`).is(":checked")) {
            people.push(id)
          }
        })
        return JSON.stringify(people)
      }
    },

    validate (activityOption) {
      const schedule = activityOption.get('schedule')
      if (!schedule) {
        return Error('Schedule is required. You must add one opening/closing pair at least')
      }

      const price = activityOption.get('price')
      if (!price || isNaN(price)) {
        return Error('Price is required')
      }

      const priceType = activityOption.get('priceType')
      if (!priceType || isNaN(priceType)) {
        return Error('Price by number of people is required')
      }

      let location = activityOption.get('location')
      if (location) {
        try {
          location = JSON.parse(location)
        } catch (error) {
          return Error('Location is wrong')
        }
        if (!location.type || location.type !== 'Point' ||
            !location.coordinates || location.coordinates.length !== 2 ||
            isNaN(Number(location.coordinates[0])) || isNaN(Number(location.coordinates[1]))
        ) {
          return Error('Location is wrong2')
        }
      } else {
        activityOption.delete('location')
      }

      let journey = activityOption.get('journey')
      if (journey) {
        try {
          journey = JSON.parse(journey)
        } catch (error) {
          return Error('Journey is wrong')
        }
        if (!journey.type || journey.type !== 'LineString' ||
            !journey.coordinates || journey.coordinates.length < 2 ||
            isNaN(Number(journey.coordinates[0][0])) || isNaN(Number(journey.coordinates[0][1]))
        ) {
          return Error('Journey is wrong')
        }
      } else {
        activityOption.delete('journey')
      }

      const duration = activityOption.get('duration')
      if (duration) {
        if (isNaN(duration)) {
          return Error('Duration is wrong')
        }
      } else {
        activityOption.delete('duration')
      }

      const description = activityOption.get('description')
      if (description) {
        if (typeof description !== 'string' || description.length > 512) {
          return Error('Description is wrong, 512 characters or less')
        }
      } else {
        activityOption.delete('description')
      }

      const recomendations = activityOption.get('recomendations')
      if (recomendations) {
        if (typeof recomendations !== 'string' || recomendations.length > 512) {
          return Error('Recomendations is wrong, 512 characters or less')
        }
      } else {
        activityOption.delete('recomendations')
      }

      const minPax = activityOption.get('minPax')
      if (minPax) {
        if (isNaN(minPax)) {
          return Error('Min pax is wrong')
        }
      } else {
        activityOption.delete('minPax')
      }

      const maxPax = activityOption.get('maxPax')
      if (maxPax) {
        if (isNaN(maxPax)) {
          return Error('Max pax is wrong')
        }
      } else {
        activityOption.delete('maxPax')
      }

      return true
    }
  },
  components: {
    Alert,
    DaySchedule
  }
}
</script>
