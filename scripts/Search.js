// function Search() {
//   var text = document.getElementById("search").value;
//   var cleanQuery = text.replace(" ", "+", text);
//   var url = 'http://www.google.com/search?q=' + cleanQuery;

//   window.location.href = url;
// }

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
event.preventDefault();
const query = form.elements.querysearch.value; 
const url = `https://www.google.com/search?querysearch=${query}`;
window.open(url, '_blank');
});