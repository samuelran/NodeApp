<script>
  import { createEventDispatcher } from 'svelte';

  let postTitle = "";
  let postContent = "";
  let token;

  const dispatch = createEventDispatcher();

  async function createPost() {
    const response = await fetch('http://localhost:3000/forum-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send the token in headers
      },
      body: JSON.stringify({ title: postTitle, content: postContent })
    });

    const newPost = await response.json();

    if (response.ok) {
      dispatch('newPost', { title: postTitle, content: postContent });
      postTitle = '';
      postContent = '';
    } else {
      console.error("Failed to create a post:", newPost.error);
    }
  }
</script>

<div>
  <input bind:value={postTitle} placeholder="Post Title" />
  <textarea bind:value={postContent} placeholder="Post Content"></textarea>
  <button on:click={createPost}>Create Post</button>
</div>
