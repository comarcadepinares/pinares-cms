<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="service">Edit service</h2>
    <h2 v-else>Create service</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Town</label>
        <div class="col-sm-10">
          <select class="form-control" id="town">
            <option v-for="town in towns" :key="town.id" :value="town.id" :selected="service && service.townId == town.id">{{town.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Type</label>
        <div class="col-sm-10">
          <select class="form-control" id="type">
            <option v-for="type in types" :key="type" :value="type" :selected="service && service.type == type">{{type}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="service" :value="service.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="service" :value="service.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="service.image" width="100px" v-if="service">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Location (gepoint)</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="location" v-if="service" :value="JSON.stringify(service.location)" />
          <textarea type="text" class="form-control" id="location" v-else />
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"Point","coordinates":[-2.931826114654541, 41.954184406468876]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" v-if="service" :value="service.address" />
          <input type="text" class="form-control" id="address" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-if="service" :value="service.phone" />
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" v-if="service" :value="service.email" />
          <input type="email" class="form-control" id="email" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" v-if="service" :value="service.web" />
          <input type="text" class="form-control" id="web" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="service">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editService">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeService">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createService" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'service',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      service: null,
      file: null,
      types: [
        'pharmacy',
        'medical center',
        'butchers shop',
        'fish market',
        'market'
      ]
    }
  },
  created: function () {
    if (!this.service && this.$route.params.slug) {
      this.service = this.$store.getters.getService(this.$route.params.slug)
    }

    return this.service
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
    createService (event) {
      event.preventDefault()

      const service = this.getServiceFromForm()
      if (service) {
        ws.request('post', '/service', service, this.token)
          .then(response => {
            this.$store.commit('addService', response)
            this.$router.push('/services')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editService (event) {
      event.preventDefault()

      const service = this.getServiceFromForm()
      if (service) {
        ws.request('put', `/service/${this.service.slug}`, service, this.token)
          .then(response => {
            this.$store.commit('updateService', response)
            this.$router.push('/services')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeService (event) {
      event.preventDefault()

      ws.request('delete', `/service/${this.service.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeService', this.service)
          this.$router.push('/services')
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

    getServiceFromForm () {
      const service = new FormData()
      service.append('townId', $('#town').val())
      service.append('type', $('#type').val())
      service.append('name', $('#name').val().trim())
      service.append('description', $('#description').val().trim())
      service.append('location', $('#location').val().trim())
      service.append('address', $('#address').val().trim())
      service.append('phone', Number($('#phone').val().trim()))
      service.append('email', $('#email').val().trim())
      service.append('web', $('#web').val().trim())

      if (this.file) {
        service.append('image', this.file)
      } else if (this.service && this.service.image) {
        service.append('image', this.service.image)
      }

      const validation = this.validate(service)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation
        return
      }

      return service
    },

    validate (service) {
      const town = service.get('townId')
      if (!town) {
        return Error('Town is required')
      }

      const type = service.get('type')
      if (!type) {
        return Error('Type is required')
      }

      const name = service.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = service.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const address = service.get('address')
      if (!address || typeof address !== 'string' || address.length > 128) {
        return Error('Address is required, 128 characters or less')
      }

      const phone = service.get('phone')
      if (!phone || isNaN(phone) || phone < 600000000 || phone > 999999999) {
        return Error('Phone is required. It should be 9 digits number.')
      }

      const email = service.get('email')
      if (!email || typeof email !== 'string' || email.length > 128 || !email.includes('@') || !email.includes('.')) {
        return Error('Email is required')
      }

      const web = service.get('web')
      if (!web || typeof web !== 'string' || web.length > 128 || !(web.startsWith('https://') || web.startsWith('http://'))) {
        return Error('Web is required and should start with "https://" or "http://"')
      }

      let location
      try {
        location = JSON.parse(service.get('location'))
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

      const image = service.get('image')
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
