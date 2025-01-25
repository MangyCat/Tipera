document.addEventListener('DOMContentLoaded', () => {
    const dictionaryModeButton = document.getElementById('dictionary-mode'); 
    const quoteModeButton = document.getElementById('quote-mode');
    const wordDisplay = document.getElementById('word-display');
    const wordInput = document.getElementById('word-input');
    const results = document.getElementById('results');
    const keySound = document.getElementById('key-sound');
    let sentence = '';
    let startTime = 0;

    dictionaryModeButton.addEventListener('click', () => {
        fetchSentenceFromDictionary();
    });

    quoteModeButton.addEventListener("click", () => {
        fetchSentenceFromQuotes();
    });
    wordInput.addEventListener('input', () => {
        const typedText = wordInput.value;
        playKeySound();
        highlightTypedText(typedText);
        
        if (typedText === sentence) {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000 / 60; // time in minutes
            const wpm = (sentence.split(' ').length / duration).toFixed(2);
            results.textContent = `Done! Your WPM: ${wpm} Your time ${(endTime - startTime)/1000}`; //divides by 1000 to convert miliseconds to seconds fyi
        }
    });

    function fetchSentenceFromDictionary() {
        const randomWords = getRandomWords(16);
        sentence = randomWords.join(' ');
        startGame(); //for context its more of a minigame, a game nonetheless
    }

    function fetchSentenceFromQuotes() { //added quotes.json, cannot find suitable api
        fetch('quotes.json')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                sentence = data[randomIndex].quote;
                startGame();
            })
            .catch(error => {
                console.error('Error fetching quotes:', error);
                sentence = 'The only limit to our realization of tomorrow is our doubts of today.'; // Fallback sentence if broken
                startGame();
            });
    }
   
    function startGame() {
        wordInput.value = "";
        wordDisplay.innerHTML = sentence;
        results.textContent = "";
        startTime = new Date().getTime(); //remember started time to negate with end time to get result, efficient, wonder what would happen if i set my date to 2026 during the type test?
    }
    function highlightTypedText(typedText) { //ui highlighting part
        const correctText = sentence.substring(0, typedText.length);
        const remainingText = sentence.substring(typedText.length);
        
        if (typedText === correctText) {
            wordDisplay.innerHTML = `<span class="correct">${correctText}</span>${remainingText}`;
        } else {
            const correctPart = typedText.split('').map((char, index) => {
                return sentence[index] === char ? `<span class="correct">${char}</span>` : `<span class="incorrect">${char}</span>`;
            }).join('');
            const remainingPart = sentence.substring(typedText.length);
            wordDisplay.innerHTML = `${correctPart}${remainingPart}`;
        }
    }

    function playKeySound() { //fixed error where sound would break, remember for newer projects, engineless solution
        keySound.currentTime = 0; // rewind to beginning
        keySound.play(); // play the sound
    }

    function getRandomWords(count) { //retrieve some words
        const words = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * dictionary.words.length);
            words.push(dictionary.words[randomIndex]);
        }
        return words;
    }
});