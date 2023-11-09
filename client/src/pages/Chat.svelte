<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import io from 'socket.io-client';
  import { email } from '../stores/store.js';


  let token = localStorage.getItem("token");
  let chatLog = []
  let message = '';
  let socket;
  let currentUser = $email;
  
  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error("Failed to decode token", e);
      return {};
    }
  }

  let decodedToken = decodeToken(token);
  let userId = decodedToken.id;

  function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.textContent = unsafeText;
    return div.innerHTML;
  }

  async function sendMessage() {
    if (message.trim() !== '') {
      const postData = {
        content: message.trim(),
        author: userId 
      };

      try {
        const response = await fetch('http://localhost:3000/messages', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          const savedMessage = await response.json();
          socket.emit('new message', savedMessage);
        } else {
          throw new Error('Failed to post the message to the server');
        }

      } catch (error) {
        console.error('Error:', error.message);
      }
      
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
    const token = localStorage.getItem("token");
    socket = io('http://localhost:3000');
    socket.emit('authenticate', token);
    socket.emit('join room', 'general');
    
    fetch('http://localhost:3000/messages', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('data => ', data);
      if (Array.isArray(data)) {
        chatLog = data;
      }
    }) 
    .catch(err => {
      console.error('Failed to fetch messages:', err);
    });

    socket.on('chat message', (newMessage) => {
         chatLog = chatLog.concat(newMessage);
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
  let date;
  if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return '';
  }

  const dateString = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  return `${dateString} ${timeString}`;
}
</script>


<main>
  <h1>Chat Room</h1>
  <div class="chat-box" id="chat-box">
    {#each chatLog as message}
      <div class="message">
        <span class="user">{typeof message.author === 'object' ? message.author.email : message.author}:</span>
        <span class="content">{escapeHTML(message.content)}</span>
        <span class="timestamp">{formatTimestamp(message.date)}</span>
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
    --primary-color: #757546;
    --text-color: #fff;
    --timestamp-color: #777;
    --border-color: #ccc;
    --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  main {
    padding: 20px;
    max-width: 600px;
    margin: 40px auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: var(--box-shadow);
  }

  h1 {
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 20px;
    color: var(--primary-color);
  }

  .chat-box {
    border: 1px solid var(--border-color);
    height: 300px;
    overflow-y: auto;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  }

  .message {
    margin-bottom: 10px;
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
    align-items: center;
  }

  input {
    flex: 1;
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: var(--primary-color);
    outline: none;
  }

  button {
    padding: 8px 12px;
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;  
    }
</style>