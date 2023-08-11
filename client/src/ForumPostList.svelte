<script>
  import ForumPost from './ForumPost.svelte';

  export let posts = [];
</script>

<div class="post-list">
  {#each posts as post (post.id)}
    <ForumPost post={post} />
  {/each}
</div>

<style>
  .post-list {
  }
</style>
