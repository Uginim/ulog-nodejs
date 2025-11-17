// Dark Mode Toggle
(function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.querySelector('.dark-mode-icon');
    const body = document.body;

    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set initial state
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (darkModeIcon) darkModeIcon.textContent = '☀️';
    }

    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');

            // Save preference
            localStorage.setItem('darkMode', isDark);

            // Update icon
            if (darkModeIcon) {
                darkModeIcon.textContent = isDark ? '☀️' : '🌙';
            }
        });
    }
})();
