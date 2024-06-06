document.addEventListener('DOMContentLoaded', () => {
    const recentDecksPlaceholder = document.getElementById('recent-decks-placeholder');

    function loadRecentDecks() {
        const savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
        const recentDecks = savedDecks.slice(-3);
        recentDecks.forEach(deck => {
            const button = document.createElement('a');
            button.href = `deck_management.html?deck=${deck.name}`;
            button.className = 'add_btn btn btn-outline-secondary';
            
            const displayName = deck.name.length > 5 ? deck.name.substring(0, 4) + '...' : deck.name;
            button.textContent = displayName;

            recentDecksPlaceholder.appendChild(button);
        });
    }

    loadRecentDecks();
});
