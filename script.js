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

function showMessage(s) {
	header.innerText = s;
	header.style.visibility = 'visible';
}

function hideMessage() {
	document.body.removeEventListener('click', hideMessage);
	header.style.visibility = '';
}

function showTips(e) {
	let tips = '';
	const x = tiles.get(selection[0]);
	const y = targetNumber;

	if (x < y)
		tips += `${y-x}+${x}=${y}\n`;
	else if (x > y)
		tips += `${x}\u2212${x-y}=${y}\n`;

	tips += `${y+x}\u2212${x}=${y}\n`;

	if (x < y && y%x == 0)
		tips += `${y/x}\u00D7${x}=${y}\n`;
	else if (x >= y && x%y == 0)
		tips += `${x}\u00F7${x/y}=${y}\n`;

	tips += `${y*x}\u00F7${x}=${y}\n`;

	(selection.pop()).control.checked = false;
	updateButtons();
	footer.innerText = tips;
	footer.style.visibility = 'visible';
	e.stopPropagation();
	document.body.addEventListener('click', hideTips);
}

function hideTips() {
	document.body.removeEventListener('click', hideTips);
	footer.style.visibility = '';
}

function updateButtons() {
	if (selection.length == 1)
		tipsBtn.disabled = false;
	else
		tipsBtn.disabled = true;
	
	if (selection.length == 2) {
		const x = tiles.get(selection[0]);
		const y = tiles.get(selection[1]);

		addBtn.disabled = false;
		subBtn.disabled = x == y;
		mulBtn.disabled = false;
		divBtn.disabled = (x > y ? x%y : y%x) != 0;
	}
	else {
		addBtn.disabled = true;
		subBtn.disabled = true;
		mulBtn.disabled = true;
		divBtn.disabled = true;
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
	case subBtn:
		result = x > y ? x-y : y-x;
		break;
	case mulBtn:
		result = x*y;
		break;
	case divBtn:
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
	const t = e.target.nextElementSibling;
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
	showMessage('You win!');
	document.cookie = `_=1; expires=${puzzleExpiryDate}; path=/`;
}

const header = document.getElementById('header');
const tipsBtn = document.getElementById('tips');
const addBtn = document.getElementById('add');
const subBtn = document.getElementById('sub');
const mulBtn = document.getElementById('mul');
const divBtn = document.getElementById('div');
const undoBtn = document.getElementById('undo');
const labels = document.getElementsByTagName('label');
const target = document.getElementById('target');
const footer = document.getElementById('footer');

const selection = [];
const states = [];
const tiles = new Map();

for (let i = 0; i < labels.length; i++)
	tiles.set(labels[i], numbers[i]);

if (document.cookie != '') {
	showMessage('Try again?');
	document.body.addEventListener('click', hideMessage);
}

tipsBtn.onclick = showTips;
addBtn.onclick = buttonClicked;
subBtn.onclick = buttonClicked;
mulBtn.onclick = buttonClicked;
divBtn.onclick = buttonClicked;
undoBtn.onclick = () => restoreState(states.pop());
tiles.forEach((_, t) => t.control.onchange = tileSelected);
syncTiles();
target.innerText = targetNumber;
