<script>
  import { onMount } from 'svelte';
  import ForumPostForm from '../components/ForumPostForm.svelte';
  import ForumPostList from '../components/ForumPostList.svelte';

  let forumPosts = [];

  onMount(async () => {
    try {
        const response = await fetch('http://localhost:3000/forum-posts');
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
    const newPost = event.detail;
    forumPosts = [newPost, ...forumPosts];
  }

  function handleDeletePost(event) {
    const postIdToDelete = event.detail;
    let newPosts = forumPosts.filter(post => post_id !== postIdToDelete);
    forumPosts = newPosts;
}
</script>

<div>
  <h2>Forum</h2>
  
  <ForumPostForm on:newPost={handleNewPost} />
  <ForumPostList posts={forumPosts} on:deletePost={handleDeletePost} />
</div>