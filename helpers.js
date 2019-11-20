let helpers = {
	fixAccents: function(text) {
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
};
module.exports = helpers;