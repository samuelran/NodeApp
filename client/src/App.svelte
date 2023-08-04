<script>
  import Login from './Login.svelte';
  import Dashboard from './Dashboard.svelte';
  let isAuthenticated = false;
</script>

{#if isAuthenticated}
  <Dashboard />
{:else}
  <Login />
{/if}

<main>
	
</main>

<style>
	
</style>