document.getElementById('snowflakeField').addEventListener('input', (event) => {
	if (!event.target.value.match(/^\d+$/)) {
		var selStart = event.target.selectionStart;
		event.target.value = event.target.value.replaceAll(/[^\d]/g, '');
		event.target.setSelectionRange(selStart - 1, selStart - 1);
	}
	calcSnowfl();
})

function calcSnowfl() {
	let value;
	try {
		value = BigInt(document.getElementById('snowflakeField').value);
	} catch (error) {
		value = null;
		console.log(error);
	}
	if (value) {
		if (value >= (10n ** 16n) && value < (10n ** 19n)) {
			document.querySelector('label').style.color = '#ffffff';
			document.querySelector('label').innerHTML = 'Discord Snowflake';
			const unixValue = Number((BigInt(value) >> 22n) + 1420070400000n);
			const dateValue = new Date(unixValue);
			if (unixValue < Date.now()) {
				document.getElementById('output').innerHTML = `${formatDate(dateValue)}<br class="uo"><br class="uo">${msToTimeString(Math.abs(Date.now() - unixValue))} <br>(${((Date.now() - unixValue) / 24 / 60 / 60 / 1000).toFixed(2)} days) ago <br>| <button id="refreshButton" onclick="refreshButton()">Refresh</button><br class="uo"><br class="uo">Unix timestamp: <br>${(unixValue / 1000).toFixed(0)}`
			} else {
				document.getElementById('output').innerHTML = `${formatDate(dateValue)}<br class="uo"><br class="uo">in ${msToTimeString(Math.abs(unixValue - Date.now()))} <br>(${((unixValue - Date.now()) / 24 / 60 / 60 / 1000).toFixed(2)} days) <br>| <button id="refreshButton" onclick="refreshButton()">Refresh</button><br class="uo"><br class="uo">Unix timestamp: <br>${(unixValue / 1000).toFixed(0)}`
			}
		} else {
			document.querySelector('label').style.color = '#ff0000';
			document.querySelector('label').innerHTML = 'Must be between 17 and 19 digits';
			document.getElementById('output').innerHTML = '';
		}
	} else {
		document.querySelector('label').style.color = '#ffffff';
		document.querySelector('label').innerHTML = 'Discord Snowflake';
		document.getElementById('output').innerHTML = '';
	}
}

function refreshButton() {
	calcSnowfl();
}

function pad(inputStr, length, padChar) {
	if (typeof inputStr === "number") inputStr = inputStr.toString();
	var outputStr = inputStr + '';
	while (outputStr.length < length) {
		outputStr = padChar + outputStr;
	}
	return outputStr;
}

const monthsStringMap = {
	1: 'Jan',
	2: 'Feb',
	3: 'Mar',
	4: 'Apr',
	5: 'May',
	6: 'Jun',
	7: 'Jul',
	8: 'Aug',
	9: 'Sep',
	10: 'Oct',
	11: 'Nov',
	12: 'Dec'
}

function formatDate(date) {
	var result =
		pad(date.getDate(), 2, '0') +
		' ' +
		monthsStringMap[date.getMonth() + 1] +
		' ' +
		pad(date.getFullYear(), 4, '0') +
		' <br>- ' +
		pad(date.getHours(), 2, '0') +
		':' +
		pad(date.getMinutes(), 2, '0') +
		':' +
		pad(date.getSeconds(), 2, '0') +
		'<span class="small">.' +
		pad(date.getMilliseconds(), 3, '0') +
		'</span>' +
	    	date.getTimezoneOffset > 0 ? '-' : '+' +
		Math.abs(date.getTimezoneOffset / 60).toString();
	return result;
}

const timeUnitValues = {
	ms: 1,
	s: 1000,
	m: 1000 * 60,
	h: 1000 * 60 * 60,
	d: 1000 * 60 * 60 * 24,
	w: 1000 * 60 * 60 * 24 * 7,
	mth: 1000 * 60 * 60 * 24 * 30.4368,
	y: 1000 * 60 * 60 * 24 * 365.242
};

const fullTimeUnitNames = {
	ms: 'millisecond',
	s: 'second',
	m: 'minute',
	h: 'hour',
	d: 'day',
	w: 'week',
	mth: 'month',
	y: 'year'
};

function msToTimeString(time) {
	if (!Number.isFinite(time) || time <= 0) return undefined;
	if (time < 1000) return 'less than 1 second'
	let timeStr = '';
	let count = 0;
	for (let i = Object.keys(timeUnitValues).length; i >= 0; --i) {
		const key = Object.keys(timeUnitValues)[i];
		if (key === 'ms') break;
		let ctime = time / timeUnitValues[key];
		if (ctime >= 1) {
			if (2 < ++count) break;
			ctime = Math.floor(ctime);
			timeStr += `${ctime}<span style="white-space: nowrap;"> </span>${fullTimeUnitNames[key] + (ctime !== 1 ? 's' : '')} `;
			time -= ctime * timeUnitValues[key];
		}
	}
	while (timeStr.endsWith(' '))
		timeStr = timeStr.slice(0, -1);
	if (timeStr === '')
		return undefined;
	else
		return timeStr;
}

function calcSnowflake(snowflake) {
	if (typeof snowflake !== 'string' || !snowflake.match(/^\d{17,19}$/)) return undefined;
	return Number((BigInt(snowflake) >> 22n) + 1420070400000n);
}

function calcSnowflakeDifference(snowflake1, snowflake2) {
	if (typeof snowflake1 !== 'string' || !snowflake1.match(/^\d{17,19}$/) || typeof snowflake2 !== 'string' || !snowflake2.match(/^\d{17,19}$/)) return undefined;
	const unix1 = Number((BigInt(snowflake1) >> 22n) + 1420070400000n);
	const unix2 = Number((BigInt(snowflake2) >> 22n) + 1420070400000n);
	return Math.abs(unix2 - unix1);
}
