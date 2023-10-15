// navigator responsive
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

        });
    });

});

// searching
const f = document.getElementById('searchForm');
const q = document.getElementById('query');
const google = 'https://www.google.com/search?q=site%3A';
const site = window.location.host;

function submitted(event) {
    event.preventDefault();
    const url = google + site + '+' + q.value;
    const win = window.open(url, '_blank');
    win.focus();
}

f.addEventListener('submit', submitted);


// dark theme
// let darkMode = localStorage.getItem("darkMode");

// const darkModeToggle = document.querySelector("#dark-theme-toggle");

// const enableDarkMode = () => {
//     document.body.classList.add("dark-theme");
//     localStorage.setItem("darkMode", "enabled");
// };

// const disableDarkMode = () => {
//     document.body.classList.remove("dark-theme");
//     localStorage.setItem("darkMode", null);
// };

// if (darkMode === "enabled") {
//     enableDarkMode();
// }

// darkModeToggle.addEventListener("click", () => {
//     darkMode = localStorage.getItem("darkMode");

//     if (darkMode !== "enabled") {
//         enableDarkMode();
//     } else {
//         disableDarkMode();
//     }
// });

