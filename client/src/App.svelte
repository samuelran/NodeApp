<script>
  import { Router, Route } from 'svelte-routing';
  import Navbar from './Navbar.svelte';
  import Dashboard from './Dashboard.svelte';
  import ChatForm from './chatform.svelte';
  import ForumFrontend from './forum.svelte';
  import LoginForm from './LoginForm.svelte';
  import { isLoggedIn, email } from './store.js';

  function logout() {
      $isLoggedIn = false;
      localStorage.removeItem('token');
      $email = ''; 
  }
</script>

<Router>
  {#if $isLoggedIn}
    <Navbar />
  {/if}

  <Route path="/">
    {#if $isLoggedIn}
      <Dashboard />
    {:else}
      <LoginForm on:loggedIn={(event) => {
        $isLoggedIn = true;
        $email = event.detail;  
      }} />
    {/if}
  </Route>

    <Route path="/dashboard">
        {#if $isLoggedIn}
        <Navbar on:logout={logout} />
            <Dashboard />
        {:else}
            <LoginForm on:loggedIn={() => $isLoggedIn = true} />
        {/if}
    </Route>

    <Route path="/chat">
        {#if $isLoggedIn}
            <ChatForm validatedUsername={$email} />
        {:else}
            <LoginForm on:loggedIn={() => {
                $isLoggedIn = true;
                // Also, ideally, after a successful login, you should set the $email value.
                // $email = 'user@email.com'; 
            }} />
        {/if}
    </Route>

    <Route path="/forum">
        {#if $isLoggedIn}
            <ForumFrontend />
        {:else}
            <LoginForm on:loggedIn={() => $isLoggedIn = true} />
        {/if}
    </Route>

    <Route path="/login">
        {#if !$isLoggedIn}
            <LoginForm on:loggedIn={() => $isLoggedIn = true} />
        {:else}
            <Dashboard />
        {/if}
    </Route>
</Router>
