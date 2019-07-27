<template>
  <div class="col-md-8 offset-md-2">
    <h2>Create town</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="town" :value="town.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="town" :value="town.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="town.image" width="100px" v-if="town">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Latitude</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="latitude" v-if="town" :value="town.location.coordinates[0]" />
          <input type="number" class="form-control" id="latitude" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Longitude</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="longitude" v-if="town" :value="town.location.coordinates[1]" />
          <input type="number" class="form-control" id="longitude" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" v-if="town" :value="town.address" />
          <input type="text" class="form-control" id="address" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-if="town" :value="town.phone" />
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" v-if="town" :value="town.email" />
          <input type="email" class="form-control" id="email" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" v-if="town" :value="town.web" />
          <input type="text" class="form-control" id="web" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="town">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editTown">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeTown">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createTown" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'town',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      town: null,
      file: null
    }
  },
  created: function () {
    if (!this.town && this.$route.params.slug) {
      this.town = this.$store.getters.getTown(this.$route.params.slug)
      console.log(this.town)
    }

    return this.town
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
    createTown (event) {
      event.preventDefault()

      const town = this.getTownFromForm()

      ws.request('post', '/town', town, this.token)
        .then(response => {
          this.$store.commit('addTown', response)
          this.$router.push('/towns')
        })
        .catch(error => {
          this.error = true
          this.errorMessage = error
        })
    },

    editTown (event) {
      event.preventDefault()

      const town = this.getTownFromForm()

      ws.request('put', `/town/${this.town.slug}`, town, this.token)
        .then(response => {
          this.$store.commit('updateTown', response)
          this.$router.push('/towns')
        })
        .catch(error => {
          this.error = true
          this.errorMessage = error
        })
    },

    removeTown (event) {
      event.preventDefault()

      ws.request('delete', `/town/${this.town.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeTown', this.town)
          this.$router.push('/towns')
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

    getTownFromForm () {
      const town = new FormData()
      town.append('name', $('#name').val())
      town.append('description', $('#description').val())
      town.append('latitude', Number($('#latitude').val()))
      town.append('longitude', Number($('#longitude').val()))
      town.append('address', $('#address').val())
      town.append('phone', Number($('#phone').val()))
      town.append('email', $('#email').val())
      town.append('web', $('#web').val())

      if (this.file) {
        town.append('image', this.file)
      } else if (this.town && this.town.image) {
        town.append('image', this.town.image)
      }

      const validation = this.validate(town)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation
        return
      }

      return town
    },

    validate (town) {
      const name = town.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = town.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const address = town.get('address')
      if (!address || typeof address !== 'string' || address.length > 128) {
        return Error('Address is required, 128 characters or less')
      }

      const phone = town.get('phone')
      if (!phone || isNaN(phone) || phone < 600000000 || phone > 999999999) {
        return Error('Phone is required. It should be 9 digits number.')
      }

      const email = town.get('email')
      if (!email || typeof email !== 'string' || email.length > 128 || !email.includes('@') || !email.includes('.')) {
        return Error('Email is required')
      }

      const web = town.get('web')
      if (!web || typeof web !== 'string' || web.length > 128 || !(web.startsWith('https://') || web.startsWith('http://'))) {
        return Error('Web is required and should start with "https://" or "http://"')
      }

      const latitude = town.get('latitude')
      const longitude = town.get('longitude')
      if (!latitude || isNaN(latitude) || !longitude || isNaN(longitude)) {
        return Error('Latitude and Longitude are required')
      }
      town.delete('latitude')
      town.delete('longitude')
      town.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [latitude, longitude]
      }))

      const image = town.get('image')
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
