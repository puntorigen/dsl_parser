var colors_ = require('colors')

export default class helper {

	constructor(config={ debug:true }) {
		this.config = config;
	}

	title(title) {
		if (this.config.debug) {
			let _t = '***\ '+title+'\ ***';
			let _l = this.repeat('*',_t.length);
			console.log(_l.green);
			console.log(_t.green);
			console.log(_l.green);
		}
	}

	repeat(string,count) {
		if (count<1) return '';
		let result='', pattern = string.valueOf();
		while (count>1) {
			if (count & 1) result += pattern;
		    count >>>= 1, pattern += pattern;
		}
		return result + pattern;
	}

	fixAccents(text) {
		let ctext = text;
		let from = '';
		const table = {
			'C1'	:	'A',
			'E1'	:	'á',
			'C9'	:	'E',
			'E9'	:	'é',
			'CD'	:	'I',
			'ED'	:	'í',
			'D1'	:	'Ñ',
			'F1'	:	'ñ',
			'D3'	:	'O',
			'F3'	:	'ó',
			'DA'	:	'U',
			'FA'	:	'ú',
			'DC'	:	'U',
			'FC'	:	'ü',
			'AB'	:	'«',
			'BB'	:	'»',
			'BF'	:	'¿',
			'A1'	:	'¡',
			'80'	:	'€',
			'20A7'	:	'Pts'
		};
		for (from in table) {
			ctext.replace('&#x'+from,table[from]);
		}
		return ctext;
	}

}