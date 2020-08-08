export default class helper {

	constructor(config) {
		let def_config = { debug:true }; 
		this.config = {...def_config,...config};
	}

	fixAccents(text,recover) {
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
		if (recover) {
			for (from in table) {
				ctext.replace(table[from],'&#x'+from);
			}
		} else {
			for (from in table) {
				ctext.replace('&#x'+from,table[from]);
			}
		}
		return ctext;
	}

}