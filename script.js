// Flashcard data
const flashcardData = [
    {
        word: "apple",
        image: "images/apple.png",
        animation: "bounce",
        audio: "apple"
    },
    {
        word: "cat",
        image: "images/cat.png",
        animation: "",
        audio: "cat"
    },
    {
        word: "dog",
        image: "images/dog.png",
        animation: "",
        audio: "dog"
    },
    {
        word: "book",
        image: "images/book.png",
        animation: "",
        audio: "book"
    }
];

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Create flashcards
function createFlashcards() {
    const container = document.querySelector('.flashcard-container');
    
    flashcardData.forEach(item => {
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.draggable = true;
        flashcard.dataset.word = item.word;
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.word;
        img.draggable = false; // Prevent image from being draggable
        
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = item.word;
        
        flashcard.appendChild(img);
        flashcard.appendChild(word);
        
        // Add click event for pronunciation
        flashcard.addEventListener('click', () => {
            speakWord(item.word);
            if (item.animation) {
                flashcard.classList.add(item.animation);
                setTimeout(() => {
                    flashcard.classList.remove(item.animation);
                }, 1000);
            }
        });
        
        // Add drag and drop events
        flashcard.addEventListener('dragstart', handleDragStart);
        flashcard.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(flashcard);
    });
}

// Create matching game
function createMatchingGame() {
    const gameContainer = document.querySelector('.matching-game');
    
    // Use the same data as flashcards, but shuffle it
    const gameData = [...flashcardData];
    shuffleArray(gameData);
    
    gameData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.index = index;
        card.dataset.word = item.word;
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.word;
        img.draggable = false; // Prevent image from being draggable
        
        card.appendChild(img);
        
        // Add drag and drop events to game cards
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drop-target');
        });
        
        card.addEventListener('dragleave', () => {
            card.classList.remove('drop-target');
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedWord = e.dataTransfer.getData('text/plain');
            
            if (card.dataset.word === draggedWord) {
                card.classList.add('correct-match');
                const flashcard = document.querySelector(`.flashcard[data-word="${draggedWord}"]`);
                if (flashcard) {
                    flashcard.style.display = 'none';
                }
            }
            
            card.classList.remove('drop-target');
        });
        
        gameContainer.appendChild(card);
    });
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Speech synthesis function
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// Drag and drop handlers
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.word);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    // Remove drop-target class from all game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.classList.remove('drop-target');
    });
}

// Matching game handlers
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function handleCardClick(e) {
    if (lockBoard) return;
    if (e.target === firstCard) return;
    
    const card = e.target.closest('.game-card');
    card.classList.add('flipped');
    
    if (!firstCard) {
        firstCard = card;
        return;
    }
    
    secondCard = card;
    lockBoard = true;
    
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.word === secondCard.dataset.word;
    
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    createFlashcards();
    createMatchingGame();
}); 