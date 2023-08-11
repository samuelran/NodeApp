<script>
  import { navigate } from 'svelte-routing';

  let email = '';
  let password = '';

  async function handleRegister() {
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (response.ok) {
            localStorage.setItem('jwt', data.token);
            console.log('Registration successful');
            navigate('/dashboard');
        } else {
            if (data.error) {
                console.error('Registration error:', data.error);
            } else {
                console.error('Unexpected server error.');
            }
        }
    } catch (error) {
        console.error('An error occurred during registration:', error);
    }
}
</script>

<main>
  <h1>Register</h1>
  <form on:submit|preventDefault={handleRegister}>
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} required />
    
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} required />
    
    <button type="submit">Register</button>
  </form>
</main>

<style>
</style>
