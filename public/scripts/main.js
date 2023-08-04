const socket = io();

// Handle receiving messages
socket.on('chat message', (msg) => {
  const messagesDiv = document.getElementById('messages');
  const newMessage = document.createElement('p');
  newMessage.textContent = msg.message;
  messagesDiv.appendChild(newMessage);

  // Show browser notification for new messages
  if (document.visibilityState !== 'visible') {
    showNotification(msg.message);
  }
});

// Handle sending messages
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
sendButton.addEventListener('click', () => {
  const message = input.value;
  socket.emit('chat message', message);
  input.value = '';
});

// login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      const token = data.token;
      // Store the token securely
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
});

// Handle subscription form submission
const subscriptionForm = document.getElementById('subscription-form');
const subscribeButton = document.getElementById('subscribe');
subscribeButton.addEventListener('click', () => {
  subscribeToNotifications()
    .then((subscription) => {
      const socketId = socket.id;
      fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ socketId, subscription }),
      });
    })
    .catch((error) => {
      console.error('Subscription error:', error);
    });
});

// Subscribe to browser push notifications
function subscribeToNotifications() {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      reject(new Error('Push notifications are not supported'));
    }

    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        return registration.pushManager.getSubscription()
          .then((subscription) => {
            if (subscription) {
              return subscription;
            }

            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: 'your-public-key',
            });
          });
      })
      .then((subscription) => {
        resolve(subscription);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Show browser notification
function showNotification(message) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration()
      .then((registration) => {
        registration.showNotification('New Message', {
          body: message,
        });
      });
  }
}