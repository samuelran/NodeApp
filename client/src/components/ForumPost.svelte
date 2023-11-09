<script>
  import { createEventDispatcher } from 'svelte';
  
  export let post;
  
  let token = localStorage.getItem("token");
  const dispatch = createEventDispatcher();

  async function deletePost() {
    const response = await fetch(`http://localhost:3000/forum-posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
        dispatch('deletePost', post.id);
    } else {
        console.error('Failed to delete the post:', await response.text());
    }
  }
</script>

<article>
  <h3>{post.title}</h3>
  <p>{post.content}</p>
  <button on:click={deletePost}>Delete</button>
</article>

<style>
h3 {
    margin-top: 0;
    color: #333;
}

p {
    margin-bottom: 15px;
    color: #666;
}

button {
    background-color: #e74c3c; 
    color: #fff;
}

button:hover {
    background-color: #c0392b;  
}
</style>
