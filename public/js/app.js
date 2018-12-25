
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'Your Event has Started!',
      icon: '/images/logo.png',
      image: '/images/logo.png',
      dir: 'ltr',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200],
      badge: '/images/logo.png',
      tag: 'Event Started',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/images/logo.png' },
        { action: 'cancel', title: 'Cancel', icon: '/images/logo.png' }
      ]
    };

    navigator.serviceWorker.ready
      .then(function(swreg) {
        swreg.showNotification('Event Started!', options);
      });
  }
  else{
    console.log('no serviceworker');
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      console.log('User Choice', result);
      displayConfirmNotification();
    }
  });
}

if ('Notification' in window) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}