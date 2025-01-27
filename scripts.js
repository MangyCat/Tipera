document.addEventListener('DOMContentLoaded', () => { //this thing is more layered than an onion at this point
    const dictionaryModeButton = document.getElementById('dictionary-mode'); //dict button
    const quoteModeButton = document.getElementById('quote-mode'); //quotes button
    const wordDisplay = document.getElementById('word-display'); //displays requested words to type
    const wordInput = document.getElementById('word-input'); //input your words
    const results = document.getElementById('results'); //oh.... am i pregnant? (clearly thermometer at 104 farenheit (its prob 40 celcius for all i know))
    const keySound = document.getElementById('key-sound'); //osu
    const wordCountSelect = document.getElementById('word-count-select'); //select an amount of words using drop down
    const graphs = document.getElementById('graphs'); // Graphs section
    let sentence = ''; //easter egg, try going into the console and setting the sentence to whatever you want it'll still kinda work
    let startTime = 0; 
    let errors = 0; //irreversible
    let intervalId;

    // Data storage for the WPM graph
    const data = {
        time: [], // to store time points, it will only end at 9.00 for example even though its 9.7 but not that important, variance will be 1-5 wpm
        wpm: [] // to store WPM samples captured every half a second
    };

    dictionaryModeButton.addEventListener('click', () => {
        fetchSentenceFromDictionary();
    });

    quoteModeButton.addEventListener('click', () => {
        fetchSentenceFromQuotes();
    });

    wordInput.addEventListener('input', () => {
        const typedText = wordInput.value;
        playKeySound();
        highlightTypedText(typedText);

        // error snatcher
        if (!sentence.startsWith(typedText)) {
            errors++;
        }

        // Calculate accuracy
        const accuracy = ((typedText.length - errors) / typedText.length) * 100;

        if (typedText.trim() === sentence) {
            clearInterval(intervalId); // Stop the sampling interval
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000; // time in seconds
            const wordsTyped = sentence.trim().split(/\s+/).length; // similar to regexxing
            const charactersTyped = typedText.trim().length;
            const wpm = Math.round(wordsTyped / (duration / 60));
            const cpm = Math.round(charactersTyped / (duration / 60));
            results.textContent = `Done! Your WPM: ${wpm} | CPM: ${cpm} | Accuracy: ${accuracy.toFixed(2)}% | Time: ${duration.toFixed(2)}s`; //string haven

            // Show graphs section
            graphs.style.display = 'block';

            // Final update for the WPM chart
            updateWpmChart();
        }
    });

    function fetchSentenceFromDictionary() {
        clearInterval(intervalId); // Ensure previous interval is cleared
        const wordCount = parseInt(wordCountSelect.value, 10);
        const randomWords = getRandomWords(wordCount);
        sentence = randomWords.join(' ');
        startGame();
    }

    function fetchSentenceFromQuotes() {
        clearInterval(intervalId); // Ensure previous interval is cleared, quotes fixed to sample properly
        fetch('quotes.json')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                sentence = data[randomIndex].quote;
                startGame();
            })
            .catch(error => { //replace with api one day? use quotes.json as an fallback if we get an api
                console.error('Error fetching quotes:', error);
                sentence = 'The only limit to our realization of tomorrow is our doubts of today.'; // Fallback sentence
                startGame();
            });
    }

    function startGame() {
        wordInput.value = "";
        wordDisplay.innerHTML = sentence;
        results.textContent = "";
        startTime = new Date().getTime();
        errors = 0; // Reset errors
        wpmData.time = []; // Reset time data
        wpmData.wpm = []; // Reset WPM data
        graphs.style.display = 'none'; // Hide graphs section at the start

        // Start sampling WPM every half a second
        intervalId = setInterval(() => { //sampling from the chart and for data collection for other day
            const currentTime = (new Date().getTime() - startTime) / 1000; // time in seconds
            const wordsTyped = wordInput.value.trim().split(/\s+/).length;
            const wpm = Math.round(wordsTyped / (currentTime / 60));

            wpmData.time.push(currentTime.toFixed(2));
            wpmData.wpm.push(wpm);

            updateWpmChart();
        }, 500);
    }

    function highlightTypedText(typedText) { //purely for illustration, has no game changing effect except highlighting where you went wrong
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

    function playKeySound() { //better than all those sound engines they've been flexing around
        keySound.currentTime = 0; // rewind to the beginning
        keySound.play(); // play the sound
    }

    function getRandomWords(count) { //gets random words from dictionary
        const words = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * dictionary.words.length);
            words.push(dictionary.words[randomIndex]);
        }
        return words;
    }

    // prevent pesky cheators from trying to win by copy and pasting, this will disable pasting into the field
    wordInput.addEventListener('paste', (e) => {
        e.preventDefault();
    });

    wordInput.addEventListener('copy', (e) => {
        e.preventDefault();
    });
});
