<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div class="container">
        <router-link class="navbar-brand" to="/">Pinares CMS</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mainNavbar"
          aria-controls="navbarsExampleDefault"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown" v-if="user && user.role == 'SuperAdmin'">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Superadmin
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" to="/towns">Towns</router-link>
              </div>
            </li>
            <li class="nav-item dropdown" v-if="user">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Your content
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
          <ul class="navbar-nav" v-if="user">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >{{user.username}}</a>
              <div class="dropdown-menu dropdown-menu-right">
                <router-link class="dropdown-item" to="/account/user">Account</router-link>
                <li class="dropdown-divider"></li>
                <a class="dropdown-item" v-on:click="logout">Logout</a>
              </div>
            </li>
          </ul>
          <ul class="navbar-nav" v-else>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#login">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#signUp">Sign up</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <Login></Login>
    <SignUp></SignUp>
  </div>
</template>

<script>
import Login from "@/components/account/Login";
import SignUp from "@/components/account/SignUp";

export default {
  name: "mainnav",
  components: {
    Login,
    SignUp
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    }
  }
};
</script>
