<template>
    <div v-if="restaurants">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-sm-6">
                    <h4>Restaurants</h4>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <router-link to="/restaurant/create" class="btn btn-primary float-right">Create</router-link>
                </div>
            </div>
        </div>

        <hr>

        <div class="row" v-if="restaurants && restaurants.length">
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
                    <tr v-for="restaurant in restaurants" :key="restaurant.id">
                        <th>{{restaurant.id}}</th>
                        <td><img :src="restaurant.image" width="100px"></td>
                        <td>{{restaurant.name}}</td>
                        <td :title="restaurant.description">{{restaurant.description.substring(0, 10)}}</td>
                        <td>{{restaurant.location.type}}: {{restaurant.location.coordinates}}</td>
                        <td>{{restaurant.address}}</td>
                        <td>{{restaurant.phone}}</td>
                        <td>{{restaurant.email}}</td>
                        <td>{{restaurant.web}}</td>
                        <td>
                          <router-link :to="{ name: 'RestaurantEdit', params: { slug: restaurant.slug }}" class="btn btn-primary float-right">Edit</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else>You don't have restaurant</p>
    </div>
</template>

<script>
import ws from '@/services/webservice'

export default {
  name: 'restaurant',
  created () {
    ws.request('get', '/restaurant', null, this.token)
      .then((response) => {
        this.$store.commit('setRestaurants', response.restaurants)
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    restaurants () {
      if (this.$store.state.user.role == 'SuperAdmin') {
        return this.$store.state.restaurants
      } else {
        return this.$store.state.restaurants.filter(restaurant => restaurant.userId === this.$store.state.user.id)
      }
    }
  },
  methods: {

  }
}
</script>
