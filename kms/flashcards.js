document.addEventListener('DOMContentLoaded', () => {
    const deckSelector = document.getElementById('deck-selector');
    const deckNameElement = document.getElementById('deck-name');
    const flashcardElement = document.getElementById('flashcard');
    const remainingCardsElement = document.getElementById('remaining-cards');
    const wordList = document.querySelector('.wordList');
    const gotItBtn = document.getElementById('got-it');
    const notSureBtn = document.getElementById('not-sure');

    let currentDeck = null;
    let lastWordIndex = -1;

    gotItBtn.addEventListener('click', () => {
        if (currentDeck) {
            const selectedWord = flashcardElement.textContent.trim();
            if (selectedWord !== '') {
                const listItem = document.createElement('li');
                listItem.textContent = selectedWord + ' - Got it!';
                wordList.appendChild(listItem);
                removeWordFromDeck(selectedWord);
                updateFlashcard();
            }
        }
    });

    notSureBtn.addEventListener('click', () => {
        if (currentDeck) {
            updateFlashcard();
        }
    });

    function loadDecksFromLocalStorage() {
        const savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
        return savedDecks;
    }

    function removeWordFromDeck(word) {
        currentDeck.cards = currentDeck.cards.filter(card => card.word !== word);
        remainingCardsElement.textContent = `${currentDeck.cards.length} cards left`;
    }

    function updateFlashcard() {
        if (!currentDeck.cards || currentDeck.cards.length === 0) {
            flashcardElement.textContent = 'No cards in this deck';
            remainingCardsElement.textContent = '0 cards left';
            return;
        }

        let randomIndex = getRandomIndex();
        if (randomIndex === lastWordIndex && currentDeck.cards.length > 1) {
            randomIndex = getRandomIndex();
        }
        lastWordIndex = randomIndex;

        const selectedWord = currentDeck.cards[randomIndex].word;
        flashcardElement.textContent = selectedWord;
        remainingCardsElement.textContent = `${currentDeck.cards.length} cards left`;
    }

    function getRandomIndex() {
        return Math.floor(Math.random() * currentDeck.cards.length);
    }

    const savedDecks = loadDecksFromLocalStorage();

    savedDecks.forEach(deck => {
        const option = document.createElement('option');
        option.value = deck.name;
        option.textContent = deck.name;
        deckSelector.appendChild(option);
    });

    deckSelector.addEventListener('change', () => {
        const selectedDeckName = deckSelector.value;
        currentDeck = savedDecks.find(deck => deck.name === selectedDeckName);
        if (currentDeck) {
            deckNameElement.textContent = currentDeck.name;
            if (currentDeck.cards) {
                updateFlashcard();
            } else {
                flashcardElement.textContent = 'No cards in this deck';
                remainingCardsElement.textContent = '0 cards left';
            }
        }
    });

    if (savedDecks.length > 0) {
        deckSelector.value = savedDecks[0].name;
        deckSelector.dispatchEvent(new Event('change'));
    }
});
