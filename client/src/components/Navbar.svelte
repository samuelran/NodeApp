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
        <li><Link to="/chat" activeClass="active" class="nav-link">Chat</Link></li>
        <li><Link to="/forum" activeClass="active" class="nav-link">Forum</Link></li>
        <li><Link to="/profile" activeClass="active" class="nav-link">Profile</Link></li>     
    </ul>
    <button on:click={handleLogout} class="nav-link logout-button">Logout</button>
</nav>

<style>
    nav {
        background-color: #75756A;
        padding: 10px;
        position: relative;
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
        color: #3E8DAD;
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
        position: absolute;
        top: 37%;
        right: 2%;
        border: none;
        cursor: pointer;
        color: rgb(18, 19, 18);
        padding: 0;
    }

    .logout-button:hover {
        color: darkred;
    }

    .logout-button:active {
        color: #999;
    }

    .logout-button:focus {
        outline: none;
    }
</style>
