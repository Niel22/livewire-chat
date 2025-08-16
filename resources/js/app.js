import './bootstrap';

document.addEventListener("livewire:navigated", () => {
    
});

document.addEventListener("livewire:load", () => {
    Livewire.hook('message.processed', (message, component) => {
        
        document.querySelectorAll('.chat-message').forEach(el => {
            if (!el.classList.contains('seen')) {
                el.classList.add('animate-in'); 
                el.classList.add('seen');      
                setTimeout(() => el.classList.remove('animate-in'), 400); 
            }
        });
    });
});
