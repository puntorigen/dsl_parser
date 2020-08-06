import helper from 'helper'

/**
* dsl_parser: A class for parsing Concepto DSL files, and compile them with the OPEN Framework.
* @name 	dsl_parser
* @module 	dsl_parser
**/

/**
 * A node object representation of a DSL node.
 * @typedef {Object} NodeDSL
 * @property {number} id - Node unique ID.
 * @property {number} level - Indicates the depth level from the center of the dsl map.
 * @property {string} text - Indicates the text defined in the node itself.
 * @property {string} text_rich - Indicates the html defined in the node itself.
 * @property {string} text_note - Indicates the text/html defined in the notes view of the node (if any).
 * @property {string} image - Image link defined as an image within the node.
 * @property {Object} cloud - Cloud information of the node.
 * @property {string} cloud.bgcolor - Background color of cloud.
 * @property {boolean} cloud.used - True if cloud is used, false otherwise. 
 * @property {Arrow[]} arrows - Visual connections of this node with other nodes {@link #module_dsl_parser..Arrow}.
 * @property {NodeDSL[]} nodes - Children nodes of current node.
 * @property {Object} font - Define font, size and styles of node texts.
 * @property {Object} font.face - Font face type used on node.
 * @property {Object} font.size - Font size used on node.
 * @property {Object} font.bold - True if node text is in bold.
 * @property {Object} font.italic - True if node text is in italics.
 * @property {string} style - Style applied to the node.
 * @property {string} color - Text color of node.
 * @property {string} bgcolor - Background color of node.
 * @property {string} link - Link defined on node.
 * @property {string} position - Position in relation of central node (left,right).
 * @property {Object[]} attributes - Array of objects with each attribute (key is attribute name, value is attribute value).
 * @property {string[]} icons - Array with icon names used in the node.
 * @property {date} date_modified - Date of node when it was last modified.
 * @property {date} date_created - Date of node when it was created.
 */

 /**
 * Arrow object definition, for connections to other nodes within a DSL.
 * @typedef {Object} Arrow
 * @property {string} target - Target node ID of connection.
 * @property {string} color - Color of visual connection.
 * @property {string} style - Graphical representation type of link (source-to-target, target-to-source, both-ways). 
*/

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

	/**
	* Executes initial processing for parser
	*/
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
	* @param 	{Boolean}	[nodes_raw=false]	- if this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them.
	* @return 	{NodeDSL[]}
	*/
	async getNodes({ text,attribute,attribute_value,icon,level,link,recurse=true,nodes_raw=false }={}) {
		let resp = [], nodes=null, me=this, fmatch='';
		if (nodes_raw==true) recurse=false;
		// match first param that is defined
		if (text) {
			let tmp = text.toString().replace(/ /g,'\\ ');
			nodes = this.$(`node[TEXT*=${tmp}]`);
			fmatch = 'text';
		} else if (attribute) {
			let tmp = attribute.replace(/ /g,'\\ ');
			nodes = this.$(`attribute[NAME*=${tmp}]`).parent('node');
			fmatch = 'attribute';
		} else if (attribute_value) {
			let tmp = attribute_value.replace(/ /g,'\\ ');
			nodes = this.$(`attribute[VALUE*=${tmp}]`).parent('node');
			fmatch = 'attribute_value';
		} else if (icon) {
			let tmp = icon.replace(/ /g,'\\ ');
			nodes = this.$(`icon[BUILTIN*=${tmp}]`).parent('node');
			fmatch = 'icon';
		} else if (level && !isNaN(level)) {
			nodes = this.$(`node`).filter(function(i,elem) {
				let padres = -1;
				try {
					padres = me.$(elem).parents('node').length+1;
				} catch(ee) {}
				return padres===level;
			});
			fmatch = 'level';
		} else if (link) {
			let tmp = link.replace(/ /g,'\\ ');
			nodes = this.$(`node[LINK*=${tmp}]`);
			fmatch = 'level';
		} else {
			nodes = this.$(`node`);
			fmatch = 'none';
		}
		// iterate nodes and build resp array
		if (nodes!=null) {
			await nodes.map(async function(i,elem) {
				let cur = me.$(elem);
				if (typeof cur.attr('ID') != 'undefined') {
					let tmp = await me.getNode({ id:cur.attr('ID'), recurse:recurse, nodes_raw:nodes_raw });
					// re-filter to see if all params defined match in this node (@TODO make more efficient doing before calling getNode; needs to be re-thinked)
					let all_met = true;
					// text
					if (all_met && text && fmatch!='text' && tmp.text.indexOf(text)==-1) all_met=false;
					// attribute
					if (all_met && attribute && fmatch!='attribute') {
						all_met = false;
						tmp.attributes.map(function(x){ 
							if(Object.keys(x)[0]==attribute) all_met=true; 
						});
					}
					// attribute_value
					if (all_met && attribute_value && fmatch!='attribute_value') {
						all_met = false;
						tmp.attribute_value.map(function(x){ 
							if(Object.keys(x)[1]==attribute_value) all_met=true; 
						});
					}
					// icon
					if (all_met && icon && fmatch!='icon') {
						all_met = false;
						tmp.icons.map(function(x) {
							if (x==icon) all_met=true;
						});
					}
					// level
					if (all_met && level && fmatch!='level') {
						if (isNaN(level)) {
							all_met = numberInCondition(tmp.level,level);
						} else {
							if (tmp.level!=level) all_met=false;
						}
					}
					//
					if (all_met==true) resp.push(tmp);
					/*if (recurse==true && all_met==true) {
						let tmp2 = await me.getNode({ id:cur.attr('ID'), recurse:recurse, nodes_raw:nodes_raw });
						resp.push(tmp2);
					} else if (all_met) {
						resp.push(tmp);
					}*/
				}
			});
		}
		//console.log('resp',resp);
		return resp;
	}

	/**
	* Get node data for the given id
	* @param 	{Int}		id				- ID of node to request
	* @param 	{Boolean}	[recurse=true] 	- include its children
	* @param 	{Boolean}	[dates=true]	- include parsing creation/modification dates
	* @param 	{Boolean}	[$=false]		- include cheerio reference
	* @param 	{Boolean}	[nodes_raw=false]	- if recurse is false and this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them.
	* @return 	{NodeDSL[]}
	*/
	async getNode({ id=this.throwIfMissing('id'), recurse=true, justlevel, dates=true, $=false, nodes_raw=false }={}) {
		if (this.$===null) throw new Error('call process() first!');
		let me = this;
		let resp = { 	level:-1,	text:'',	text_rich:'',	text_note:'',	image:'',
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
				resp.text_note = me.$(a_elem).text();
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
			} else if (nodes_raw==true) {
				resp.nodes_raw = cur.find('node');
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
	* @return 	{NodeDSL} 
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

	/**
	* Returns a modified version of the current loaded DSL, ready to be push to a version control (like github)
	* @return 	{String} 	Modified DSL source ready to be saved and pushed to a version control
	*/
	async createGitVersion() {
		// 1) get copy of current DSL content into memory (for restoring after returning)
		let copy = this.$.html(), me = this;
		// 2) get all nodes
		let nodes = this.$(`node`);
		// 
		nodes.each(function(i,elem) {
			// 3) replace all attributes CREATED with fixed value
			me.$(elem).attr("CREATED", "1552681669876");
			// 4) replace all attributes MODIFIED with fixed value
			me.$(elem).attr("MODIFIED", "1552681669876");
			// 5) erase all attributes VSHIFT and HGAP
			me.$(elem).removeAttr("VSHIFT");
			// 6) erase all attributes HGAP
			me.$(elem).removeAttr("HGAP");
		});
		// 7) transform all latin accents into original-unicodes (fixAccents(text,recover=true) (helper class))
		let resp = this.$.html();
		resp = this.help.fixAccents(resp,true);
		// recover original tags to current parser $.
		this.$ = this.$.load(copy, { ignoreWhitespace: false, xmlMode:true, decodeEntities:false });
		// return
		return resp;
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
	* @param 	{String}	[symbol=**]			- Wrapper symbol used as variable openning definition.
	* @param 	{String}	[symbol_closing=**] - Wrapper symbol used as variable closing definition.
	* @param 	{Boolean}	[array=false]		- get results as array, or as a string
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

	/**
	* Finds and transform variables wrapping/handlebars symbols given a 'from' symbol object and a 'to' symbol object within the given text
	* @param 	{String}	text 				- String from where to parse variables
	* @param 	{Object}	from				- Object to identify source variables symbols (keys: open and close)
	* @param 	{Object}	to 					- Object to identify target variables symbols (keys: open and close)
	* @return 	{String}
	*/
    replaceVarsSymbol({ text=this.throwIfMissing('text'),from={ open:'**', close:'**'},to={ open:'**', close:'**'} }={}) {
    	let source = this.findVariables({ text, symbol:from.open, symbol_closing:from.close, array:true });
    	let resp = text, tmp={};
    	for (let item of source) {
    		tmp.from = from.open+item+from.close;
    		tmp.to = to.open+item+to.close;
    		resp = resp.replace(tmp.from,tmp.to);
    	}
    	return resp;
	}

}

//private methods
//
//returns true if num meets the conditions listed on test (false otherwise)
function numberInCondition(num,test2) {	
	let resp=true, test=(isNaN(test2))?test2:test2.toString();
	if (test.indexOf('>')!=-1 || test.indexOf('<')!=-1) {
		// 'and/all' (>2,<7)
		for (let i of test.split(',')) {
			if (i.substring(0,1)=='>') {
				if (num<=parseInt(i.replace('>',''))) {
					resp=false;
					break;
				}
			} else if (i.substring(0,1)=='<') {
				if (num>=parseInt(i.replace('<',''))) {
					resp=false;
					break;
				}
			}
		}
	} else {
		// 'or/any' (2,3,5)
		resp=false;
		for (let i of test.split(',')) {
			if (num==i) {
				resp=true;
				break;
			}
		}
	}
	return resp;
}
