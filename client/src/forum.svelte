<script>
  import { onMount } from 'svelte';
  import ForumPostForm from './ForumPostForm.svelte';
  import ForumPostList from './ForumPostList.svelte';

  let forumPosts = [];

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/forumPosts');
      if (response.ok) {
        forumPosts = await response.json();
      } else {
        console.error("Failed to fetch posts:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  });

  function handleNewPost(event) {
    const newPost = { 
      id: forumPosts.length + 1, 
      title: event.detail.title, 
      content: event.detail.content, 
      comments: []
    };
    forumPosts = [newPost, ...forumPosts];
  }

  function handleDeletePost(event) {
    forumPosts = forumPosts.filter(post => post.id !== event.detail);
  }
</script>

<div>
  <h2>Forum</h2>
  <ForumPostForm on:newPost={handleNewPost} />
  <ForumPostList posts={forumPosts} on:deletePost={handleDeletePost} />
</div>
