<script>
  import { createEventDispatcher } from 'svelte';

  export let post;

  const dispatch = createEventDispatcher();

  async function deletePost() {
    const response = await fetch(`http://localhost:3000/forumPost/${post.id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      dispatch('deletePost', post.id);
    } else {
      console.error("Failed to delete the post");
    }
  }
</script>

<article>
  <h3>{post.title}</h3>
  <p>{post.content}</p>
  <button on:click={deletePost}>Delete</button>
</article>
