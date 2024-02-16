// navigator responsive
document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    $navbarBurgers.forEach((el) => {
        el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
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
if (f) {
    f.addEventListener('submit', submitted);
}

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

document.addEventListener('DOMContentLoaded', function () {
    adjustColumnHeights();
});

function adjustColumnHeights() {
    var columns = document.querySelectorAll('.post-column');

    columns.forEach(function (column) {
        var height = column.offsetHeight;
        column.style.height = height + 'px';
    });
}
