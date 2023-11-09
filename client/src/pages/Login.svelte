<script>
    import { navigate } from 'svelte-routing';
    import Register from '../components/RegistrationForm.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();


    let showRegister = false;
    let email = '';
    let password = '';
    let isLoading = false;
    let errorMessage = '';

    let buttonText = showRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register';

    function toggleForm() {
        showRegister = !showRegister;
        email = '';
        password = '';
        buttonText = showRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register';
    }

    async function handleLogin() {
        isLoading = true;
        errorMessage = '';

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                dispatch('loggedIn', data.email); 
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                errorMessage = errorData.error;
            }
        } catch (error) {
            errorMessage = 'Network error. Please try again later.';
        }

        isLoading = false;
    }
</script>

<main>
    <h1>Login</h1>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleLogin}>
        <input type="email" bind:value={email} placeholder="Email" required />
        <input type="password" bind:value={password} placeholder="Password" required />
        <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
        </button>
    </form>
    <button on:click={toggleForm}>
        {buttonText}
    </button>
    {#if showRegister}
        <Register />
    {/if}
</main>

<style>
    .error {
        color: red;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    input, button {
        padding: 10px;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
