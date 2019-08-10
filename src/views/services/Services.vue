<template>
    <div v-if="services">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Services</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/service/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="services && services.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Highlight</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Location</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id">
                        <th>{{service.id}}</th>
                        <td><img :src="service.image" width="100px"></td>
                        <td>{{service.name}}</td>
                        <td>{{service.highlight}}</td>
                        <td>{{service.type}}</td>
                        <td :title="service.description">{{service.description.substring(0, 10)}}</td>
                        <td>{{service.location.type}}: {{service.location.coordinates}}</td>
                        <td>
                          <router-link :to="{ name: 'ServiceEdit', params: { slug: service.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have any service</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'service',
  created () {
    ws.request('get', '/service', null, this.token)
      .then((response) => {
        this.$store.commit('setServices', response.services)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    services () {
      if (this.$store.state.user.role == 'SuperAdmin') {
        return this.$store.state.services
      } else {
        return this.$store.state.services.filter(service => service.userId === this.$store.state.user.id)
      }
    }
  },
  methods: {

  }
}
</script>
