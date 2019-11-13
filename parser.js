const fs = require('fs');
const util = require('util');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const cheerio = require('cheerio');
const _ = require('underscore');

let parser = {
	public: {
		init: async function(file,flags) {
			this.private.flags = flags;
			let raw_data = await readFile(file);
			const data = this.private.helpers.fixAccents(raw_data);
			let $ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities:false });
			if (_.has(flags,'cancelled') && !flags.cancelled) {
				$('icon[BUILTIN*=button_cancel]').parent().remove();
			}
			this.private.state = $;
			return $;
		},
		getParser: async function() {
			return this.private.state;
		},
		getNode: async function(id,recurse) {

		}
	},
	private: {
		debug: false,
		flags: {},
		state: {},
		helpers: {
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
		}
	}
};
module.exports = parser.public;