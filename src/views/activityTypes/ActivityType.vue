<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="activityType">Edit activity type</h2>
    <h2 v-else>Create activity type</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="activityType" :value="activityType.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="activityType" :value="activityType.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="activityType.image" width="100px" v-if="activityType">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="activityType">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editActivityType">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeActivityType">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createActivityType" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'activityType',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      activityType: null,
      file: null
    }
  },
  created: function () {
    if (!this.activityType && this.$route.params.slug) {
      this.activityType = this.$store.getters.getActivityType(this.$route.params.slug)
    }

    return this.activityType
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
    createActivityType (event) {
      event.preventDefault()

      const activityType = this.getActivityTypeFromForm()
      if (activityType) {
        ws.request('post', '/activity-type', activityType, this.token)
          .then(response => {
            this.$store.commit('addActivityType', response)
            this.$router.push('/activity-types')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editActivityType (event) {
      event.preventDefault()

      const activityType = this.getActivityTypeFromForm()
      if (activityType) {
        ws.request('put', `/activity-type/${this.activityType.slug}`, activityType, this.token)
          .then(response => {
            this.$store.commit('updateActivityType', response)
            this.$router.push('/activity-types')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeActivityType (event) {
      event.preventDefault()

      ws.request('delete', `/activity-type/${this.activityType.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeActivityType', this.activityType)
          this.$router.push('/activity-types')
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

    getActivityTypeFromForm () {
      const activityType = new FormData()
      activityType.append('name', $('#name').val().trim())
      activityType.append('description', $('#description').val().trim())

      if (this.file) {
        activityType.append('image', this.file)
      } else if (this.activityType && this.activityType.image) {
        activityType.append('image', this.activityType.image)
      }

      const validation = this.validate(activityType)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation.message
        return
      }

      return activityType
    },

    validate (activityType) {
      const name = activityType.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = activityType.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const image = activityType.get('image')
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
