document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var query = document.querySelector('.search-box').value;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
});