<template>
    <div v-if="activityTypes">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Activity Types</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/activity-types/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="activityTypes && activityTypes.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="activityType in activityTypes" :key="activityType.id">
                        <th>{{activityType.id}}</th>
                        <td><img :src="activityType.image" width="100px"></td>
                        <td>{{activityType.name}}</td>
                        <td :title="activityType.description">{{activityType.description.substring(0, 10)}}</td>
                        <td>
                          <router-link :to="{ name: 'ActivityTypeEdit', params: { slug: activityType.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have activityTypes</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'activityTypes',
  created () {
    ws.request('get', '/activity-type', null, this.token)
      .then((response) => {
        this.$store.commit('setActivityType', response.activityTypes)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    activityTypes () {
      return this.$store.state.activityTypes
    }
  },
  methods: {

  }
}
</script>
