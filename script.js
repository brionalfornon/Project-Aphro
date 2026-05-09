document.addEventListener("DOMContentLoaded", () => {
    const introContainer = document.getElementById("introContainer");
    const timelineContainer = document.getElementById("timelineContainer");

    // This function handles the fade transition
    const startExperience = () => {
        // Fade out the intro text
        introContainer.classList.add("hidden");
        
        // Fade in the buttons
        timelineContainer.classList.add("active");
        
        // Change cursor back to default since the background is no longer a giant button
        document.body.style.cursor = "default";
        
        // Remove the event listener so clicks on the buttons don't re-trigger this
        document.removeEventListener("click", startExperience);
    };

    // Listen for a click anywhere on the page
    document.addEventListener("click", startExperience);
    
    // Optional: Add listeners to the year buttons to handle future navigation
    const yearButtons = document.querySelectorAll('.year-btn');
    yearButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Stops the click from bubbling up just in case
            event.stopPropagation(); 
            
            const selectedYear = event.target.innerText;
            console.log(`Navigating to ${selectedYear}...`);
            // Add your logic to load the specific year's gallery or page here
        });
    });
});