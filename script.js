window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });
  
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('mousedown', function(e) {
    if (e.button === 0) {
        e.preventDefault();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        openCustomNotification();
    }
  });
  
  let messageIndex = 0;
  let isCooldown = false;
  
  function openCustomNotification() {
    if (isCooldown) return;
  
    const messages = [
        'รับทราบ'
    ];
  
    const message = messages[messageIndex];
        
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.top = '25px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#1e90ff ';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '18px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 1s ease';
    document.body.appendChild(notification);
  
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
  
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }, 2000);
  
    messageIndex = (messageIndex + 1) % messages.length;
  
    isCooldown = true;
    setTimeout(() => {
        isCooldown = false;
    }, 3000);
}