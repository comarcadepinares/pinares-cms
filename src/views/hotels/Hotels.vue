<template>
    <div v-if="hotels">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Hotels</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/hotel/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="hotels && hotels.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
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
                    <tr v-for="hotel in hotels" :key="hotel.id">
                        <th>{{hotel.id}}</th>
                        <td><img :src="hotel.image" width="100px"></td>
                        <td>{{hotel.name}}</td>
                        <td>{{hotel.type}}</td>
                        <td :title="hotel.description">{{hotel.description.substring(0, 10)}}</td>
                        <td>{{hotel.location.type}}: {{hotel.location.coordinates}}</td>
                        <td>{{hotel.address}}</td>
                        <td>{{hotel.phone}}</td>
                        <td>{{hotel.email}}</td>
                        <td>{{hotel.web}}</td>
                        <td>
                          <router-link :to="{ name: 'HotelEdit', params: { slug: hotel.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have hotel</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'hotel',
  created () {
    ws.request('get', '/hotel', null, this.token)
      .then((response) => {
        this.$store.commit('setHotels', response.hotels)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    hotels () {
      if (this.$store.state.user.role == 'SuperAdmin') {
        return this.$store.state.hotels
      } else {
        return this.$store.state.hotels.filter(hotel => hotel.userId === this.$store.state.user.id)
      }
    }
  },
  methods: {

  }
}
</script>
