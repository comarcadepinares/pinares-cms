<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="hotel">Edit hotel</h2>
    <h2 v-else>Create hotel</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="hotel" :value="hotel.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Highlight</label>
        <div class="col-sm-10">
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="highlight" :checked="hotel && hotel.highlight">
            <label class="form-check-label" for="highlight">Highlight</label>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Town</label>
        <div class="col-sm-10">
          <select class="form-control" id="town">
            <option v-for="town in towns" :key="town.id" :value="town.id" :selected="hotel && hotel.townId == town.id">{{town.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Type</label>
        <div class="col-sm-10">
          <select class="form-control" id="type">
            <option v-for="type in types" :key="type" :value="type" :selected="hotel && hotel.type == type">{{type}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="hotel" :value="hotel.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="hotel.image" width="100px" v-if="hotel">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Location (gepoint)</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="location" v-if="hotel" :value="JSON.stringify(hotel.location)" />
          <textarea type="text" class="form-control" id="location" v-else />
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"Point","coordinates":[-2.931826114654541, 41.954184406468876]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" v-if="hotel" :value="hotel.address" />
          <input type="text" class="form-control" id="address" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-if="hotel" :value="hotel.phone" />
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" v-if="hotel" :value="hotel.email" />
          <input type="email" class="form-control" id="email" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" v-if="hotel" :value="hotel.web" />
          <input type="text" class="form-control" id="web" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="hotel">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editHotel">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeHotel">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createHotel" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'hotel',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      hotel: null,
      file: null,
      types: [
        'hotel',
        'cottage',
        'hostel',
        'camping'
      ]
    }
  },
  created: function () {
    if (!this.hotel && this.$route.params.slug) {
      this.hotel = this.$store.getters.getHotel(this.$route.params.slug)
    }

    return this.hotel
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
    createHotel (event) {
      event.preventDefault()

      const hotel = this.getHotelFromForm()
      if (hotel) {
        ws.request('post', '/hotel', hotel, this.token)
          .then(response => {
            this.$store.commit('addHotel', response)
            this.$router.push('/hotels')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editHotel (event) {
      event.preventDefault()

      const hotel = this.getHotelFromForm()
      if (hotel) {
        ws.request('put', `/hotel/${this.hotel.slug}`, hotel, this.token)
          .then(response => {
            this.$store.commit('updateHotel', response)
            this.$router.push('/hotels')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeHotel (event) {
      event.preventDefault()

      ws.request('delete', `/hotel/${this.hotel.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeHotel', this.hotel)
          this.$router.push('/hotels')
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

    getHotelFromForm () {
      const hotel = new FormData()
      hotel.append('name', $('#name').val().trim())
      hotel.append('highlight', $('#highlight').is(':checked'))
      hotel.append('townId', $('#town').val())
      hotel.append('type', $('#type').val())
      hotel.append('description', $('#description').val().trim())
      hotel.append('location', $('#location').val().trim())
      hotel.append('address', $('#address').val().trim())
      hotel.append('phone', Number($('#phone').val().trim()))
      hotel.append('email', $('#email').val().trim())
      hotel.append('web', $('#web').val().trim())

      if (this.file) {
        hotel.append('image', this.file)
      } else if (this.hotel && this.hotel.image) {
        hotel.append('image', this.hotel.image)
      }

      const validation = this.validate(hotel)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation.message
        return
      }

      return hotel
    },

    validate (hotel) {
      const town = hotel.get('townId')
      if (!town) {
        return Error('Town is required')
      }

      const type = hotel.get('type')
      if (!type) {
        return Error('Type is required')
      }

      const name = hotel.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = hotel.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const address = hotel.get('address')
      if (!address || typeof address !== 'string' || address.length > 128) {
        return Error('Address is required, 128 characters or less')
      }

      const phone = hotel.get('phone')
      if (phone && phone != '0') {
        if (isNaN(phone) || phone < 600000000 || phone > 999999999) {
          return Error('Phone should be 9 digits number.')
        }
      } else {
        hotel.delete('phone')
      }

      const email = hotel.get('email')
      if (email) {
        if (typeof email !== 'string' || email.length > 128 || !email.includes('@') || !email.includes('.')) {
          return Error('Email is wrong')
        }
      } else {
        hotel.delete('email')
      }

      const web = hotel.get('web')
      if (web) {
        if (typeof web !== 'string' || web.length > 128 || !(web.startsWith('https://') || web.startsWith('http://'))) {
          return Error('Web should start with "https://" or "http://"')
        }
      } else {
        hotel.delete('web')
      }

      let location
      try {
        location = JSON.parse(hotel.get('location'))
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

      const image = hotel.get('image')
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
