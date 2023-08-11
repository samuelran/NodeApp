<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import io from 'socket.io-client';
  import { email } from './store.js';

  let chatLog = [];
  let message = '';
  let socket;
  let currentUser = $email;

  function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.textContent = unsafeText;
    return div.innerHTML;
  }

  function sendMessage() {
    if (message.trim() !== '') {
      const newMessage = { user: currentUser, message: message.trim(), timestamp: new Date() };
      chatLog = [...chatLog, newMessage];
      socket.emit('chat message', newMessage);
      message = '';
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(() => {
    socket = io('http://localhost:3000');
    socket.on('chat message', (msg) => {
      chatLog = [...chatLog, msg];
    });
  });

  onDestroy(() => {
    socket.disconnect();
  });

  afterUpdate(() => {
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  }
</script>

<main>
  <h1>Chat Form</h1>
  <div class="chat-box" id="chat-box">
    {#each chatLog as message}
      <div class="message">
        <span class="user">{message.user}:</span> 
        <span class="content">{escapeHTML(message.message)}</span>
        <span class="timestamp">{formatTimestamp(message.timestamp)}</span>
      </div>
    {/each}
  </div>

  <div class="input-section">
    <input type="text" bind:value={message} placeholder="Type your message..." on:keydown={handleKeyDown} />
    <button on:click={sendMessage}>Send</button>
  </div>
</main>

<style>
  :root {
    --primary-color: #007bff;
    --text-color: #fff;
    --timestamp-color: #777;
    --border-color: #ccc;
  }

  main {
    padding: 20px;
  }

  .chat-box {
    border: 1px solid var(--border-color);
    height: 200px;
    overflow-y: auto;
    padding: 10px;
    margin-bottom: 10px;
  }

  .message {
    margin-bottom: 5px;
  }

  .user {
    font-weight: bold;
    color: var(--primary-color);
  }

  .timestamp {
    font-size: 0.8em;
    color: var(--timestamp-color);
    margin-left: 10px;
  }

  .input-section {
    display: flex;
    gap: 10px;
  }

  input {
    flex: 1;
    padding: 5px;
  }

  button {
    padding: 5px 10px;
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    cursor: pointer;
  }
</style>
