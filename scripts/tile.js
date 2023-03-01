const addButton = document.getElementById('add-tile');
const tileContainer = document.getElementById('tile-container');
function addTile() {
  const newTile = document.createElement('div');
  newTile.classList.add('tile');
  tileContainer.appendChild(newTile);
}
addButton.addEventListener('click', addTile);