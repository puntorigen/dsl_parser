import helper from 'helper'

/**
* dsl_parser: A class for parsing Concepto DSL files, and compile them with the OPEN Framework.<br/><caption>Note: You need to pass all arguments as an Object with keys.</caption>
* @name 	dsl_parser
* @module 	dsl_parser
**/
export default class dsl_parser {

	constructor({ file=this.throwIfMissing('file'), config={} }={}) {
		let console_ = require('open_console');
		let def_config = {
			cancelled:false,
			debug:true
		};
		this.file = file;
		this.config = {...def_config,...config};
		this.help = new helper();
		this.debug = new console_({ silent:!this.config.debug });
		this.$ = null;
	}

	async process() {
		if (this.file!='') {
			this.debug.setPrefix({ prefix:'dsl_parser', color:'yellow' });
			this.debug.title({ title:'DSL Parser for '+this.file, color:'green' });
			this.debug.time({ id:'process' });
			//if (this.config.debug) console.time('process');
			let cheerio = require('cheerio'), path = require('path');
			let fs = require('fs').promises;
			let fileExists = false, data='';
			data = await fs.readFile(this.file,'utf-8');
			// fix accents -> unicode to latin chars
			this.debug.outT({ message:'fixing accents' });
			//if (this.config.debug) console.log('fixing accents');
			data = this.help.fixAccents(data);
			// parse XML 
			this.$ = cheerio.load(data, { ignoreWhitespace: false, xmlMode:true, decodeEntities:false });
			// remove cancelled nodes if requested
			if (!this.config.cancelled) {
				this.debug.outT({ message:'removing cancelled nodes from tree' });
				//if (this.config.debug) console.log('removing cancelled nodes from tree');
				this.$('icon[BUILTIN*=button_cancel]').parent().remove();
			}
			this.debug.timeEnd({ id:'process' });
			//if (this.config.debug) console.timeEnd('process');
		}
	}

	/**
	* Gets a reference to the internal parser
	* @return 	{Object}
	*/
	getParser() {
		return this.$;
	}

	/**
	* Get all nodes that contain the given arguments (all optional)
	* @param 	{String}	[text]				- Finds all nodes that contain its text with this value
	* @param 	{String}	[attribute]			- Finds all nodes that contain an attribute with this name
	* @param 	{String}	[attribute_value]	- Finds all nodes that contain an attribute with this value
	* @param 	{String}	[icon]				- Finds all nodes that contain these icons
	* @param 	{Int}		[level] 			- Finds all nodes that are on this level
	* @param 	{String}	[link] 				- Finds all nodes that contains this link
	* @param 	{Boolean}	[recurse=true]		- include its children 
	* @return 	{Array}
	*/
	async getNodes({ text,attribute,attribute_value,icon,level,link,recurse=true }={}) {
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

	/**
	* Get node data for the given id
	* @param 	{Int}		id				- ID of node to request
	* @param 	{Boolean}	[recurse=true] 	- include its children
	* @param 	{Boolean}	[dates=true]	- include parsing creation/modification dates
	* @param 	{Boolean}	[$=false]		- include cheerio reference
	* @return 	{Array}
	*/
	async getNode({ id=this.throwIfMissing('id'), recurse=true, justlevel, dates=true, $=false }={}) {
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
			// add ref to $
			if ($) resp.$ = cur;
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

	/**
	* Returns the parent node of the given node id
	* @param 	{Int}		id				- ID of node to request
	* @param 	{Boolean}	[recurse=false] - include its children
	* @return 	{Object} 
	*/
	async getParentNode({ id=this.throwIfMissing('id'), recurse=false }={}) {
		if (this.$===null) throw new Error('call process() first!');
		let padre = this.$(`node[ID=${id}]`).parent('node');
		let resp = {}, me = this;
		if (typeof padre.attr('ID') != 'undefined') {
			resp = await me.getNode({ id:padre.attr('ID'), recurse:recurse });
		}
		return resp;
	}

	/**
	* Returns the parent nodes ids of the given node id
	* @param 	{Int}			id 				- node id to query
	* @param 	{Boolean}		[array=false]	- get results as array, or as a string
	* @return 	{String|Array}
	*/
	async getParentNodesIDs({ id=this.throwIfMissing('id'), array=false }={}) {
		let padres = this.$(`node[ID=${id}]`).parents('node');
		let resp = [], me=this;
		padres.map(function(i,elem) {
			let item = me.$(elem);
			if (typeof item.attr('ID') != 'undefined') {
				resp.push(item.attr('ID'));
			}
		});
		// delete the last item (central node) and return
		resp.pop();
		if (array) {
			return resp;
		} else {
			return resp.join(',');
		}
	}

	/**
	* Returns the children nodes ids of the given node id
	* @param 	{Int}		id 				- node id to query
	* @param 	{Boolean}	[array=false]	- get results as array, or as a string
	* @return 	{String|Array}
	*/
	async getChildrenNodesIDs({ id=this.throwIfMissing('id'), array=false }={}) {
		let hijos = this.$(`node[ID=${id}]`).find('node');
		let resp = [], me=this;
		hijos.map(function(i,elem) {
			let item = me.$(elem);
			if (typeof item.attr('ID') != 'undefined') {
				resp.push(item.attr('ID'));
			}
		});
		if (array) {
			return resp;
		} else {
			return resp.join(',');
		}
	}

	/**
	* Returns the brother nodes ids of the given node id
	* @param 	{Int}		id 				- node id to query
	* @param 	{Boolean}	[before=true] 	- consider brothers before the queried node
	* @param 	{Boolean}	[after=true] 	- consider brothers after the queried node
	* @return 	{String}
	*/
	async getBrotherNodesIDs({ id=this.throwIfMissing('id'), before=true, after=true }={}) {
		let me_data = await this.getNode({ id:id, recurse:false, $:true });
		let resp = [];
		if (before) {
			let prev = me_data.$.prev('node'); 
			while (typeof prev.get(0) != 'undefined') {
				resp.push(prev.get(0).attribs.ID);
				prev = prev.prev('node');
			}
		}
		if (after) {
			let next = me_data.$.next('node'); 
			while (typeof next.get(0) != 'undefined') {
				resp.push(next.get(0).attribs.ID);
				next = next.next('node');
			}	
		}
		// return
		return resp.join(',');
	}

	async createGitVersion() {
		// 1) get copy of current DSL content into memory (for restoring after returning)
		// 2) get all nodes
		let nodes = this.$(`node`);
		// 3) replace all attributes CREATED with fixed value
		// 4) replace all attributes MODIFIED with fixed value
		// 5) erase all attributes VSHIFT
		// 6) erase all attributes HGAP
		// 7) transform all latin accents into original-unicodes (fixAccents(text,recover=true) (helper class))
	}

	// ********************
	// private methods
	// ********************

	throwIfMissing(name) {
        throw new Error('Missing '+name+' parameter!');
    }

    /**
	* Finds variables within given text
	* @param 	{String}	text 				- String from where to parse variables
	* @param 	{Boolean}	[symbol=**]			- Wrapper symbol used as variable openning definition.
	* @param 	{Boolean}	[symbol_closing=**] - Wrapper symbol used as variable closing definition.
	* @return 	{String}
	*/
    findVariables({ text=this.throwIfMissing('text'),symbol='**',symbol_closing='**', array=false }={}) {
		const escapseRegExp = function(str) {
		    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}		
		let extractorPattern = new RegExp(escapseRegExp(symbol) + '(.*?)' + escapseRegExp(symbol_closing), 'g');
		let resp=[];
		let nadamas = false;
		while(!nadamas) {
			let test = new RegExp(extractorPattern,'gim');
			let utiles = text.match(test);
			for (let i in utiles) {
				resp.push(utiles[i].split(symbol).join('').split(symbol_closing).join(''));
			}
			nadamas = true;
		}
		return (array)?resp:resp.join(',');
	}

}
