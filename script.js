/* Copyright 2024 Oğuz İsmail Uysal <oguzismailuysal@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function saveState() {
	const s = new Map();
	tiles.forEach((number, t) =>
		s.set(t, {
			number,
			selected: t.control.checked,
			selectionIndex: selection.indexOf(t),
			display: t.style.display
		})
	);
	states.push(s);
}

function restoreState(s) {
	s.forEach((ts, t) => {
		if (ts.selected)
			selection[ts.selectionIndex] = t;

		tiles.set(t, ts.number);
		t.control.checked = ts.selected;
		t.style.display = ts.display;
	});
	
	updateButtons();
	syncTiles();
}

function updateButtons() {
	if (selection.length == 2) {
		const x = tiles.get(selection[0]);
		const y = tiles.get(selection[1]);

		if (x == y)
			subtractBtn.disabled = true;
		else
			subtractBtn.disabled = false;

		if ((x > y ? x%y : y%x) != 0)
			divideBtn.disabled = true;
		else
			divideBtn.disabled = false;

		addBtn.disabled = false;
		multiplyBtn.disabled = false;
	}
	else {
		addBtn.disabled = true;
		subtractBtn.disabled = true;
		multiplyBtn.disabled = true;
		divideBtn.disabled = true;
	}
	
	if (states.length == 0)
		undoBtn.disabled = true;
	else
		undoBtn.disabled = false;
}

function syncTiles() {
	tiles.forEach((n, t) => t.innerText = n);
}

function buttonClicked(e) {
	const x = tiles.get(selection[0]);
	const y = tiles.get(selection[1]);
	let result;

	switch (e.target) {
	case addBtn:
		result = x+y;
		break;
	case subtractBtn:
		result = x > y ? x-y : y-x;
		break;
	case multiplyBtn:
		result = x*y;
		break;
	case divideBtn:
		result = x > y ? x/y : y/x;
		break;
	}

	saveState();
	(selection.pop()).style.display = 'none';
	updateButtons();
	tiles.set(selection[0], result);
	syncTiles();

	if (result == targetNumber)
		endGame();
}

function tileSelected(e) {
	const t = e.target.labels[0];
	if (t.control.checked) {
		if (selection.length == 2)
			(selection.shift()).control.checked = false;

		selection.push(t);
	}
	else {
		selection.splice(selection.indexOf(t), 1);
	}

	updateButtons();
}

function endGame() {
	selection.splice(0);
	states.splice(0);
	updateButtons();
	tiles.forEach((_, t) => t.control.disabled = true);
	banner.innerText = 'You win!';
	banner.style.display = 'block';
	document.cookie = '_=1; expires='+puzzleExpiryDate+'; path=/';
}

const banner = document.getElementById('banner');
const addBtn = document.getElementById('add');
const subtractBtn = document.getElementById('subtract');
const multiplyBtn = document.getElementById('multiply');
const divideBtn = document.getElementById('divide');
const undoBtn = document.getElementById('undo');
const labels = document.getElementsByTagName('label');
const target = document.getElementById('target');

const selection = [];
const states = [];
const tiles = new Map();

for (let i = 0; i < labels.length; i++)
	tiles.set(labels[i], numbers[i]);

if (document.cookie != '') {
	banner.innerText = 'Try again?';
	banner.style.display = 'block';
	document.body.onclick = () => {
		document.body.onclick = '';
		banner.style.display = 'none';
	};
}

addBtn.onclick = buttonClicked;
subtractBtn.onclick = buttonClicked;
multiplyBtn.onclick = buttonClicked;
divideBtn.onclick = buttonClicked;
undoBtn.onclick = () => restoreState(states.pop());
tiles.forEach((_, t) => t.control.onchange = tileSelected);
syncTiles();
target.innerText = targetNumber;
