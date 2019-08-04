<template>
    <div v-if="activities">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Activities</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/activity/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="activities && activities.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Location</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Web</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="activity in activities" :key="activity.id">
                        <th>{{activity.id}}</th>
                        <td><img :src="activity.image" width="100px"></td>
                        <td>{{activity.name}}</td>
                        <td :title="activity.description">{{activity.description.substring(0, 10)}}</td>
                        <td>{{activity.location.type}}: {{activity.location.coordinates}}</td>
                        <td>{{activity.address}}</td>
                        <td>{{activity.phone}}</td>
                        <td>{{activity.email}}</td>
                        <td>{{activity.web}}</td>
                        <td>
                          <router-link :to="{ name: 'ActivityOptions', params: { slug: activity.slug }}" class="btn btn-secondary float-right">Configure</router-link>
                        </td>
                        <td>
                          <router-link :to="{ name: 'ActivityEdit', params: { slug: activity.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have any activities</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'activity',
  data: function () {
    return {
      activity: {}
    }
  },
  created () {
    ws.request('get', '/activity', null, this.token)
      .then((response) => {
        this.$store.commit('setActivities', response.activities)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    activities () {
      if (this.$store.state.user.role === 'SuperAdmin') {
        return this.$store.state.activities
      } else {
        return this.$store.state.activities.filter(activity => activity.userId === this.$store.state.user.id)
      }
    }
  }
}
</script>
