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
    },
    {
        word: "ball",
        image: "images/ball.png",
        animation: "bounce",
        audio: "ball"
    },
    {
        word: "tree",
        image: "images/tree.png",
        animation: "",
        audio: "tree"
    },
    {
        word: "house",
        image: "images/house.webp",
        animation: "",
        audio: "house"
    },
    {
        word: "car",
        image: "images/car.png",
        animation: "",
        audio: "car"
    },
    {
        word: "sun",
        image: "images/sun.png",
        animation: "",
        audio: "sun"
    },
    {
        word: "moon",
        image: "images/moon.png",
        animation: "",
        audio: "moon"
    },
    {
        word: "fish",
        image: "images/fish.png",
        animation: "",
        audio: "fish"
    },
    {
        word: "bird",
        image: "images/bird.png",
        animation: "",
        audio: "bird"
    },
    {
        word: "star",
        image: "images/star.png",
        animation: "",
        audio: "star"
    },
    {
        word: "flower",
        image: "images/flower.png",
        animation: "",
        audio: "flower"
    },
    {
        word: "cloud",
        image: "images/cloud.png",
        animation: "",
        audio: "cloud"
    },
    {
        word: "rainbow",
        image: "images/rainbow.png",
        animation: "",
        audio: "rainbow"
    }
];

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Global variables to track game state
let remainingWords = [...flashcardData];
let matchedWords = new Set();
let currentSelectedWords = [];
let progressCount = 0;
let totalStages = 0;
let gameLength = 16; // Default game length

// Function to create progress bar
function createProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = ''; // Clear existing emojis
    
    // Calculate total stages needed based on game length
    totalStages = Math.ceil(gameLength / 4);
    
    // Create array of possible emojis
    const possibleEmojis = ['🍎', '🐱', '🐶', '📚', '⚽', '🌳', '🏠', '🚗', '☀️', '🌙', '🎨', '🎵', '🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎪', '🎡'];
    
    // Shuffle the emojis array
    const shuffledEmojis = [...possibleEmojis].sort(() => Math.random() - 0.5);
    
    // Create emojis for each stage using the shuffled array
    for (let i = 0; i < totalStages; i++) {
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'progress-emoji';
        emojiDiv.textContent = shuffledEmojis[i];
        progressBar.appendChild(emojiDiv);
    }
}

// Function to get random words based on game length
function getRandomWords() {
    if (remainingWords.length === 0) {
        // If all words are matched, show game finished modal
        setTimeout(() => {
            showGameFinishedModal();
        }, 2000);
        return null;
    }
    
    // If we have less than 4 words remaining, use all remaining words
    const count = Math.min(4, remainingWords.length);
    const shuffled = [...remainingWords].sort(() => 0.5 - Math.random());
    currentSelectedWords = shuffled.slice(0, count);
    return currentSelectedWords;
}

// Function to update progress bar
function updateProgressBar() {
    const emojis = document.querySelectorAll('.progress-emoji');
    if (progressCount < emojis.length) {
        emojis[progressCount].classList.add('active');
        progressCount++;
    }
}

// Function to reset progress bar
function resetProgressBar() {
    const emojis = document.querySelectorAll('.progress-emoji');
    emojis.forEach(emoji => {
        emoji.classList.remove('active');
    });
    progressCount = 0;
}

// Function to reset the game state
function resetGame() {
    // Reset based on selected game length
    const shuffledAllWords = [...flashcardData].sort(() => 0.5 - Math.random());
    remainingWords = shuffledAllWords.slice(0, gameLength);
    matchedWords.clear();
    currentSelectedWords = [];
    createProgressBar();
    resetProgressBar();
    const selectedWords = getRandomWords();
    createFlashcards(selectedWords);
    createMatchingGame(selectedWords);
}

// Create flashcards
function createFlashcards(selectedWords) {
    const container = document.querySelector('.flashcard-container');
    container.innerHTML = ''; // Clear existing flashcards
    
    // Shuffle the selected words for flashcards
    const shuffledWords = [...selectedWords].sort(() => 0.5 - Math.random());
    
    shuffledWords.forEach(item => {
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.draggable = true;
        flashcard.dataset.word = item.word;
        
        const word = document.createElement('div');
        word.className = 'word';
        word.textContent = item.word;
        
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
function createMatchingGame(selectedWords) {
    const gameContainer = document.querySelector('.matching-game');
    gameContainer.innerHTML = ''; // Clear existing game cards
    
    // Shuffle the selected words for the matching game
    const shuffledWords = [...selectedWords].sort(() => 0.5 - Math.random());
    
    shuffledWords.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.index = index;
        card.dataset.word = item.word;
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.word;
        img.draggable = false;
        
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
                
                // Add the word above the image
                const wordElement = document.createElement('div');
                wordElement.className = 'matched-word';
                wordElement.textContent = draggedWord;
                card.insertBefore(wordElement, card.firstChild);
                
                const flashcard = document.querySelector(`.flashcard[data-word="${draggedWord}"]`);
                if (flashcard) {
                    flashcard.style.display = 'none';
                }
                
                // Remove the matched word from remaining words
                remainingWords = remainingWords.filter(word => word.word !== draggedWord);
                matchedWords.add(draggedWord);
                
                // Check if all current words are matched
                const allCurrentWordsMatched = selectedWords.every(word => 
                    matchedWords.has(word.word) || 
                    document.querySelector(`.game-card[data-word="${word.word}"]`).classList.contains('correct-match')
                );
                
                if (allCurrentWordsMatched) {
                    // Update progress bar
                    updateProgressBar();
                    // Show congratulation modal
                    setTimeout(() => {
                        showCongratulationModal();
                    }, 1000);
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

// Restart game function
function restartGame() {
    resetGame();
}

// Function to create fireworks
function createFireworks() {
    const colors = ['#FF9800', '#FF5722', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.backgroundColor = color;
        firework.style.boxShadow = `0 0 10px 5px ${color}`;
        
        // Add to container
        container.appendChild(firework);
        
        // Remove after animation
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }
}

// Function to show congratulation modal
function showCongratulationModal() {
    const modal = document.getElementById('congratulation-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Get all active emojis and get the last one (most recently activated)
    const activeEmojis = document.querySelectorAll('.progress-emoji.active');
    const currentEmoji = activeEmojis.length > 0 ? activeEmojis[activeEmojis.length - 1].textContent : '🎉';
    
    // Update modal content with the achieved emoji
    modalContent.innerHTML = `
        <h2>Great Job!</h2>
        <p>You matched all the words correctly!</p>
        <div class="achievements">
            <h3>You earned: <span class="big-emoji">${currentEmoji}</span></h3>
        </div>
    `;
    
    modal.style.display = 'block';
    createFireworks();
    
    // Automatically hide modal and show new words after 2 seconds
    setTimeout(() => {
        modal.style.display = 'none';
        const newWords = getRandomWords();
        if (newWords) {  // Only proceed if there are new words
            createFlashcards(newWords);
            createMatchingGame(newWords);
        }
    }, 2000);
}

// Function to show game finished modal
function showGameFinishedModal() {
    const modal = document.getElementById('game-finished-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Get all achieved emojis
    const achievedEmojis = Array.from(document.querySelectorAll('.progress-emoji.active'))
        .map(emoji => emoji.textContent);
    
    // Update modal content with achievements
    modalContent.innerHTML = `
        <h2>Congratulations! 🏆</h2>
        <p>You've matched all the words!</p>
        <div class="achievements">
            <h3>Your Achievements:</h3>
            <div class="achievement-emojis">
                ${achievedEmojis.map(emoji => `<span class="achievement-emoji">${emoji}</span>`).join('')}
            </div>
        </div>
        <p>One more time?</p>
        <div class="modal-buttons">
            <button class="modal-button yes-button">Yes!</button>
            <button class="modal-button no-button">No, thanks</button>
        </div>
    `;
    
    modal.style.display = 'block';
    createFireworks();
    
    // Add event listeners to buttons
    const yesButton = modal.querySelector('.yes-button');
    const noButton = modal.querySelector('.no-button');
    
    yesButton.onclick = function() {
        modal.style.display = 'none';
        resetGame();
    };
    
    noButton.onclick = function() {
        modal.style.display = 'none';
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up game length slider
    const gameLengthSlider = document.getElementById('game-length');
    const gameLengthValue = document.getElementById('game-length-value');
    
    gameLengthSlider.addEventListener('input', (e) => {
        gameLength = parseInt(e.target.value);
        gameLengthValue.textContent = `${gameLength} cards`;
        createProgressBar(); // Update progress bar when game length changes
        resetProgressBar(); // Reset progress when length changes
    });
    
    createProgressBar();
    const selectedWords = getRandomWords();
    createFlashcards(selectedWords);
    createMatchingGame(selectedWords);
    
    // Add restart button event listener
    const restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', resetGame);
}); 