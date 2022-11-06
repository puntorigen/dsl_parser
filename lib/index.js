(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.dslparser = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

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
        file,
        source,
        config = {}
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!file && !source) this.throwIfMissing('file/source');

      var console_ = require('@concepto/console');

      var def_config = {
        cancelled: true,
        debug: true
      };
      if (file) this.file = file;
      if (source) this.source = source;
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
        var resp = thing.toString();

        if (thing) {
          try {
            var cryptoAsync = require('@ronomon/crypto-async');

            var hmac = {};

            if (typeof thing === 'object') {
              hmac = yield cryptoAsync.hmac('sha256', Buffer.alloc(1024), Buffer.from(JSON.stringify(thing)));
            } else {
              hmac = yield cryptoAsync.hmac('sha256', Buffer.alloc(1024), Buffer.from(thing));
            }

            resp = hmac.toString('hex');
          } catch (err) {
            var {
              sha1
            } = require('crypto-hash');

            if (typeof thing === 'object') {
              resp = yield sha1(JSON.stringify(thing), {
                outputFormat: 'hex'
              });
            } else {
              resp = yield sha1(thing, {
                outputFormat: 'hex'
              });
            }
          }
        }
        /*
        let cryp = require('crypto').createHash;
        let resp = cryp('sha256').update(thing).digest('hex');*/

        /*
              const {sha1} = require('crypto-hash');
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
        if (_this.file && _this.file != '' || _this.source && _this.source != '') {
          _this.debug.setPrefix({
            prefix: 'dsl_parser',
            color: 'yellow'
          });

          if (_this.file) _this.debug.title({
            title: 'DSL Parser for ' + _this.file,
            color: 'green'
          });

          _this.debug.time({
            id: 'process'
          }); //if (this.config.debug) console.time('process');


          var cheerio = require('cheerio');
              require('path');

          var fs = require('fs').promises;

          var data = '';
          if (_this.file) data = yield fs.readFile(_this.file, 'utf-8');
          if (_this.source && _this.source != '') data = _this.source; // fix accents -> unicode to latin chars

          _this.debug.outT({
            message: 'fixing accents'
          }); //if (this.config.debug) console.log('fixing accents');


          data = _this.help.fixAccents(data); // parse XML 

          _this.$ = cheerio.load(data, {
            ignoreWhitespace: false,
            xmlMode: true,
            decodeEntities: false
          }); // remove cancelled nodes if requested

          if (_this.config.cancelled && _this.config.cancelled == false) {
            _this.debug.outT({
              message: 'removing cancelled nodes from tree'
            }); //if (this.config.debug) console.log('removing cancelled nodes from tree');


            try {
              //this assumes there is at least one cancelled node; so using try/catch for not testing
              _this.$('icon[BUILTIN*=button_cancel]').parent().remove();
            } catch (eeec) {}
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
     * Adds a node as an xml child of the given parent node ID
     * @param 	{String}	parent_id 		- ID of parent node
     * @param	{NodeDSL}	node			- NodeDSL object to add
     */


    addNode() {
      var _arguments2 = arguments,
          _this3 = this;

      return _asyncToGenerator(function* () {
        var {
          parent_id = _this3.throwIfMissing('parent_id - addNode'),
          node = _this3.throwIfMissing('node - addNode')
        } = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
        //to do idea: secret icon nodes -> encrypted json with 'secrets' config node within _git.dsl version (cli arg --secret 'pass' y --un_git (crea ver no git con secrets desencriptado))
        //grab parentID
        var me = _this3;
        yield _this3.$('node[ID=' + parent_id + ']').each( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(function* (i, elem) {
            var cur = me.$(elem);
            var txml = yield me.nodeToXML({
              node
            });
            cur.append(txml);
          });

          return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
          };
        }());
        return me.$.html();
      })();
    }
    /**
     * Edits the given node ID data keys
     * @param 	{String}	node_id 		- ID of node to edit
     * @param	{NodeDSL}	data			- NodeDSL object properties to modify or method(existing_properties_of_node) that returns object data to modify
     */


    editNode() {
      var _arguments3 = arguments,
          _this4 = this;

      return _asyncToGenerator(function* () {
        var {
          node_id = _this4.throwIfMissing('node_id - editNode'),
          data = _this4.throwIfMissing('data - editNode'),
          children = true
        } = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : {};
        //grab nodetID
        var me = _this4;

        _this4.debug.outT({
          message: "editNode: getting nodeID:".concat(node_id)
        });

        var key_node = yield _this4.getNode({
          id: node_id,
          recurse: children
        }); //overwrite node data with given data, and get the new xml

        var ndata = key_node,
            new_xml = '';

        if (typeof data === 'function') {
          var tmp = yield data(key_node);
          ndata = _objectSpread2(_objectSpread2({}, ndata), tmp);
        } else {
          ndata = _objectSpread2(_objectSpread2({}, ndata), data);
        }

        _this4.debug.outT({
          message: "editNode: converting data to xml"
        });

        new_xml = yield _this4.nodeToXML({
          node: ndata
        });

        _this4.debug.outT({
          message: "editNode: replacing xml"
        });

        var target = yield _this4.$('node[ID=' + node_id + ']').toArray();

        if (target.length > 0) {
          var target_node = _this4.$(target[0]);

          target_node.replaceWith(new_xml);
        }

        _this4.debug.outT({
          message: "editNode: ready!"
        });

        return me.$.html();
      })();
    }
    /**
     * Converts a NodeDSL into an XML of ConceptoDSL node child
     * @param	{NodeDSL}	node			- NodeDSL origin object
     */


    nodeToXML() {
      var _arguments4 = arguments,
          _this5 = this;

      return _asyncToGenerator(function* () {
        var {
          node = _this5.throwIfMissing('node - nodeToXML')
        } = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : {};

        require('he');

        var toxml = function toxml(o) {
          var {
            create
          } = require('xmlbuilder2');

          return create(o).end({
            prettyPrint: true
          });
        };

        var nodeToObj = function nodeToObj(node) {
          var getRandomInt = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          };

          var base = {
            id: 'ID_' + getRandomInt(10000000, 90000000),
            level: -1,
            text: '',
            text_rich: '',
            text_note: '',
            text_note_html: '',
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

          var node_obj = _objectSpread2(_objectSpread2({}, base), node); //prepare node_obj


          var obj = {
            node: {
              '@ID': node_obj.id
            }
          };

          if (node_obj.date_created) {
            if (typeof node_obj.date_created == 'string') {
              var tmpdate = new Date(node_obj.date_created);
              obj.node['@CREATED'] = tmpdate.getTime();
            } else {
              obj.node['@CREATED'] = node_obj.date_created.getTime();
            }
          }

          if (node_obj.date_modified) {
            if (typeof node_obj.date_modified == 'string') {
              var _tmpdate = new Date(node_obj.date_modified);

              obj.node['@MODIFIED'] = _tmpdate.getTime();
            } else {
              obj.node['@MODIFIED'] = node_obj.date_modified.getTime();
            }
          }

          if (node_obj.link != '') obj.node['@LINK'] = '#' + node_obj.link;
          if (node_obj.position != '') obj.node['@POSITION'] = node_obj.position;
          if (node_obj.color != '') obj.node['@COLOR'] = node_obj.color;
          if (node_obj.bgcolor != '') obj.node['@BACKGROUND_COLOR'] = node_obj.bgcolor;
          if (node_obj.style != '') obj.node['@STYLE'] = node_obj.style;
          if (node_obj.text != '') obj.node['@TEXT'] = node_obj.text; //<attribute_layout NAME_WIDTH="230" VALUE_WIDTH="301"/>
          //determine attributes auto-width

          var attr_max_namelen = 0,
              attr_max_valuelen = 0;

          for (var att in node_obj.attributes) {
            if (att.length > attr_max_namelen) attr_max_namelen = att.length;
            if (node_obj.attributes[att].length > attr_max_valuelen) attr_max_valuelen = node_obj.attributes[att].length;
          }

          if (attr_max_namelen > 0 && attr_max_valuelen > 0) {
            if (!obj.node['#']) obj.node['#'] = [];
            obj.node['#'].push({
              attribute_layout: {
                '@NAME_WIDTH': Math.round(attr_max_namelen * 6.67),
                '@VALUE_WIDTH': Math.round(attr_max_valuelen * 6.67)
              }
            });
          } //attributes


          for (var _att in node_obj.attributes) {
            if (!obj.node['#']) obj.node['#'] = [];
            obj.node['#'].push({
              attribute: {
                '@NAME': _att,
                '@VALUE': node_obj.attributes[_att]
              }
            });
            if (_att.length > attr_max_namelen) attr_max_namelen = _att.length;
            if (node_obj.attributes[_att].length > attr_max_valuelen) attr_max_valuelen = node_obj.attributes[_att].length;
          } //icons


          for (var icon of node_obj.icons) {
            if (!obj.node['#']) obj.node['#'] = [];
            obj.node['#'].push({
              icon: {
                '@BUILTIN': icon
              }
            });
          } //fonts


          if (JSON.stringify(node_obj.font) != JSON.stringify(base.font)) {
            if (!obj.node['#']) obj.node['#'] = [];
            var font_obj = {
              font: {
                '@NAME': node_obj.font.face,
                '@SIZE': node_obj.font.size
              }
            };
            if (node_obj.font.bold && node_obj.font.bold == true) font_obj.font['@BOLD'] = true;
            if (node_obj.font.italic && node_obj.font.italic == true) font_obj.font['@ITALIC'] = true;
            obj.node['#'].push(font_obj);
          } // cloud definition


          if (node_obj.cloud.used == true) {
            if (!obj.node['#']) obj.node['#'] = [];
            obj.node['#'].push({
              cloud: {
                '@COLOR': node_obj.cloud.bgcolor
              }
            });
          } // image


          if (node_obj.image != '') {
            if (!obj.node['#']) obj.node['#'] = [];
            obj.node['#'].push({
              richcontent: {
                '@TYPE': 'NODE',
                '#': {
                  html: {
                    head: {},
                    body: {
                      p: {
                        img: {
                          '@src': node_obj.image,
                          '@width': 100,
                          '@height': 100
                        }
                      }
                    }
                  }
                }
              }
            });
          } // notes on node


          if (node_obj.text_note != '' || node_obj.text_note_html != '') {
            if (!obj.node['#']) obj.node['#'] = [];
            if (node_obj.text_note) ;
            if (node_obj.text_note_html) ;
            var t = {
              richcontent: {
                '@TYPE': 'NOTE',
                '#': {
                  html: {
                    head: {},
                    body: {}
                  }
                }
              }
            };

            if (node_obj.text_note_html) {
              t.richcontent['#'].html.body = node_obj.text_note_html;
            } else {
              t.richcontent['#'].html.body = {
                p: node_obj.text_note
              };
            }

            obj.node['#'].push(t);
          } // set node arrows


          if (node_obj.arrows.length > 0) {
            if (!obj.node['#']) obj.node['#'] = [];

            for (var arr of node_obj.arrows) {
              var arrow = {
                arrowlink: {
                  '@ID': 'Arrow_' + node_obj.id,
                  '@DESTINATION': arr.target,
                  '@STARTINCLINATION': '0;0;',
                  '@ENDINCLINATION': '0;0;'
                }
              };
              if (arr.color != '') arrow.arrowlink['@COLOR'] = arr.color;

              if (arr.type == 'source-to-target') {
                arrow.arrowlink['@STARTARROW'] = 'None';
                arrow.arrowlink['@ENDARROW'] = 'Default';
              } else if (arr.type == 'target-to-source') {
                arrow.arrowlink['@STARTARROW'] = 'Default';
                arrow.arrowlink['@ENDARROW'] = 'None';
              } else {
                arrow.arrowlink['@STARTARROW'] = 'Default';
                arrow.arrowlink['@ENDARROW'] = 'Default';
              }

              obj.node['#'].push(arrow);
            }
          } //process children nodes


          if (node_obj.nodes.length > 0) {
            for (var xc of node_obj.nodes) {
              if (!obj.node['#']) obj.node['#'] = [];
              obj.node['#'].push(nodeToObj(xc));
            }
          } //


          return obj;
        }; //


        return toxml(nodeToObj(node)).replace("<?xml version=\"1.0\"?>", "");
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
      var _arguments5 = arguments,
          _this6 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this6.throwIfMissing('id - getNode'),
          recurse = true,
          justlevel,
          dates = true,
          $ = false,
          nodes_raw = false,
          hash_content = false
        } = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : {};
        if (_this6.$ === null) throw new Error('call process() first!');

        if (id in _this6.x_memory_cache.getNode && _this6.x_memory_cache.getNode[id].valid && _this6.x_memory_cache.getNode[id].valid == true && nodes_raw == false && $ == false) {
          return _this6.x_memory_cache.getNode[id];
        } else {
          var me = _this6;
          var resp = {
            level: -1,
            text: '',
            text_rich: '',
            text_note: '',
            text_note_html: '',
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

          yield me.$('node[ID=' + id + ']').each( /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(function* (i, elem) {
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
                resp.text_note_html = me.$(a_elem).html();
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
                //console.log('getNode recurse:true, getting subnodes of nodeID:'+id);
                yield cur.find('node').map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator(function* (a, a_elem) {
                    var _nodo = me.$(a_elem);

                    var _id = _nodo.attr('ID');

                    if (!_id) {
                      // 7-jun-21 hack: if the node doesn't have an ID attr, invent one.
                      var getRandomInt = function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min)) + min;
                      };

                      _id = 'ID_' + getRandomInt(10000000, 90000000);

                      _nodo.attr('ID', _id);
                    }

                    try {
                      var hijo = yield me.getNode({
                        id: _id,
                        recurse: recurse,
                        justlevel: resp.level + 1,
                        hash_content: hash_content
                      });

                      if (hijo.valid) {
                        //delete hijo.valid;
                        resp.nodes.push(hijo);
                      }
                    } catch (err00) {
                      console.log('ERROR getting child node info: ' + _nodo.toString(), err00);
                    }
                  });

                  return function (_x7, _x8) {
                    return _ref4.apply(this, arguments);
                  };
                }().bind(this));
              } else if (nodes_raw == true) {
                resp.nodes_raw = cur.find('node');
                /* */

                resp.getNodes = /*#__PURE__*/_asyncToGenerator(function* () {
                  // this.me and this.cur
                  var resp = []; //console.log('getNodes() called for node ID:'+this.dad.id);

                  yield this.cur.find('node').map( /*#__PURE__*/function () {
                    var _ref6 = _asyncToGenerator(function* (a, a_elem) {
                      var _nodo = this.me.$(a_elem);

                      var _id = _nodo.attr('ID');

                      if (!_id) {
                        // 28-may-21 hack: if the node doesn't have an ID attr, invent one.
                        var getRandomInt = function getRandomInt(min, max) {
                          return Math.floor(Math.random() * (max - min)) + min;
                        };

                        _id = 'ID_' + getRandomInt(10000000, 90000000);

                        _nodo.attr('ID', _id);
                      }

                      try {
                        var hijo = yield this.me.getNode({
                          id: _id,
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
                      } catch (errson) {
                        console.log('ERROR getting child node info: ' + _nodo.toString(), errson);
                      }
                    });

                    return function (_x9, _x10) {
                      return _ref6.apply(this, arguments);
                    };
                  }().bind(this));
                  return resp;
                }).bind({
                  me,
                  cur,
                  level: resp.level,
                  dad: resp
                });
              } // break loop


              return false;
            });

            return function (_x5, _x6) {
              return _ref3.apply(this, arguments);
            };
          }());

          if (resp.valid && resp.valid == true && nodes_raw == false && $ == false) {
            // remove 'valid' key if justLevel is not defined
            //if (!justlevel) delete resp.valid; //this doesnt seem right (27-4-21)
            _this6.x_memory_cache.getNode[id] = resp;
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
      var _arguments6 = arguments,
          _this7 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this7.throwIfMissing('id - ParentNode'),
          recurse = false
        } = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : {};
        if (_this7.$ === null) throw new Error('call process() first!');

        var padre = _this7.$("node[ID=".concat(id, "]")).parent('node');

        var resp = {},
            me = _this7;

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
      var _arguments7 = arguments,
          _this8 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this8.throwIfMissing('id - ParentNodesIDs'),
          array = false
        } = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : {};

        var padres = _this8.$("node[ID=".concat(id, "]")).parents('node');

        var resp = [],
            me = _this8;
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
      var _arguments8 = arguments,
          _this9 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this9.throwIfMissing('id - ChildrenNodesIDs'),
          array = false
        } = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : {};

        var hijos = _this9.$("node[ID=".concat(id, "]")).find('node');

        var resp = [],
            me = _this9;
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
      var _arguments9 = arguments,
          _this10 = this;

      return _asyncToGenerator(function* () {
        var {
          id = _this10.throwIfMissing('id - BrotherNodesIDs'),
          before = true,
          after = true,
          array = false
        } = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : {};
        var me_data = yield _this10.getNode({
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
    * @param 	{Boolean}	[remove] 		- Remove modified dates? (default:true)
    * @param 	{Function}	[extrastep] 	- Optional method to return make additional cleansing and return the xml
    * @return 	{String} 					  Modified DSL source ready to be saved and pushed to a version control
    */


    createGitVersion() {
      var _arguments10 = arguments,
          _this11 = this;

      return _asyncToGenerator(function* () {
        var remove = _arguments10.length > 0 && _arguments10[0] !== undefined ? _arguments10[0] : true;
        var extrastep = _arguments10.length > 1 ? _arguments10[1] : undefined;

        // 1) get copy of current DSL content into memory (for restoring after returning)
        var copy = _this11.$.html(),
            me = _this11; // 2) get all nodes


        var nodes = _this11.$("node"); // 


        nodes.each(function (i, elem) {
          // 3) replace all attributes CREATED with fixed value
          me.$(elem).attr("CREATED", "1552681669876");

          if (remove == true) {
            // 4) replace all attributes MODIFIED with fixed value
            me.$(elem).attr("MODIFIED", "1552681669876");
          } // 5) erase all attributes VSHIFT and HGAP


          me.$(elem).removeAttr("VSHIFT"); // 6) erase all attributes HGAP

          me.$(elem).removeAttr("HGAP");
        }); // 7) transform all latin accents into original-unicodes (fixAccents(text,recover=true) (helper class))

        var resp = _this11.$.html(); // 8) extrastep


        if (extrastep && typeof extrastep == 'function') {
          resp = extrastep(_this11.$);
        }

        resp = _this11.help.fixAccents(resp, true); // recover original tags to current parser $.

        _this11.$ = _this11.$.load(copy, {
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
    /** 
    * Finds all differences 'from' given dsl 'to' given dsl (for CLI arg --diff-from file.dsl)
    * and returns an object with 'deleted', 'added', and 'modified' IDs keys
    * @param 	{String}	from 				- From source DSL content (before code)
    * @param 	{String}	to 					- To source DSL content (after code, to compare)
    */


    getDifferences(from, to) {
      var _this12 = this;

      return _asyncToGenerator(function* () {
        _this12.debug.outT({
          message: 'getDifferences: init'
        });

        var changes = /*#__PURE__*/function () {
          var _ref7 = _asyncToGenerator(function* (source, target) {
            this.debug.outT({
              message: 'getDifferences: changes init'
            });

            var prettydiff = require('prettydiff');

            var extract = require('extractjs')();

            var report = {
              deleted: {},
              added: {},
              modified: {}
            }; //console.log(prettydiff);

            var opts = {
              source: source,
              diff: target
            };
            prettydiff.options.source = opts.source;
            prettydiff.options.diff = opts.diff;
            prettydiff.options.diff_format = 'json';
            this.debug.outT({
              message: "getDifferences: calling prettydiff"
            });
            var tdiff = prettydiff();
            this.debug.outT({
              message: "getDifferences: parsing diff as resp"
            });
            var resp = JSON.parse(tdiff).diff;
            this.debug.outT({
              message: "getDifferences: parsing diff as resp_bak"
            });
            var resp_bak = JSON.parse(tdiff).diff; // build report

            this.debug.outT({
              message: "getDifferences: building report"
            });
            var counter_ = 0;

            for (var line in resp) {
              if (counter_ % 1000 == 0) this.debug.outT({
                message: "getDifferences: reading 1000 lines from line ".concat(line, " (of ").concat(resp.length, ")")
              });
              counter_ += 1;
              var content = resp[line];
              var operator = content.shift();

              {
                //operator!='=' //true //operator!='r'
                //console.log('operador:'+operator);
                var related_id = -1;
                var test = extract("id=\"ID_{id}\"", content[0]);
                if (!test.id) test = extract("ID=\"ID_{id}\"", content[0]);

                if (test.id) {
                  related_id = "ID_".concat(test.id);

                  if (operator == '+') {
                    report.added[related_id] = resp[line]; //line
                  } else if (operator == 'r') {
                    //node modified
                    report.modified[related_id] = resp[line];
                  }
                } else {
                  //search parents for id if line doesn't contain it
                  //console.log('ID no encontrado en linea analizada '+content[0]+',revisando previos con operator tipo =');
                  for (var i = line; i >= 0; i--) {
                    resp_bak[i][0];

                    {
                      //'=,+,r,-'.split(',').includes(ope)
                      var to_check = resp_bak[i];

                      if (typeof to_check == 'string') {
                        to_check = to_check.trim(); //console.log('(string) getting code from '+to_check);
                      } else if (Array.isArray(to_check)) {
                        //console.log('to_check.length = '+to_check.length);
                        if (to_check.length == 3) {
                          //when ope is r=replace
                          to_check = to_check[2].trim();
                        } else {
                          to_check = to_check[1].trim();
                        }
                      }

                      if (to_check != '' && to_check.includes('ID_') == true) {
                        var _test = extract("id=\"ID_{id}\"", to_check);

                        if (!_test.id) _test = extract("ID=\"ID_{id}\"", to_check); //console.log('checking for ID',{to_check,test});

                        if (_test.id) {
                          related_id = "ID_".concat(_test.id);

                          if (operator == '+') {
                            report.added[related_id] = resp[line];
                          } else if (operator == '-') {
                            report.deleted[related_id] = resp[line];
                          } else if (operator == 'r') {
                            report.modified[related_id] = resp[line]; //line
                          }

                          break;
                        }
                      }
                    }
                  }
                }
              }
            }

            this.debug.outT({
              message: "getDifferences: applying post-filters"
            }); //filter; remove IDs from modified that also appear on added

            for (var x in report.added) {
              //21jun21
              if (opts.diff.includes(x) == true) {
                //if new file include the given ID and the old file, they it was modified (ex. an html note tag)
                if (report.added[x].length == 2) report.modified[x] = report.added[x];
                delete report.added[x];
              } else {
                delete report.modified[x];
              }
            } //filter2: remove IDs from added if they also appear on deleted


            for (var _x13 in report.deleted) {
              if (opts.source.includes(_x13) == false && opts.diff.includes(_x13) == true) ; else {
                if (_x13 in report.added) {
                  // if key is in added as well as deleted, then its a modified node
                  delete report.added[_x13];
                  report.modified[_x13] = report.deleted[_x13];
                  delete report.deleted[_x13];
                }
              }
            }

            for (var _x14 in report.modified) {
              if (opts.diff.includes(_x14) == false && opts.source.includes(_x14) == true) {
                //filter3: remove IDs from modified that dont exist in 'to' source, to 'deleted'
                report.deleted[_x14] = report.modified[_x14];
                delete report.modified[_x14];
              } else if (opts.source.includes(_x14) == false) {
                //filter3: remove IDs from modified that dont exist in 'source' source, to 'added'
                report.added[_x14] = report.modified[_x14];
                delete report.modified[_x14];
              } else if (_x14 in report.deleted) {
                delete report.deleted[_x14];
              } //only keep modified values that are of same node type


              if (report.modified[_x14] && report.modified[_x14].length == 2) {
                this.debug.outT({
                  message: "getDifferences: testing modified false positives"
                });

                var _from = extract("&lt;{tag} ", report.modified[_x14][0]);

                var after = extract("&lt;{tag} ", report.modified[_x14][1]); //let after = extract(`&lt;/{tag}&`,report.modified[x][1]);
                //if (!after.tag) after = extract(`&lt;/{tag} `,report.modified[x][1]);

                if (_from.tag != after.tag) {
                  this.debug.outT({
                    message: "getDifferences: removing: from '".concat(_from.tag, "' to '").concat(after.tag, "'")
                  });
                  delete report.modified[_x14];
                }
              } else {
                this.debug.outT({
                  message: "getDifferences: cleaning modified false positive"
                });
                delete report.modified[_x14];
              }
            }

            this.debug.outT({
              message: "getDifferences: finished processing"
            });
            return report;
          });

          return function (_x11, _x12) {
            return _ref7.apply(this, arguments);
          };
        }().bind(_this12);

        var resp = yield changes(from, to);
        return resp;
      })();
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

}));
