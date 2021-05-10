(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.dslparser = factory());
}(this, (function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  // helper class
  class helper {
    constructor(config) {
      var def_config = {
        debug: true
      };
      this.config = _objectSpread2(_objectSpread2({}, def_config), config);
    }

    fixAccents(text, recover) {
      var ctext = text;
      var from = '';
      var table = {
        'C1': 'A',
        'E1': 'á',
        'C9': 'E',
        'E9': 'é',
        'CD': 'I',
        'ED': 'í',
        'D1': 'Ñ',
        'F1': 'ñ',
        'D3': 'O',
        'F3': 'ó',
        'DA': 'U',
        'FA': 'ú',
        'DC': 'U',
        'FC': 'ü',
        'AB': '«',
        'BB': '»',
        'BF': '¿',
        'A1': '¡',
        '80': '€',
        '20A7': 'Pts'
      };

      if (recover) {
        for (from in table) {
          ctext.replace(table[from], '&#x' + from);
        }
      } else {
        for (from in table) {
          ctext.replace('&#x' + from, table[from]);
        }
      }

      return ctext;
    }

  }

  /**
  * dsl_parser: A class for parsing Concepto DSL files, and compile them with the OPEN Framework.
  * @name 	dsl_parser
  * @module 	dsl_parser
  **/

  /**
   * A node object representation of a DSL node.
   * @typedef {Object} NodeDSL
   * @property {string} id - Node unique ID.
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
   * @property {Object} attributes - Object with each attribute (key is attribute name, value is attribute value).
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
  //import console_ from '../../console/src/index'

  class dsl_parser {
    constructor() {
      var {
        file = this.throwIfMissing('file'),
        config = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var console_ = require('open_console');

      var def_config = {
        cancelled: false,
        debug: true
      };
      this.file = file;
      this.config = _objectSpread2(_objectSpread2({}, def_config), config);
      this.help = new helper();
      this.debug = new console_({
        silent: !this.config.debug
      });
      this.$ = null;
      this.x_memory_cache = {
        getNode: {}
      };
    }

    hash(thing) {
      return _asyncToGenerator(function* () {
        var cryp = require('crypto').createHash;

        var resp = cryp('sha256').update(thing).digest('hex');
        /*const {sha1} = require('crypto-hash');
        let resp = await sha1(thing,{ outputFormat:'hex' });
        */

        return resp;
      })();
    }
    /**
    * Executes initial processing for parser
    */


    process() {
      var _this = this;

      return _asyncToGenerator(function* () {
        if (_this.file != '') {
          _this.debug.setPrefix({
            prefix: 'dsl_parser',
            color: 'yellow'
          });

          _this.debug.title({
            title: 'DSL Parser for ' + _this.file,
            color: 'green'
          });

          _this.debug.time({
            id: 'process'
          }); //if (this.config.debug) console.time('process');


          var cheerio = require('cheerio'),
              path = require('path');

          var fs = require('fs').promises;

          var data = '';
          data = yield fs.readFile(_this.file, 'utf-8'); // fix accents -> unicode to latin chars

          _this.debug.outT({
            message: 'fixing accents'
          }); //if (this.config.debug) console.log('fixing accents');


          data = _this.help.fixAccents(data); // parse XML 

          _this.$ = cheerio.load(data, {
            ignoreWhitespace: false,
            xmlMode: true,
            decodeEntities: false
          }); // remove cancelled nodes if requested

          if (!_this.config.cancelled) {
            _this.debug.outT({
              message: 'removing cancelled nodes from tree'
            }); //if (this.config.debug) console.log('removing cancelled nodes from tree');


            _this.$('icon[BUILTIN*=button_cancel]').parent().remove();
          }

          _this.debug.timeEnd({
            id: 'process'
          }); //if (this.config.debug) console.timeEnd('process');

        }
      })();
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


    getNodes() {
      var _arguments = arguments,
          _this2 = this;

      return _asyncToGenerator(function* () {
        var {
          text,
          attribute,
          attribute_value,
          icon,
          level,
          link,
          recurse = true,
          nodes_raw = false,
          hash_content = false
        } = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
        var resp = [],
            nodes = null,
            me = _this2,
            fmatch = '';
        if (nodes_raw == true) recurse = false; // match first param that is defined

        if (text) {
          var tmp = text.toString().replace(/ /g, '\\ ');
          nodes = _this2.$("node[TEXT*=".concat(tmp, "]"));
          fmatch = 'text';
        } else if (attribute) {
          var _tmp = attribute.replace(/ /g, '\\ ');

          nodes = _this2.$("attribute[NAME*=".concat(_tmp, "]")).parent('node');
          fmatch = 'attribute';
        } else if (attribute_value) {
          var _tmp2 = attribute_value.replace(/ /g, '\\ ');

          nodes = _this2.$("attribute[VALUE*=".concat(_tmp2, "]")).parent('node');
          fmatch = 'attribute_value';
        } else if (icon) {
          var _tmp3 = icon.replace(/ /g, '\\ ');

          nodes = _this2.$("icon[BUILTIN*=".concat(_tmp3, "]")).parent('node');
          fmatch = 'icon';
        } else if (level && !isNaN(level)) {
          nodes = _this2.$("node").filter(function (i, elem) {
            var padres = -1;

            try {
              padres = me.$(elem).parents('node').length + 1;
            } catch (ee) {}

            return padres === level;
          });
          fmatch = 'level';
        } else if (link) {
          var _tmp4 = link.replace(/ /g, '\\ ');

          nodes = _this2.$("node[LINK*=".concat(_tmp4, "]"));
          fmatch = 'level';
        } else {
          nodes = _this2.$("node");
          fmatch = 'none';
        } // iterate nodes and build resp array


        if (nodes != null) {
          yield nodes.map( /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(function* (i, elem) {
              var cur = me.$(elem);

              if (typeof cur.attr('ID') != 'undefined') {
                var _tmp5 = yield me.getNode({
                  id: cur.attr('ID'),
                  recurse: recurse,
                  nodes_raw: nodes_raw,
                  hash_content: hash_content
                }); // re-filter to see if all params defined match in this node (@TODO make more efficient doing before calling getNode; needs to be re-thinked)


                var all_met = true; // text

                if (all_met && text && fmatch != 'text' && _tmp5.text.indexOf(text) == -1) all_met = false; // attribute

                if (all_met && attribute && fmatch != 'attribute') {
                  all_met = false;
                  /*tmp.attributes.map(function(x){ 
                  	if(Object.keys(x)[0]==attribute) all_met=true; 
                  });*/

                  Object.keys(_tmp5.attributes).map(function (x) {
                    if (x == attribute) all_met = true;
                  });
                } // attribute_value


                if (all_met && attribute_value && fmatch != 'attribute_value') {
                  all_met = false;
                  /*tmp.attribute_value.map(function(x){ 
                  	if(Object.keys(x)[1]==attribute_value) all_met=true; 
                  });*/

                  Object.keys(_tmp5.attributes).map(function (x) {
                    if (attr[x] == attribute_value) all_met = true;
                  });
                } // icon


                if (all_met && icon && fmatch != 'icon') {
                  all_met = false;

                  _tmp5.icons.map(function (x) {
                    if (x == icon) all_met = true;
                  });
                } // level


                if (all_met && level && fmatch != 'level') {
                  if (isNaN(level)) {
                    all_met = numberInCondition(_tmp5.level, level);
                  } else {
                    if (_tmp5.level != level) all_met = false;
                  }
                } //


                if (all_met == true) resp.push(_tmp5);
                /*if (recurse==true && all_met==true) {
                	let tmp2 = await me.getNode({ id:cur.attr('ID'), recurse:recurse, nodes_raw:nodes_raw });
                	resp.push(tmp2);
                } else if (all_met) {
                	resp.push(tmp);
                }*/
              }
            });

            return function (_x, _x2) {
              return _ref.apply(this, arguments);
            };
          }());
        } //console.log('resp',resp);


        return resp;
      })();
    }
    /**
    * Get node data for the given id
    * @param 	{String}	id				- ID of node to request
    * @param 	{Boolean}	[recurse=true] 	- include its children
    * @param 	{Boolean}	[dates=true]	- include parsing creation/modification dates
    * @param 	{Boolean}	[$=false]		- include cheerio reference
    * @param 	{Boolean}	[nodes_raw=false]	- if recurse is false and this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them.
    * @return 	{NodeDSL[]}
    */


    getNode() {
      var _arguments2 = arguments,
          _this3 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this3.throwIfMissing('id'),
          recurse = true,
          justlevel,
          dates = true,
          $ = false,
          nodes_raw = false,
          hash_content = false
        } = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
        if (_this3.$ === null) throw new Error('call process() first!');

        if (id in _this3.x_memory_cache.getNode && _this3.x_memory_cache.getNode[id].valid && _this3.x_memory_cache.getNode[id].valid == true && nodes_raw == false && $ == false) {
          return _this3.x_memory_cache.getNode[id];
        } else {
          var me = _this3;
          var resp = {
            level: -1,
            text: '',
            text_rich: '',
            text_note: '',
            image: '',
            cloud: {
              used: false,
              bgcolor: ''
            },
            arrows: [],
            nodes: [],
            font: {
              face: 'SansSerif',
              size: 12,
              bold: false,
              italic: false
            },
            style: '',
            color: '',
            bgcolor: '',
            link: '',
            position: '',
            attributes: {},
            icons: [],
            date_modified: new Date(),
            date_created: new Date(),
            valid: true
          };

          var he = require('he');

          var nodes = yield me.$('node[ID=' + id + ']').each( /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(function* (i, elem) {
              var cur = me.$(elem);
              resp.id = cur.attr('ID');
              resp.level = cur.parents('node').length + 1; // limit level if defined

              if (justlevel && resp.level != justlevel) {
                resp.valid = false;
                return false;
              } // add ref to $


              if ($) resp.$ = cur; // add hash of content
              //me.debug.outT({ message:'creating hash for node '+resp.id });

              if (hash_content && hash_content == true) {
                var content_ = cur.html(); //me.debug.outT({ message:'content:'+content_ });

                resp.hash_content = yield me.hash(content_); //me.debug.outT({ message:'hash created:'+resp.hash_content });
              } //


              if (typeof cur.attr('LINK') != 'undefined') resp.link = cur.attr('LINK').split('#').join('');
              if (typeof cur.attr('POSITION') != 'undefined') resp.position = cur.attr('POSITION');
              if (typeof cur.attr('COLOR') != 'undefined') resp.color = cur.attr('COLOR');
              if (typeof cur.attr('BACKGROUND_COLOR') != 'undefined') resp.bgcolor = cur.attr('BACKGROUND_COLOR');
              if (typeof cur.attr('STYLE') != 'undefined') resp.style = cur.attr('STYLE');
              if (typeof cur.attr('TEXT') != 'undefined') resp.text = cur.attr('TEXT');
              resp.text = he.decode(resp.text);
              /*resp.text = resp.text 	.replaceAll('&lt;','<')
              						.replaceAll('&gt;','>')
              						.replaceAll('&amp;','&')
              						.replaceAll('&apos;',`'`)
              						.replaceAll('&quot;',`"`);*/
              // dates parsing

              if (dates) {
                if (typeof cur.attr('CREATED') != 'undefined') {
                  resp.date_created = new Date(parseFloat(cur.attr('CREATED')));
                }

                if (typeof cur.attr('MODIFIED') != 'undefined') {
                  resp.date_modified = new Date(parseFloat(cur.attr('MODIFIED')));
                }
              } // attributes


              cur.find('node[ID=' + resp.id + '] > attribute').map(function (a, a_elem) {
                var _fila = me.$(a_elem); //tmp_fila[_fila.attr('NAME')] = _fila.attr('VALUE');
                //resp.attributes.push(tmp_fila);


                resp.attributes[_fila.attr('NAME')] = he.decode(_fila.attr('VALUE'));
              }); // icons

              cur.find('node[ID=' + resp.id + '] > icon').map(function (a, a_elem) {
                resp.icons.push(me.$(a_elem).attr('BUILTIN'));
              }); // fonts definition

              cur.find('node[ID=' + resp.id + '] > font').map(function (a, a_elem) {
                var _fila = me.$(a_elem);

                resp.font.face = _fila.attr('NAME');
                resp.font.size = _fila.attr('SIZE');

                if (typeof _fila.attr('BOLD') != 'undefined') {
                  resp.font.bold = _fila.attr('BOLD') == 'true' ? true : false;
                }

                if (typeof _fila.attr('ITALIC') != 'undefined') {
                  resp.font.italic = _fila.attr('ITALIC') == 'true' ? true : false;
                }
              }); // cloud definition

              cur.find('node[ID=' + resp.id + '] > cloud').map(function (a, a_elem) {
                var _fila = me.$(a_elem);

                resp.cloud.used = true;

                if (typeof _fila.attr('COLOR') != 'undefined') {
                  resp.cloud.bgcolor = _fila.attr('COLOR');
                }
              }); // get image if any on node

              cur.find('node[ID=' + resp.id + '] > richcontent[TYPE=NODE] body').map(function (a, a_elem) {
                resp.text_rich = me.$(a_elem).html();
                me.$(a_elem).find('img[src]').map(function (i, i_elem) {
                  resp.image = me.$(i_elem).attr('src');
                });
              }); // get notes on node if any

              cur.find('node[ID=' + resp.id + '] > richcontent[TYPE=NOTE] body').map(function (a, a_elem) {
                resp.text_note = me.$(a_elem).text();
              }); // get defined arrows on node if any

              cur.find('node[ID=' + resp.id + '] > arrowlink').map(function (a, a_elem) {
                var _fila = me.$(a_elem),
                    _tmp_f = {
                  target: '',
                  color: '',
                  style: ''
                },
                    _tmpa = {};

                _tmp_f.target = _fila.attr('DESTINATION');

                if (typeof _fila.attr('COLOR') != 'undefined') {
                  _tmp_f.color = _fila.attr('COLOR');
                }

                _tmpa.type = _fila.attr('STARTARROW') + '-' + _fila.attr('ENDARROW');

                if (_tmpa.type.indexOf('None-Default') != -1) {
                  _tmp_f.style = 'source-to-target';
                } else if (_tmpa.type.indexOf('Default-None') != -1) {
                  _tmp_f.style = 'target-to-source';
                } else {
                  _tmp_f.style = 'both-ways';
                }

                resp.arrows.push(_tmp_f);
              }); // get children nodes .. (using myself for each child)

              if (recurse == true) {
                yield cur.find('node').map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator(function* (a, a_elem) {
                    var _nodo = me.$(a_elem);

                    var hijo = yield me.getNode({
                      id: _nodo.attr('ID'),
                      recurse: recurse,
                      justlevel: resp.level + 1,
                      hash_content: hash_content
                    });

                    if (hijo.valid) {
                      //delete hijo.valid;
                      resp.nodes.push(hijo);
                    }
                  });

                  return function (_x5, _x6) {
                    return _ref3.apply(this, arguments);
                  };
                }().bind(this));
              } else if (nodes_raw == true) {
                resp.nodes_raw = cur.find('node');
                /* */

                resp.getNodes = /*#__PURE__*/_asyncToGenerator(function* () {
                  // this.me and this.cur
                  var resp = [];
                  yield this.cur.find('node').map( /*#__PURE__*/function () {
                    var _ref5 = _asyncToGenerator(function* (a, a_elem) {
                      var _nodo = this.me.$(a_elem);

                      var hijo = yield this.me.getNode({
                        id: _nodo.attr('ID'),
                        justlevel: this.level + 1,
                        recurse: false,
                        nodes_raw: true,
                        hash_content: hash_content
                      });

                      if (hijo.valid) {
                        //10may21 @check this, maybe needs && hijo.valid==true
                        //delete hijo.valid;
                        resp.push(hijo);
                      }
                    });

                    return function (_x7, _x8) {
                      return _ref5.apply(this, arguments);
                    };
                  }().bind(this));
                  return resp;
                }).bind({
                  me,
                  cur,
                  level: resp.level
                });
              } // break loop


              return false;
            });

            return function (_x3, _x4) {
              return _ref2.apply(this, arguments);
            };
          }());

          if (resp.valid && resp.valid == true && nodes_raw == false && $ == false) {
            // remove 'valid' key if justLevel is not defined
            //if (!justlevel) delete resp.valid; //this doesnt seem right (27-4-21)
            _this3.x_memory_cache.getNode[id] = resp;
          } // reply


          return resp;
        }
      })();
    }
    /**
    * Returns the parent node of the given node id
    * @param 	{String}	id				- ID of node to request
    * @param 	{Boolean}	[recurse=false] - include its children
    * @return 	{NodeDSL} 
    */


    getParentNode() {
      var _arguments3 = arguments,
          _this4 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this4.throwIfMissing('id'),
          recurse = false
        } = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : {};
        if (_this4.$ === null) throw new Error('call process() first!');

        var padre = _this4.$("node[ID=".concat(id, "]")).parent('node');

        var resp = {},
            me = _this4;

        if (typeof padre.attr('ID') != 'undefined') {
          resp = yield me.getNode({
            id: padre.attr('ID'),
            recurse: recurse
          });
        }

        return resp;
      })();
    }
    /**
    * Returns the parent nodes ids of the given node id
    * @param 	{String}		id 				- node id to query
    * @param 	{Boolean}		[array=false]	- get results as array, or as a string
    * @return 	{String|Array}
    */


    getParentNodesIDs() {
      var _arguments4 = arguments,
          _this5 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this5.throwIfMissing('id'),
          array = false
        } = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : {};

        var padres = _this5.$("node[ID=".concat(id, "]")).parents('node');

        var resp = [],
            me = _this5;
        padres.map(function (i, elem) {
          var item = me.$(elem);

          if (typeof item.attr('ID') != 'undefined') {
            resp.push(item.attr('ID'));
          }
        }); // delete the last item (central node) and return

        resp.pop();

        if (array) {
          return resp;
        } else {
          return resp.join(',');
        }
      })();
    }
    /**
    * Returns the children nodes ids of the given node id
    * @param 	{String}	id 				- node id to query
    * @param 	{Boolean}	[array=false]	- get results as array, or as a string
    * @return 	{String|Array}
    */


    getChildrenNodesIDs() {
      var _arguments5 = arguments,
          _this6 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this6.throwIfMissing('id'),
          array = false
        } = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : {};

        var hijos = _this6.$("node[ID=".concat(id, "]")).find('node');

        var resp = [],
            me = _this6;
        hijos.map(function (i, elem) {
          var item = me.$(elem);

          if (typeof item.attr('ID') != 'undefined') {
            resp.push(item.attr('ID'));
          }
        });

        if (array) {
          return resp;
        } else {
          return resp.join(',');
        }
      })();
    }
    /**
    * Returns the brother nodes ids of the given node id
    * @param 	{String}	id 				- node id to query
    * @param 	{Boolean}	[before=true] 	- consider brothers before the queried node
    * @param 	{Boolean}	[after=true] 	- consider brothers after the queried node
    * @param 	{Boolean}	[array=false]	- get results as array of objects, or as a string
    * @return 	{String}
    */


    getBrotherNodesIDs() {
      var _arguments6 = arguments,
          _this7 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this7.throwIfMissing('id'),
          before = true,
          after = true,
          array = false
        } = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : {};
        var me_data = yield _this7.getNode({
          id: id,
          recurse: false,
          $: true
        });
        var resp = [];

        if (before) {
          var prev = me_data.$.prev('node');

          while (typeof prev.get(0) != 'undefined') {
            if (array == false) {
              resp.push(prev.get(0).attribs.ID);
            } else {
              resp.push(prev.get(0).attribs);
            }

            prev = prev.prev('node');
          }
        }

        if (after) {
          var next = me_data.$.next('node');

          while (typeof next.get(0) != 'undefined') {
            if (array == false) {
              resp.push(next.get(0).attribs.ID);
            } else {
              resp.push(next.get(0).attribs);
            }

            next = next.next('node');
          }
        } // return


        if (array) {
          return resp;
        } else {
          return resp.join(',');
        }
      })();
    }
    /**
    * Returns a modified version of the current loaded DSL, ready to be push to a version control (like github)
    * @return 	{String} 	Modified DSL source ready to be saved and pushed to a version control
    */


    createGitVersion() {
      var _this8 = this;

      return _asyncToGenerator(function* () {
        // 1) get copy of current DSL content into memory (for restoring after returning)
        var copy = _this8.$.html(),
            me = _this8; // 2) get all nodes


        var nodes = _this8.$("node"); // 


        nodes.each(function (i, elem) {
          // 3) replace all attributes CREATED with fixed value
          me.$(elem).attr("CREATED", "1552681669876"); // 4) replace all attributes MODIFIED with fixed value

          me.$(elem).attr("MODIFIED", "1552681669876"); // 5) erase all attributes VSHIFT and HGAP

          me.$(elem).removeAttr("VSHIFT"); // 6) erase all attributes HGAP

          me.$(elem).removeAttr("HGAP");
        }); // 7) transform all latin accents into original-unicodes (fixAccents(text,recover=true) (helper class))

        var resp = _this8.$.html();

        resp = _this8.help.fixAccents(resp, true); // recover original tags to current parser $.

        _this8.$ = _this8.$.load(copy, {
          ignoreWhitespace: false,
          xmlMode: true,
          decodeEntities: false
        }); // return

        return resp;
      })();
    } // ********************
    // private methods
    // ********************


    throwIfMissing(name) {
      throw new Error('Missing ' + name + ' parameter!');
    }
    /**
    * Finds variables within given text
    * @param 	{String}	text 				- String from where to parse variables
    * @param 	{String}	[symbol=**]			- Wrapper symbol used as variable openning definition.
    * @param 	{String}	[symbol_closing=**] - Wrapper symbol used as variable closing definition.
    * @param 	{Boolean}	[array=false]		- get results as array, or as a string
    * @return 	{String}
    */


    findVariables() {
      var {
        text = this.throwIfMissing('text'),
        symbol = '**',
        symbol_closing = '**',
        array = false
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var escapseRegExp = function escapseRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      var extractorPattern = new RegExp(escapseRegExp(symbol) + '(.*?)' + escapseRegExp(symbol_closing), 'g');
      var resp = [];
      var nadamas = false;

      while (!nadamas) {
        var test = new RegExp(extractorPattern, 'gim');
        var utiles = text.match(test);

        for (var i in utiles) {
          resp.push(utiles[i].split(symbol).join('').split(symbol_closing).join(''));
        }

        nadamas = true;
      }

      return array ? resp : resp.join(',');
    }
    /**
    * Finds and transform variables wrapping/handlebars symbols given a 'from' symbol object and a 'to' symbol object within the given text
    * @param 	{String}	text 				- String from where to parse variables
    * @param 	{Object}	from				- Object to identify source variables symbols (keys: open and close)
    * @param 	{Object}	to 					- Object to identify target variables symbols (keys: open and close)
    * @return 	{String}
    */


    replaceVarsSymbol() {
      var {
        text = this.throwIfMissing('text'),
        from = {
          open: '**',
          close: '**'
        },
        to = {
          open: '**',
          close: '**'
        }
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var source = this.findVariables({
        text,
        symbol: from.open,
        symbol_closing: from.close,
        array: true
      });
      var resp = text,
          tmp = {};

      for (var item of source) {
        tmp.from = from.open + item + from.close;
        tmp.to = to.open + item + to.close;
        resp = resp.replace(tmp.from, tmp.to);
      }

      return resp;
    }

  } //private methods
  //returns true if num meets the conditions listed on test (false otherwise)

  function numberInCondition(num, command_test) {
    // num is always 'number' type
    var resp = true;

    if (command_test.toString() === num.toString()) ; else if (typeof command_test === 'number') {
      // cases test: 2,5,9,1 (exact matches)
      if (num == command_test) {
        resp = true;
      } else if (num != command_test) {
        resp = false;
      }
    } else if (typeof command_test === 'string') {
      if (command_test.indexOf(',') == -1 && command_test.charAt(0) == '<') {
        // one condition: <2 or <7
        if (num >= parseInt(command_test.replace('<', ''))) {
          resp = false;
        }
      } else if (command_test.indexOf(',') == -1 && command_test.charAt(0) == '>') {
        // one condition: >2 or >7
        if (num <= parseInt(command_test.replace('>', ''))) {
          resp = false;
        }
      } else if (command_test.indexOf(',') == -1 && command_test != num.toString()) {
        resp = false;
      } else {
        // cases test:['2','>2','2,3,5']
        var test2 = command_test.split(',');

        if (command_test.indexOf('<') == -1 && command_test.indexOf('>') == -1 && test2.includes(num)) {
          // exact match;
          resp = true;
        } else if (command_test.indexOf('<') != -1 || command_test.indexOf('>') != -1) {
          // test may be >2,<5,>7
          // 'and/all' (>2,<7)
          for (var i of test2) {
            if (i.charAt(0) == '>') {
              if (num <= parseInt(i.replace('>', ''))) {
                resp = false;
                break;
              }
            } else if (i.charAt(0) == '<') {
              if (num >= parseInt(i.replace('<', ''))) {
                resp = false;
                break;
              }
            }
          }
        }
      }
    } else {
      resp = false;
    }

    return resp;
  }

  String.prototype.replaceAll = function (strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
  };

  return dsl_parser;

})));
