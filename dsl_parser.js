var fs 		= require('fs'),
	cheerio	= require('cheerio'),
	colors	= require('colors'),
	args 	= require('minimist')(process.argv.slice(2)),
	_file 	= '', _tree,
	_config	= {	cancelled:true },
	flow	= require('asyncflow');
var readfile = flow.wrap(fs.readFile);

module.exports = {
	_tmp : {
	},
	_repeat : function(thestring, count) {
	    if (count < 1) return '';
	 	var result = '', pattern = thestring.valueOf();
	    while (count > 1) {
	      if (count & 1) result += pattern;
	      count >>>= 1, pattern += pattern;
	    }
	    return result + pattern;
	},
	_title : function(title) {
		var _title = '***\ '+title+'\ ***';
		var _linea = this._repeat('*',_title.length);
		console.log(_linea.green);
		console.log(_title.green);
		console.log(_linea.green);
	},
	init : function(thefile, config, callback) {
		var _myself = this;
		console.time('init');
		_config = config;
		if (thefile!='') _file=thefile;
		if (_file!='') {
			this._title('DSL Parser for: '+_file);
			flow(function(){
				var data = readfile(_file,'utf-8').wait();	
				$ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities:false });
				// remove cancelled nodes if requested -c
				console.log('argumentos:',args);
				if (!_config.cancelled) {
					console.log('removing cancelled nodes from tree');
					$('icon[BUILTIN*=button_cancel]').parent().remove();
				}
				_myself._tmp._tree = $;
				console.timeEnd('init');
				callback($,_myself);
			});
			/*
			fs.readFile(_file, 'utf-8', function(err,data) {
				if (err) {
					return console.log(err);
				}
				$ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities:false });
				// remove cancelled nodes if requested -c
				console.log('argumentos:',args);
				if (!_config.cancelled) {
					console.log('removing cancelled nodes from tree');
					$('icon[BUILTIN*=button_cancel]').parent().remove();
				}
				_myself._tmp._tree = $;
				console.timeEnd('init');
				callback($,_myself);
			});*/
		} else {
			console.timeEnd('init');
		}
	},
	getTree : function() {
		return this._tmp._tree;
	},
	getNode : function(id, recurse, callback) {
		var _debug = (arguments.length==3)?true:false;
		if (_debug) console.time('getNode');
		var my_self = this;
		if (!('_tree' in this._tmp)) return console.error('call init first!');
		var $ = this._tmp._tree;
		var resp	=	{ 	level:-1,		text:'',			text_rich:'',	text_node:'',	image:'',
							cloud:{ used:false, bgcolor:'' },	arrows:[], 		nodes:[],
							font:{ face:'SansSerif', size:12, bold:false, italic:false },
							style:'',		color:'',	bgcolor:'',		link:'',	position:'',
							attributes:[],	icons:[],	date_modified:new Date(),	date_created:new Date()
						};
		var nodes	=	$('node[ID='+id+']').each(function(i,elem) {
			var cur =	$(elem), pa_ac = -1;
			resp.id =	cur.attr('ID');
			resp.level = cur.parents('node').length;
			if (typeof cur.attr('LINK') != 'undefined') resp.link = cur.attr('LINK').split('#').join('');
			if (typeof cur.attr('POSITION') != 'undefined') resp.position = cur.attr('POSITION');
			if (typeof cur.attr('COLOR') != 'undefined') resp.color = cur.attr('COLOR');
			if (typeof cur.attr('BACKGROUND_COLOR') != 'undefined') resp.bgcolor = cur.attr('BACKGROUND_COLOR');
			if (typeof cur.attr('STYLE') != 'undefined') resp.style = cur.attr('STYLE');
			if (typeof cur.attr('TEXT') != 'undefined') resp.text = cur.attr('TEXT');
			// dates
			if (typeof cur.attr('CREATED') != 'undefined') {
				resp.date_created = new Date(parseFloat(cur.attr('CREATED')));		
			}
			if (typeof cur.attr('MODIFIED') != 'undefined') {
				resp.date_modified = new Date(parseFloat(cur.attr('MODIFIED')));	
			}
			// attributes
			if (_debug) console.time('search_attributes');
			cur.find('node[ID='+resp.id+'] > attribute').each(function(a,a_elem) {
				var tmp_fila = {}, _fila = $(a_elem);
				tmp_fila[_fila.attr('NAME')] = _fila.attr('VALUE');
				resp.attributes.push(tmp_fila);
			});
			if (_debug) console.timeEnd('search_attributes');
			//
			// icons
			if (_debug) console.time('search_icons');
			cur.find('node[ID='+resp.id+'] > icon').each(function(a,a_elem) {
				resp.icons.push($(a_elem).attr('BUILTIN'));
			});
			if (_debug) console.timeEnd('search_icons');
			// fonts definition
			if (_debug) console.time('fonts');
			cur.find('node[ID='+resp.id+'] > font').each(function(a,a_elem) {
				var _fila = $(a_elem);
				resp.font.face = _fila.attr('NAME');
				resp.font.size = _fila.attr('SIZE');
				if (typeof _fila.attr('BOLD') != 'undefined') {
					resp.font.bold = _fila.attr('BOLD');
				}
				if (typeof _fila.attr('ITALIC') != 'undefined') {
					resp.font.italic = _fila.attr('ITALIC');
				}
			});
			//
			if (_debug) console.timeEnd('fonts');
			// cloud definition
			if (_debug) console.time('cloud');
			cur.find('node[ID='+resp.id+'] > cloud').each(function(a,a_elem) {
				var _fila = $(a_elem);
				resp.cloud.used = true;
				if (typeof _fila.attr('COLOR') != 'undefined') {
					resp.cloud.bgcolor = _fila.attr('COLOR');
				}
			});
			//
			if (_debug) console.timeEnd('cloud');
			// get image if any on node
			if (_debug) console.time('imageContent');
			cur.find('node[ID='+resp.id+'] > richcontent[TYPE=NODE] body').each(function(a,a_elem) {
				resp.text_rich = $(a_elem).html();
				$(a_elem).find('img[src]').each(function(i,i_elem) {
					resp.image = $(i_elem).attr('src');
				});
			});
			if (_debug) console.timeEnd('imageContent');
			// get notes on node if any
			if (_debug) console.time('noteContent');
			cur.find('node[ID='+resp.id+'] > richcontent[TYPE=NOTE] body').each(function(a,a_elem) {
				resp.text_node = $(a_elem).text();
			});
			if (_debug) console.timeEnd('noteContent');
			// get defined arrows on node if any
			if (_debug) console.time('arrows');
			cur.find('node[ID='+resp.id+'] > arrowlink').each(function(a,a_elem) {
				var _fila = $(a_elem), _tmp_f={ target:'', color:'', style:'' }, _tmpa={};
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
			if (_debug) console.timeEnd('arrows');
			// TODO: get children nodes .. (using myself for each child)
			if (recurse==true) {
				cur.find('node').each(function(a,a_elem) {
					var _nodo = $(a_elem);
					my_self.getNode(_nodo.attr('ID'),recurse, function(ee){
						resp.nodes.push(ee);
					}, false);
				});
			}
			//
			if (_debug) console.timeEnd('getNode');
			callback(resp);
		});
	},
	getNodes : function(filter, callback) {
		var _tmp = {};
		if (!('_tree' in this._tmp)) return console.error('call init first!');
		var $ = this._tmp._tree;
		if (filter.text 			&& filter.attribute && 
			filter.attribute_value	&& filter.icon && 
			filter.level 			&& filter.link ) {
			$('node[TEXT*='+filter.text.split(' ').join('\ ')+']').each(function(a, ae) {
				var _lev1 = $(ae);
				_lev1.find('attribute[NAME*='+filter.attribute.split(' ').join('\ ')+']').parent('node').each(b, be) {
					console.log('found text:'+filter.text);
				});
			});
		}
	}
};

/*
module.exports.init('', function($) {
	console.log('mapa leido'.yellow);
	module.exports.getNode('ID_1416098051',false,function(r) {
		console.log(r);
	});
	//console.dir(arbol.html());
});*/
//console.log('argumentos:',module.exports.init());
//dsl parser