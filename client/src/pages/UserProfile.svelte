<script>
  import { onMount } from 'svelte';
  import { user, updateUserProfile } from '../stores/store'; // Import the user data and update function from your store or API

  let name = user.name;
  let email = user.email;
  let about = user.about;
  let profilePicture = user.profilePicture;

  let isLoading = false;
  let errorMessage = '';
  let selectedProfilePicture = null;

  const handleFileChange = (event) => {
    selectedProfilePicture = event.target.files[0];
  };

  const updateProfile = async () => {
    isLoading = true;
    errorMessage = '';

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('about', about);
      if (selectedProfilePicture) {
        formData.append('profilePicture', selectedProfilePicture);
      }

      const updatedUserData = await updateUserProfile(formData);

      // Update the user data in your store or context
      user.name = updatedUserData.name;
      user.email = updatedUserData.email;
      user.profilePicture = updatedUserData.profilePicture;
      user.about = updatedUserData.about;

    } catch (error) {
      console.error('Error updating profile:', error);
      errorMessage = 'Failed to update profile';
    } finally {
      isLoading = false;
    }
  };

  onMount(async () => {
    // Fetch user data and set it in your Svelte store or context
  });
</script>

<main>
  <h1>User Profile</h1>

  <img src={profilePicture} alt="User Profile Picture">
  
  <input type="file" accept="image/*" on:change={handleFileChange}>

  <input type="text" bind:value={name} placeholder="Name">
  <input type="text" bind:value={email} placeholder="Email">
  <input type="text" bind:value={about} placeholder="About">

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <button on:click={updateProfile} disabled={isLoading}>Update Profile</button>
</main>


<style>
  
  main {
    background-color: #f0f0f0; 
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333; 
  }

  img {
    max-width: 200px;
    margin: 10px 0;
  }

  input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc; 
    border-radius: 5px;
  }

  button {
    background-color: #75756A; 
    color: #fff; 
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button[disabled] {
    background-color: #ccc; 
    cursor: not-allowed;
  }

  button:hover {
    background-color: #3E8DAD; 
  }

  .error {
    color: red;
    font-size: 14px;
  }
</style>