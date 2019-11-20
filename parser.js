const fs = require('fs');
const util = require('util');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const cheerio = require('cheerio');
const _ = require('underscore');
const helpers = require('./helpers');

let parser = {
	private: {
		debug: false,
		flags: {},
		state: {}
	},
	public: {
		init: async function(file,flags) {
			if (flags) this.private.flags = flags;
			let raw_data = await readFile(file);
			const data = helpers.fixAccents(raw_data);
			let $ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities:false });
			if (_.has(flags,'cancelled') && !flags.cancelled) {
				$('icon[BUILTIN*=button_cancel]').parent().remove();
			}
			this.parser.private.state = $;
			return this;
		},
		getParser: async function() {
			return this.private.state;
		},
		getNode: async function(id,recurse) {
			console.log('getNode called');
		}
	}
};
module.exports = parser.public;