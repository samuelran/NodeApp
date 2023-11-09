<script>
  import TailwindCss from './styles/TailwindCSS.svelte';
  import { Router, Route } from 'svelte-routing';
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import ChatForm from './pages/Chat.svelte';
  import ForumFrontend from './pages/Forum.svelte';
  import LoginForm from './pages/Login.svelte';
  import UserProfile from './pages/UserProfile.svelte';
  import { isLoggedIn, email } from './stores/store.js';

  function logout() {
      $isLoggedIn = false;
      localStorage.removeItem('token');
      $email = ''; 
  }
</script>

<Router>
  {#if $isLoggedIn}
    <Navbar on:logout={logout} />
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
            <Dashboard />
        {:else}
            <LoginForm on:loggedIn={() => $isLoggedIn = true} />
        {/if}
    </Route>

    <Route path="/profile">
        {#if $isLoggedIn}
            <UserProfile validatedUsername={$email} />
        {:else}
            <LoginForm on:loggedIn={() => {
                $isLoggedIn = true;
                // $email = 'user@email.com'; 
            }} />
        {/if}
    </Route>

    <Route path="/chat">
        {#if $isLoggedIn}
            <ChatForm validatedUsername={$email} />
        {:else}
            <LoginForm on:loggedIn={() => {
                $isLoggedIn = true;
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
