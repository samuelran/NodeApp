const socket = io();

const getElement = (id) => document.getElementById(id);

const postRequest = (url, body) => fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
});

// Handle receiving messages
socket.on('chat message', (msg) => {
  const messagesDiv = getElement('messages');
  const newMessage = document.createElement('p');
  newMessage.textContent = msg.message;
  messagesDiv.appendChild(newMessage);

  if (document.visibilityState !== 'visible') {
    showNotification(msg.message);
  }
});

getElement('send').addEventListener('click', () => {
  const message = getElement('input').value;
  socket.emit('chat message', message);
  getElement('input').value = '';
});

const handleFormSubmission = (formId, url, successCallback) => {
  const form = getElement(formId);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    postRequest(url, formData).then(successCallback).catch(error => {
      console.error(`Error with ${formId}:`, error);
    });
  });
};

handleFormSubmission('register-form', '/register', (data) => {
  localStorage.setItem('token', data.token);
  alert("Registration successful!"); // Feedback about successful registration.
  window.location.href = "/dashboard"; // Redirect to dashboard after registration.
});

handleFormSubmission('login-form', '/login', (data) => {
  localStorage.setItem('token', data.token);
  window.location.href = "/dashboard"; // Redirect to dashboard after login.
});

getElement('subscribe').addEventListener('click', () => {
  subscribeToNotifications().then((subscription) => {
    const socketId = socket.id;
    postRequest('/subscribe', { socketId, subscription });
  }).catch((error) => {
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
