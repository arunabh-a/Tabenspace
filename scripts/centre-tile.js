const addButton = document.getElementById('add-tile');
const tileContainer = document.getElementById('tile-container');
function addTile() {
  const newTile = document.createElement('div');
  newTile.classList.add('tile');
  tileContainer.appendChild(newTile);
}
addButton.addEventListener('click', addTile);



const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = form.elements.q.value;
  const url = `https://www.google.com/search?q=${query}`;
  window.open(url, '_blank');
});
