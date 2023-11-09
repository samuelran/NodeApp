<script>
  import { createEventDispatcher } from 'svelte';
    import ForumPost from './ForumPost.svelte';

  let postTitle = "";
  let postContent = "";
  let token = localStorage.getItem("token");
  const dispatch = createEventDispatcher();

  async function createPost() {
    console.log('token => ', token);
    const response = await fetch('http://localhost:3000/forum-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: postTitle, content: postContent })
    });

    if (response.ok) {
        const newPost = await response.json();
        dispatch('newPost', newPost);
        postTitle = '';
        postContent = '';
    } 
    else {
        console.error("Failed to create a post:", await response.text());
    }
}
async function addComment(postId, commentContent) {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentContent })
      });

      if (response.ok) {
        // Handle the successful creation of the comment
      } else {
        // Handle the error
        console.error("Failed to add a comment:", await response.text());
      }
    } catch (error) {
      console.error("Error adding a comment:", error);
    }
  }

  async function toggleLike(postId) {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Handle the successful like/unlike action
      } else {
        // Handle the error
        console.error("Failed to toggle like:", await response.text());
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

</script>

<style>
  .post-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 20px auto;
  }

  .post-form input, .post-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .post-form button {
    background-color: #007BFF;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .post-form button:hover {
    background-color: #0056b3;
  }
</style>

<div class="post-form">
  <input bind:value={postTitle} placeholder="Post Title" />
  <textarea bind:value={postContent} placeholder="Post Content" rows="4"></textarea>
  <button on:click={createPost}>Create Post</button>
</div>
<div>
  <h2>{ForumPost.title}</h2>
  <p>{ForumPost.content}</p>
  <button on:click={() => addComment(ForumPost.id, 'Your comment content')}>Add Comment</button>
  <button on:click={() => toggleLike(ForumPost.id)}>Like</button>
</div>