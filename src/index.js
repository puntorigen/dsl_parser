import helper from 'helper'

export default class dsl_parser {

	constructor(thefile, config) {
		let def_config = {
			cancelled:false,
			debug:true
		};
		this.file = thefile;
		this.config = {...config, ...def_config};
		this.help = new helper();
		this.$ = null;
	}

	async process() {
		if (this.file!='') {
			this.help.title('DSL Parser for '+this.file);
			if (this.config.debug) console.time('process');
			let cheerio = require('cheerio'), path = require('path');
			let fs = require('fs').promises;
			let fileExists = false, data='';
			data = await fs.readFile(this.file,'utf-8');
			// fix accents -> unicode to latin chars
			if (this.config.debug) console.log('fixing accents');
			data = this.help.fixAccents(data);
			// parse XML 
			this.$ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities:false });
			// remove cancelled nodes if requested
			if (!this.config.cancelled) {
				if (this.config.debug) console.log('removing cancelled nodes from tree');
				this.$('icon[BUILTIN*=button_cancel]').parent().remove();
			}
			if (this.config.debug) console.timeEnd('process');
			//if (this.config.debug) console.log('dsl dump',this.$('*').html());
		}
	}

	getParser() {
		return this.$;
	}

	async getNodes({text,attribute,attribute_value,icon,level,link,recurse=true}={}) {
		let resp = [], nodes=null, me=this;
		if (text) {
			let tmp = text.toString().replace(/ /g,'\\ ');
			nodes = this.$(`node[text*=${tmp}]`);
		} else if (attribute) {
			let tmp = attribute.replace(/ /g,'\\ ');
			nodes = this.$(`attribute[name*=${tmp}]`).parent('node');
		} else if (attribute_value) {
			let tmp = attribute_value.replace(/ /g,'\\ ');
			nodes = this.$(`attribute[value*=${tmp}]`).parent('node');
		} else if (icon) {
			let tmp = icon.replace(/ /g,'\\ ');
			nodes = this.$(`icon[builtin*=${tmp}]`).parent('node');
		} else if (level) {
			nodes = this.$(`node`).filter(function(i,elem) {
				let padres = -1;
				try {
					padres = me.$(elem).parents('node').length+1;
				} catch(ee) {}
				return padres===level;
			});
		} else if (link) {
			let tmp = link.replace(/ /g,'\\ ');
			nodes = this.$(`node[link*=${tmp}]`);
		} else {
			nodes = this.$(`node`);
		}
		// iterate nodes and build resp array
		if (nodes!=null) {
			nodes.map(async function(i,elem) {
				let cur = me.$(elem);
				if (typeof cur.attr('ID') != 'undefined') {
					let tmp = await me.getNode({ id:cur.attr('ID'), recurse:recurse });
					resp.push(tmp);
				}
			});
		}
		return resp;
	}

	async getNode({id=this.throwIfMissing('id'), recurse=true, justlevel, dates=true}={}) {
		if (this.$===null) throw new Error('call process() first!');
		let me = this;
		let resp = { 	level:-1,	text:'',	text_rich:'',	text_node:'',	image:'',
						cloud:
							{ used:false, bgcolor:'' },	
						arrows:[], 	nodes:[],
						font:
							{ face:'SansSerif', size:12, bold:false, italic:false },
						style:'',		color: '',	bgcolor: '',	link:'',	position:'',
						attributes: [],	icons: [],	
						date_modified: new Date(),	
						date_created: new Date(),
						valid: true
					};
		let nodes = me.$('node[ID='+id+']').each(async function(i,elem) {
			let cur = me.$(elem), pa_ac = -1;
			resp.id = cur.attr('ID');
			resp.level = cur.parents('node').length+1;
			// limit level if defined
			if (justlevel && resp.level!=justlevel) {
				resp.valid=false;
				return false;
			}
			//
			if (typeof cur.attr('LINK') != 'undefined') resp.link = cur.attr('LINK').split('#').join('');
			if (typeof cur.attr('POSITION') != 'undefined') resp.position = cur.attr('POSITION');
			if (typeof cur.attr('COLOR') != 'undefined') resp.color = cur.attr('COLOR');
			if (typeof cur.attr('BACKGROUND_COLOR') != 'undefined') resp.bgcolor = cur.attr('BACKGROUND_COLOR');
			if (typeof cur.attr('STYLE') != 'undefined') resp.style = cur.attr('STYLE');
			if (typeof cur.attr('TEXT') != 'undefined') resp.text = cur.attr('TEXT');
			// dates parsing
			if (dates) {
				if (typeof cur.attr('CREATED') != 'undefined') {
					resp.date_created = new Date(parseFloat(cur.attr('CREATED')));		
				}
				if (typeof cur.attr('MODIFIED') != 'undefined') {
					resp.date_modified = new Date(parseFloat(cur.attr('MODIFIED')));	
				}
			}
			// attributes
			cur.find('node[ID='+resp.id+'] > attribute').map(function(a,a_elem) {
				let tmp_fila = {}, _fila = me.$(a_elem);
				tmp_fila[_fila.attr('NAME')] = _fila.attr('VALUE');
				resp.attributes.push(tmp_fila);
			});
			// icons
			cur.find('node[ID='+resp.id+'] > icon').map(function(a,a_elem) {
				resp.icons.push(me.$(a_elem).attr('BUILTIN'));
			});
			// fonts definition
			cur.find('node[ID='+resp.id+'] > font').map(function(a,a_elem) {
				let _fila = me.$(a_elem);
				resp.font.face = _fila.attr('NAME');
				resp.font.size = _fila.attr('SIZE');
				if (typeof _fila.attr('BOLD') != 'undefined') {
					resp.font.bold = _fila.attr('BOLD');
				}
				if (typeof _fila.attr('ITALIC') != 'undefined') {
					resp.font.italic = _fila.attr('ITALIC');
				}
			});
			// cloud definition
			cur.find('node[ID='+resp.id+'] > cloud').map(function(a,a_elem) {
				let _fila = me.$(a_elem);
				resp.cloud.used = true;
				if (typeof _fila.attr('COLOR') != 'undefined') {
					resp.cloud.bgcolor = _fila.attr('COLOR');
				}
			});
			// get image if any on node
			cur.find('node[ID='+resp.id+'] > richcontent[TYPE=NODE] body').map(function(a,a_elem) {
				resp.text_rich = me.$(a_elem).html();
				me.$(a_elem).find('img[src]').map(function(i,i_elem) {
					resp.image = me.$(i_elem).attr('src');
				});
			});
			// get notes on node if any
			cur.find('node[ID='+resp.id+'] > richcontent[TYPE=NOTE] body').map(function(a,a_elem) {
				resp.text_node = me.$(a_elem).text();
			});
			// get defined arrows on node if any
			cur.find('node[ID='+resp.id+'] > arrowlink').map(function(a,a_elem) {
				let _fila = me.$(a_elem), _tmp_f={ target:'', color:'', style:'' }, _tmpa={};
				_tmp_f.target = _fila.attr('DESTINATION');
				if (typeof _fila.attr('COLOR') != 'undefined') {
					_tmp_f.color = _fila.attr('COLOR');
				}
				_tmpa.type = _fila.attr('STARTARROW') + '-' + _fila.attr('ENDARROW');
				if (_tmpa.type.indexOf('None-Default')!=-1) {
					_tmp_f.style = 'source-to-target';
				} else if (_tmpa.type.indexOf('Default-None')!=-1) {
					_tmp_f.style = 'target-to-source';
				} else {
					_tmp_f.style = 'both-ways';
				}
				resp.arrows.push(_tmp_f);
			});
			// get children nodes .. (using myself for each child)
			if (recurse==true) {
				cur.find('node').map(async function(a,a_elem) {
					let _nodo = me.$(a_elem);
					let hijo = await me.getNode({ id:_nodo.attr('ID'), recurse:recurse, justlevel:resp.level+1 });
					if (hijo.valid) {
						delete hijo.valid;
						resp.nodes.push(hijo);
					}
				});
			}
			// break loop
			return false;
		});
		// remove 'valid' key if justLevel is not defined
		if (!justlevel) delete resp.valid;
		// reply
		return resp;
	}

	async getParentNode({id=this.throwIfMissing('id')}={}) {
		if (this.$===null) throw new Error('call process() first!');
		let padre = this.$(`node[ID=${id}]`).parent('node');
		let resp = {}, me = this;
		if (typeof padre.attr('ID') != 'undefined') {
			resp = await me.getNode({ id:padre.attr('ID'), recurse:false });
		}
		return resp;
	}


	// ********************
	// private methods
	// ********************

	throwIfMissing(name) {
        throw new Error('Missing '+name+' parameter!');
    }

	showme() {
		this.help.title('TEST');
		console.log('debug test',{ thefile:this.file, config:this.config });
	}

}
