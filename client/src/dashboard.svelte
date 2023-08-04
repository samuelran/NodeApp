<!-- Dashboard.svelte -->
<script>
  import ChatForm from './ChatForm.svelte';
  import Forum from './Forum.svelte';
  let currentComponent = ChatForm; // Default to ChatForm
</script>

<style>
  /* styles for the dashboard */
</style>

<div>
  <!-- Navigation and Sidebar -->
  <button on:click={() => currentComponent = ChatForm}>Chat</button>
  <button on:click={() => currentComponent = Forum}>Forum</button>

  <!-- Dynamic rendering of components based on the currentComponent variable -->
  <svelte:component this={currentComponent} />
</div>