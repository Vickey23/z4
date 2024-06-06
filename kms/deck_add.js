document.addEventListener('DOMContentLoaded', () => {
    const deckNameInput = document.getElementById('deckName');
    const deckDescriptionInput = document.getElementById('deckDescription');
    const wordInput = document.getElementById('word');
    const wordDescriptionInput = document.getElementById('wordDescription');
    const addWordBtn = document.getElementById('addWordBtn');
    const saveDeckBtn = document.getElementById('saveDeckBtn');
    const wordList = document.querySelector('.wordList');
    const wordPreview = document.getElementById('wordPreview');
    
    let words = [];

    wordInput.addEventListener('input', () => {
        updateWordPreview();
    });

    wordDescriptionInput.addEventListener('input', () => {
        updateWordPreview();
    });

    function updateWordPreview() {
        const word = wordInput.value.trim();
        const description = wordDescriptionInput.value.trim();
        wordPreview.innerHTML = `<strong>${word}</strong><br>${description}`;
    }

    addWordBtn.addEventListener('click', () => {
        const word = wordInput.value.trim();
        const wordDescription = wordDescriptionInput.value.trim();

        if (word === '') {
            alert('Word cannot be empty');
            return;
        }

        words.push({ word, description: wordDescription });

        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);

        wordInput.value = '';
        wordDescriptionInput.value = '';
        updateWordPreview();
    });

    saveDeckBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const deckName = deckNameInput.value.trim();
        const deckDescription = deckDescriptionInput.value.trim();

        if (deckName === '') {
            alert('Deck name cannot be empty');
            return;
        }

        const deck = {
            name: deckName,
            description: deckDescription,
            cards: words
        };

        console.log('Saving deck:', deck);
        saveDeckAsFile(deck);
    });

    function saveDeckAsFile(deck) {
        let savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
        savedDecks.push(deck);
        localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
        const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deck.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
});
