<template>
  <div>
    <div v-if="activity">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Activity '{{activity.name}}' options</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link :to="{ name:'ActivityOptionCreate', params: { slug: activity.slug } }" class="btn btn-primary float-right">Create option</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="activityOption && activityOption.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Schedule</th>
                        <th scope="col">Price</th>
                        <th scope="col">Price type</th>
                        <th scope="col">Location</th>
                        <th scope="col">Juorney</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Description</th>
                        <th scope="col">Recomendations</th>
                        <th scope="col">People</th>
                        <th scope="col">Pax (min - max)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="activityOption in activityOption" :key="activityOption.id">
                        <th>{{activityOption.id}}</th>
                        <td v-html="scheduleToString(activityOption.schedule)"></td>
                        <td>{{activityOption.price}} {{activityOption.currency}}</td>
                        <td>{{activityOption.priceType}}</td>
                        <td>{{ geomToString(activityOption.location) }}</td>
                        <td>{{ geomToString(activityOption.journey) }}</td>
                        <td>{{activityOption.duration}}</td>
                        <td :title="activityOption.description">{{summarized(activityOption.description, 10)}}</td>
                        <td :title="activityOption.recomendations">{{summarized(activityOption.recomendations, 10)}}</td>
                        <td>{{ peopleToString(activityOption.people) }}</td>
                        <td>{{activityOption.minPax}} - {{activityOption.maxPax}}</td>
                        <td>
                          <router-link :to="{ name: 'ActivityOptionEdit', params: { slug: activity.slug, id: activityOption.id }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>Activity '{{activity.name}}' doesn't have any option</p>
    </div>
    <p v-else> have any option</p>
  </div>
</template>

<script>
export default {
  name: 'activityOptions',
  data () {
    return {
      activity: null
    }
  },
  created: function () {
    console.log('created')
    this.activity = this.$store.getters.getActivity(this.$route.params.slug)

    if (!this.activity) {
      this.$router.push('/')
    }

    if (!this.activityOption && this.$route.params.id) {
      this.activityOption = this.activity.options.find(op => op.id === this.$route.params.id)
    }
  },
  computed: {
    computedActivity() {
      return this.$store.getters.getActivity(this.$route.params.slug)
    },

    activityOption () {
      return this.computedActivity.options
    }
  },
  methods: {
    summarized (string, end) {
      if (string && string.length > end) {
        return string.substring(0, end)
      } else {
        return string
      }
    },

    geomToString (geom) {
      if (geom) {
        return `${geom.type}`
      }
    },

    scheduleToString (schedule) {
      let str = ''
      for (const day in schedule) {
        str += this.scheduleDayToString(day, schedule[day])
      }
      return str
    },

    scheduleDayToString (day, hours) {
      if (!hours || !hours.length) {
        return `<p>${day}: <strong>Closed</strong></p>`
      }

      return `<p>${day}: <strong>${hours.map(h => h.join(' - ')).join('<br>')}</strong></p>`
    },

    peopleToString (people) {
      if (people) {
        if (people.length == 4) {
          return 'All'
        }

        return people.join(', ')
      }
    }
  }
}
</script>
