<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="restaurant">Edit restaurant</h2>
    <h2 v-else>Create restaurant</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Town</label>
        <div class="col-sm-10">
          <select class="form-control" id="town">
            <option v-for="town in towns" :key="town.id" :value="town.id" :selected="restaurant && restaurant.townId == town.id">{{town.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="restaurant" :value="restaurant.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="restaurant" :value="restaurant.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="restaurant.image" width="100px" v-if="restaurant">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Location (gepoint)</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="location" v-if="restaurant" :value="JSON.stringify(restaurant.location)" />
          <textarea type="text" class="form-control" id="location" v-else />
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"Point","coordinates":[-2.931826114654541, 41.954184406468876]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" v-if="restaurant" :value="restaurant.address" />
          <input type="text" class="form-control" id="address" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-if="restaurant" :value="restaurant.phone" />
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" v-if="restaurant" :value="restaurant.email" />
          <input type="email" class="form-control" id="email" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" v-if="restaurant" :value="restaurant.web" />
          <input type="text" class="form-control" id="web" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="restaurant">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editRestaurant">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeRestaurant">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createRestaurant" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'restaurant',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      restaurant: null,
      file: null
    }
  },
  created: function () {
    if (!this.restaurant && this.$route.params.slug) {
      this.restaurant = this.$store.getters.getRestaurant(this.$route.params.slug)
    }

    return this.restaurant
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    token () {
      return this.$store.state.token
    },
    towns () {
      return this.$store.state.towns
    }
  },
  methods: {
    createRestaurant (event) {
      event.preventDefault()

      const restaurant = this.getRestaurantFromForm()
      if (restaurant) {
        ws.request('post', '/restaurant', restaurant, this.token)
          .then(response => {
            this.$store.commit('addRestaurant', response)
            this.$router.push('/restaurants')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editRestaurant (event) {
      event.preventDefault()

      const restaurant = this.getRestaurantFromForm()
      if (restaurant) {
        ws.request('put', `/restaurant/${this.restaurant.slug}`, restaurant, this.token)
          .then(response => {
            this.$store.commit('updateRestaurant', response)
            this.$router.push('/restaurants')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeRestaurant (event) {
      event.preventDefault()

      ws.request('delete', `/restaurant/${this.restaurant.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeRestaurant', this.restaurant)
          this.$router.push('/restaurants')
        })
        .catch(error => {
          this.error = true
          this.errorMessage = error
        })
    },

    onFileChange (event) {
      const files = event.target.files
      this.file = files && files.length ? files[0] : null
    },

    getRestaurantFromForm () {
      const restaurant = new FormData()
      restaurant.append('townId', $('#town').val())
      restaurant.append('type', $('#type').val())
      restaurant.append('name', $('#name').val().trim())
      restaurant.append('description', $('#description').val().trim())
      restaurant.append('location', $('#location').val().trim())
      restaurant.append('address', $('#address').val().trim())
      restaurant.append('phone', Number($('#phone').val().trim()))
      restaurant.append('email', $('#email').val().trim())
      restaurant.append('web', $('#web').val().trim())

      if (this.file) {
        restaurant.append('image', this.file)
      } else if (this.restaurant && this.restaurant.image) {
        restaurant.append('image', this.restaurant.image)
      }

      const validation = this.validate(restaurant)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation
        return
      }

      return restaurant
    },

    validate (restaurant) {
      const town = restaurant.get('townId')
      if (!town) {
        return Error('Town is required')
      }

      const type = restaurant.get('type')
      if (!type) {
        return Error('Type is required')
      }

      const name = restaurant.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = restaurant.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const address = restaurant.get('address')
      if (!address || typeof address !== 'string' || address.length > 128) {
        return Error('Address is required, 128 characters or less')
      }

      const phone = restaurant.get('phone')
      if (!phone || isNaN(phone) || phone < 600000000 || phone > 999999999) {
        return Error('Phone is required. It should be 9 digits number.')
      }

      const email = restaurant.get('email')
      if (!email || typeof email !== 'string' || email.length > 128 || !email.includes('@') || !email.includes('.')) {
        return Error('Email is required')
      }

      const web = restaurant.get('web')
      if (!web || typeof web !== 'string' || web.length > 128 || !(web.startsWith('https://') || web.startsWith('http://'))) {
        return Error('Web is required and should start with "https://" or "http://"')
      }

      let location
      try {
        location = JSON.parse(restaurant.get('location'))
      } catch (error) {
        return Error('Invalid location')
      }
      if (!location ||
          !location.type || location.type !== 'Point' ||
          !location.coordinates || location.coordinates.length !== 2 ||
          isNaN(Number(location.coordinates[0])) || isNaN(Number(location.coordinates[1]))
      ) {
        return Error('Location is required')
      }

      const image = restaurant.get('image')
      if (!image) {
        return Error('Image is required')
      }

      return true
    }
  },
  components: {
    Alert
  }
}
</script>
