<script>
  import ForumPost from './ForumPost.svelte';
  export let posts;
</script>

<div class="post-list">
  {#each posts as post}
    <ForumPost id={post.id} post={post} />
  {/each}
</div>

<style>
  .post-list {
    width: 80%;
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
    background-color: #f6f6f6;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 12px;
}

ForumPost {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    border-radius: 8px;
}

ForumPost:last-child {
    margin-bottom: 0;  
}

ForumPost h3 {
    margin-top: 0;
    color: #333;
    font-weight: bold;
}

ForumPost p {
    margin-bottom: 15px;
    color: #666;
}

ForumPost button {
    background-color: #e74c3c; 
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    margin-top: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

</style>
