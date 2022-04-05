// includes
const conf = require("./conf");

let util = {}

util.cookies = {
	create() {
		let beginDate = 1633783097105;

		let part1 = Date.now() - beginDate;
		part1 = part1.toString(36);

		let rand = Math.random().toString(36);
		let part2 = rand.substring(2, rand.length);

		let newCookie = part1 + part2;

		return newCookie;
	}
}

util.token = {
	create(length) {
		let cara = 'AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn0123456789';
		let token = '';
		while (token.length < length) {
			token += cara[Math.floor(Math.random() * cara.length)];
		}
		return token;
	}
}

util.nba = {
	create(min, max) {
		if (min < max) return Math.floor(Math.random() * (max - min + 1)) + min;
		else return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

util.intSum = (num) => {
	let sum = 0;
	while (num) {
		sum += num;
		num--;
	}
	return sum;
}

module.exports = util;