<template>
  <div class="col-md-8 offset-md-2">
    <h2>Create town</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="description" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Latitude</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="latitude" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Longitude</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="longitude" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="phone" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" value />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" value />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <button type="submit" class="btn btn-primary col-12" v-on:click="createTown">Create town</button>
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
      successMessage: ''
    }
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
      const town = {
        name: $('#name').val(),
        description: $('#description').val(),
        location: {
            type: 'Point',
            coordinates: [$('#latitude').val(), $('#Longitude').val()]
        },
        address: $('#address').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        web: $('#web').val()
      }
      ws.request('post', '/town', town, this.token)
        .then(response => {
          this.$store.commit('addTown', response)
          this.$router.push('/towns')
        })
        .catch(error => {
          console.log(error)
          this.error = true
          this.errorMessage = error
        })
    }
  },
  components: {
    Alert
  }
}
</script>
