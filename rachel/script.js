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

import Module from './rachel.js';

function run() {
	output.value = '';

	const args = input.value.trim().split(/\s+/);
	if (args.length < 2 || args.length > 7) {
		alert('fewer/more operands than expected');
		return;
	}

	for (let i = 0; i < args.length; i++) {
		const x = parseInt(args[i]);
		if (isNaN(x) || x <= 0) {
			alert('bad number: '+args[i]);
			return;
		}

		args[i] = x;
	}

	while (args.length < 7)
		args.splice(0, 0, 0);

	if (!rachel.apply(null, args))
		alert('no answer');
}

const input = document.getElementById('input');
const output = document.getElementById('output');
const rachel = (await Module())._rachel;

input.form.onsubmit = run;
input.focus();
