/**
 * Header Include Script
 * This script loads the header component into pages
 * Usage: Add <script src="_header-include.js"></script> before </body>
 */

(function() {
    const headerPath = '_header.html';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', headerPath, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const headerHTML = xhr.responseText;
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerHTML;
            }
        }
    };
    xhr.send();
})();
