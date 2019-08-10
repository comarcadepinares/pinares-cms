<template>
  <div class="col-md-8 offset-md-2">
    <h2 v-if="activity">Edit activity</h2>
    <h2 v-else>Create activity</h2>
    <hr><br>
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="name" v-if="activity" :value="activity.name" />
          <input type="text" class="form-control" id="name" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Highlight</label>
        <div class="col-sm-10">
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="highlight" :checked="activity && activity.highlight">
            <label class="form-check-label" for="highlight">Highlight</label>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Activity type</label>
        <div class="col-sm-10">
          <select class="form-control" id="activityTypeId">
            <option v-for="at in activityTypes" :key="at.id" :value="at.id" :selected="activity && activity.activityTypeId == at.id">{{at.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Town</label>
        <div class="col-sm-10">
          <select class="form-control" id="town">
            <option v-for="town in towns" :key="town.id" :value="town.id" :selected="activity && activity.townId == town.id">{{town.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="description" v-if="activity" :value="activity.description" />
          <textarea type="text" class="form-control" id="description" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Image</label>
        <div class="col-sm-10">
          <img :src="activity.image" width="100px" v-if="activity">
          <input type="file" class="form-control-file" id="image" v-on:change="onFileChange" >
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Location</label>
        <div class="col-sm-10">
          <textarea type="text" class="form-control" id="location" v-if="activity" :value="JSON.stringify(activity.location)" />
          <textarea type="text" class="form-control" id="location" v-else />
          <small class="form-text text-muted">Use <a href="http://geojson.io/#map=12/41.9646/-2.9031">geojson.io</a> and copy here (only geometry). Example: <strong>{"type":"Point","coordinates":[-2.931826114654541, 41.954184406468876]}</strong></small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="address" v-if="activity" :value="activity.address" />
          <input type="text" class="form-control" id="address" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-if="activity" :value="activity.phone" />
          <input type="number" class="form-control" id="phone" max="999999999" min="600000000" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="email" class="form-control" id="email" v-if="activity" :value="activity.email" />
          <input type="email" class="form-control" id="email" v-else />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Web</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="web" v-if="activity" :value="activity.web" />
          <input type="text" class="form-control" id="web" v-else />
        </div>
      </div>

      <br>

      <Alert type="danger" :message="errorMessage" v-if="error"></Alert>
      <Alert type="success" :message="successMessage" v-if="success"></Alert>

      <div v-if="activity">
        <p><button type="submit" class="btn btn-primary col-12" v-on:click="editActivity">Edit</button></p>
        <p><button type="submit" class="btn btn-danger col-12" v-on:click="removeActivity">Remove</button></p>
      </div>
      <button type="submit" class="btn btn-primary col-12" v-on:click="createActivity" v-else>Create</button>
    </form>
  </div>

</template>

<script>
import ws from '@/services/webservice'
import Alert from '@/components/Alert'
export default {
  name: 'activity',
  data () {
    return {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      activity: null,
      file: null
    }
  },
  created: function () {
    if (!this.activity && this.$route.params.slug) {
      this.activity = this.$store.getters.getActivity(this.$route.params.slug)
    }

    return this.activity
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
    },
    activityTypes () {
      return this.$store.state.activityTypes
    }
  },
  methods: {
    createActivity (event) {
      event.preventDefault()

      const activity = this.getActivityFromForm()
      if (activity) {
        ws.request('post', '/activity', activity, this.token)
          .then(response => {
            this.$store.commit('addActivity', response)
            this.$router.push('/activities')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    editActivity (event) {
      event.preventDefault()

      const activity = this.getActivityFromForm()
      if (activity) {
        ws.request('put', `/activity/${this.activity.slug}`, activity, this.token)
          .then(response => {
            this.$store.commit('updateActivity', response)
            this.$router.push('/activities')
          })
          .catch(error => {
            this.error = true
            this.errorMessage = error
          })
      }
    },

    removeActivity (event) {
      event.preventDefault()

      ws.request('delete', `/activity/${this.activity.slug}`, this.token)
        .then(response => {
          this.$store.commit('removeActivity', this.activity)
          this.$router.push('/activities')
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

    getActivityFromForm () {
      const activity = new FormData()
      activity.append('name', $('#name').val().trim())
      activity.append('highlight', $('#highlight').is(':checked'))
      activity.append('activityTypeId', $('#activityTypeId').val())
      activity.append('townId', $('#town').val())
      activity.append('type', $('#type').val())
      activity.append('description', $('#description').val().trim())
      activity.append('location', $('#location').val().trim())
      activity.append('address', $('#address').val().trim())
      activity.append('phone', Number($('#phone').val().trim()))
      activity.append('email', $('#email').val().trim())
      activity.append('web', $('#web').val().trim())

      if (this.file) {
        activity.append('image', this.file)
      } else if (this.activity && this.activity.image) {
        activity.append('image', this.activity.image)
      }

      const validation = this.validate(activity)
      if (validation instanceof Error) {
        this.error = true
        this.errorMessage = validation.message
        return
      }

      return activity
    },

    validate (activity) {
      const activityTypeId = activity.get('activityTypeId')
      if (!activityTypeId) {
        return Error('Activity type is required')
      }

      const town = activity.get('townId')
      if (!town) {
        return Error('Town is required')
      }

      const type = activity.get('type')
      if (!type) {
        return Error('Type is required')
      }

      const name = activity.get('name')
      if (!name || typeof name !== 'string' || name.length > 128) {
        return Error('Name is required, 128 characters or less')
      }

      const description = activity.get('description')
      if (!description || typeof description !== 'string' || description.length > 512) {
        return Error('Description is required, 512 characters or less')
      }

      const address = activity.get('address')
      if (!address || typeof address !== 'string' || address.length > 128) {
        return Error('Address is required, 128 characters or less')
      }

      const phone = activity.get('phone')
      if (phone && phone != '0') {
        if (isNaN(phone) || phone < 600000000 || phone > 999999999) {
          return Error('Phone should be 9 digits number.')
        }
      } else {
        activity.delete('phone')
      }

      const email = activity.get('email')
      if (email) {
        if (typeof email !== 'string' || email.length > 128 || !email.includes('@') || !email.includes('.')) {
          return Error('Email is wrong')
        }
      } else {
        activity.delete('email')
      }

      const web = activity.get('web')
      if (web) {
        if (typeof web !== 'string' || web.length > 128 || !(web.startsWith('https://') || web.startsWith('http://'))) {
          return Error('Web should start with "https://" or "http://"')
        }
      } else {
        activity.delete('web')
      }

      let location
      try {
        location = JSON.parse(activity.get('location'))
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

      const image = activity.get('image')
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
