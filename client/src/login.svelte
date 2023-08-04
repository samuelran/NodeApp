<!-- Login.svelte -->
<script>
  let username = '';
  let password = '';

  function login() {
    // For simplicity, assume the user is always authenticated with correct credentials
    isAuthenticated = true;
  }
</script>

<style>
  /*  custom styles for the login component */
</style>

<div>
  <h2>Login</h2>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click={login}>Log In</button>
</div>