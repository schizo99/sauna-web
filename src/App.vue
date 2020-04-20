<template>
  <div id="app">
    <header class="header">
      <nav>
        <ul>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'Home'}" exact>
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'Graph'}" exact>
              Graph
            </router-link>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view class="router" />
    </main>
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>
body {
  background: linear-gradient(to bottom, #555, #999);
  background-attachment: fixed;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
main {
  margin: 0 auto;
  background-color: white;
  width: 100%;
  min-height: 100%;
  padding: 30px 0px 30px 0px;
}
.header {
  background-color: #999;
  width: 100%;
  margin: 0 auto;
}
ul {
  padding: 3px;
  display: flex;
}
.nav-item {
  display: inline-block;
  padding: 5px 10px;
  font-size: 22px;
  border-right: 1px solid #bbb;
}
.nav-link {
  text-decoration: none;
  color: inherit;
}
.router-link-active {
  color: white;
}
.router {
  padding-left: 15px;
}
</style>
