// Smart navigation helper
// Handles back button functionality to return to the referrer page

document.addEventListener('DOMContentLoaded', function() {
    // Find all back buttons on the page
    const backButtons = document.querySelectorAll('.back-btn');
    
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if there's a stored referrer page
            const referrerPage = sessionStorage.getItem('referrerPage');
            
            if (referrerPage) {
                // Clear the stored referrer
                sessionStorage.removeItem('referrerPage');
                // Navigate to the referrer page
                window.location.href = referrerPage;
            } else {
                // Default back behavior - use the original href
                const defaultHref = this.getAttribute('href');
                if (defaultHref) {
                    window.location.href = defaultHref;
                } else {
                    // Fallback to browser back
                    window.history.back();
                }
            }
        });
    });
});
