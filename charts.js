// charts.js

//store data for the graph, store wpm points and timepoints
const data = {
    time: [], // to store time points
    wpm: [] // to store WPM samples
};

// init wpm chart, thanks alot to chart.js, absolutely lovely library
const wpmChart = new Chart(document.getElementById('wpmChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: data.time,
        datasets: [{
            label: 'WPM',
            data: data.wpm,
            borderColor: 'blue',
            fill: false
        }]
    },
    options: { //x goes to right which is time itself, where y is wpm and it goes up and down depending on wpm
        responsive: true,
        maintainAspectRatio: false,
        scales: { //define them
            x: {
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'WPM'
                }
            }
        }
    }
});

// update the wpm chart
function updateWpmChart() {
    wpmChart.data.labels = data.time;
    wpmChart.data.datasets[0].data = data.wpm;
    wpmChart.update();
}

// expose them to global, because, this script would be useless if they wont be accessible
window.updateWpmChart = updateWpmChart;
window.wpmData = data;

