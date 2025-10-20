document.addEventListener('DOMContentLoaded', () => {

    const countDownDate = new Date("Sep 22, 2025 09:00:00");
    
    // Get HTML elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownEl = document.getElementById('countdown');

    // Update the countdown every 1 second
    const countdownInterval = setInterval(() => {

        // Get today's date and time (in milliseconds)
        const now = new Date().getTime();

        // Find the distance between now and the countdown date
        const distance = countDownDate.getTime() - now;

        // If the countdown is over, display a message and stop the timer
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownEl.innerHTML = "<h2 class='highlight' style='font-size: 2rem;'>The Sky Has Opened!</h2>";
            return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Function to add a leading zero to numbers less than 10
        const formatTime = (time) => time < 10 ? `0${time}` : time;
        
        // Display the results in their respective elements
        daysEl.textContent = formatTime(days);
        hoursEl.textContent = formatTime(hours);
        minutesEl.textContent = formatTime(minutes);
        secondsEl.textContent = formatTime(seconds);

    }, 1000);
});