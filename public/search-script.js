function searchOnEnter(event) {
    if (event.key === "Enter") {
        var query = document.getElementById('search').value;
        window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
    }
}