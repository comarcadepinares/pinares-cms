<template>
    <div v-if="towns">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Towns</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/towns/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="towns && towns.length">
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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="town in towns" :key="town.id">
                        <th>{{town.id}}</th>
                        <td><img :src="town.image" width="100px"></td>
                        <td>{{town.name}}</td>
                        <td :title="town.description">{{town.description.substring(0, 10)}}</td>
                        <td>{{town.location.type}}: {{town.location.coordinates}}</td>
                        <td>{{town.address}}</td>
                        <td>{{town.phone}}</td>
                        <td>{{town.email}}</td>
                        <td>{{town.web}}</td>
                        <td>
                          <router-link :to="{ name: 'TownEdit', params: { slug: town.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have towns</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'towns',
  created () {
    ws.request('get', '/town', null, this.token)
      .then((response) => {
        this.$store.commit('setTowns', response.towns)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    towns () {
      return this.$store.state.towns
    }
  },
  methods: {

  }
}
</script>
