<script>
    import { Link } from 'svelte-routing';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleLogout() {
        dispatch('logout');
    }
</script>

<nav>
    <ul>
        <li><Link to="/dashboard" activeClass="active" class="nav-link">Dashboard</Link></li>
        <li><Link to="/chat" activeClass="active" class="nav-link">Chat Service</Link></li>
        <li><Link to="/forum" activeClass="active" class="nav-link">Forum Frontend</Link></li>
        <li><button on:click={handleLogout} class="nav-link logout-button">Logout</button></li>
    </ul>
</nav>

<style>
    nav {
        background-color: #333;
        padding: 10px;
    }

    ul {
        list-style: none;
        display: flex;
        justify-content: center;
    }

    li {
        margin: 0 10px;
    }

    .nav-link {
        color: #fff;
        text-decoration: none;
        transition: color 0.3s;
    }

    .nav-link:hover {
        color: #ccc;
    }

    .nav-link:active {
        color: #999;
    }

    .nav-link.active {
        font-weight: bold;
    }

    .logout-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: #fff;
        padding: 0;
    }

    .logout-button:hover {
        color: #ccc;
    }

    .logout-button:active {
        color: #999;
    }

    .logout-button:focus {
        outline: none;
    }
</style>
