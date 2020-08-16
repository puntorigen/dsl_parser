# Punto Origen OPEN Framework : ES6 Classes
<sup>Note: you need to pass all arguments as an Object with keys.</sup>

# API Reference
dsl_parser: A class for parsing Concepto DSL files, and compile them with the OPEN Framework.


* [dsl_parser](#module_dsl_parser)
    * _instance_
        * [.process()](#module_dsl_parser+process)
        * [.getParser()](#module_dsl_parser+getParser) ⇒ <code>Object</code>
        * [.getNodes([text], [attribute], [attribute_value], [icon], [level], [link], [recurse], [nodes_raw])](#module_dsl_parser+getNodes) ⇒ <code>Array.&lt;NodeDSL&gt;</code>
        * [.getNode(id, [recurse], [dates], [$], [nodes_raw])](#module_dsl_parser+getNode) ⇒ <code>Array.&lt;NodeDSL&gt;</code>
        * [.getParentNode(id, [recurse])](#module_dsl_parser+getParentNode) ⇒ <code>NodeDSL</code>
        * [.getParentNodesIDs(id, [array])](#module_dsl_parser+getParentNodesIDs) ⇒ <code>String</code> \| <code>Array</code>
        * [.getChildrenNodesIDs(id, [array])](#module_dsl_parser+getChildrenNodesIDs) ⇒ <code>String</code> \| <code>Array</code>
        * [.getBrotherNodesIDs(id, [before], [after])](#module_dsl_parser+getBrotherNodesIDs) ⇒ <code>String</code>
        * [.createGitVersion()](#module_dsl_parser+createGitVersion) ⇒ <code>String</code>
        * [.findVariables(text, [symbol], [symbol_closing], [array])](#module_dsl_parser+findVariables) ⇒ <code>String</code>
        * [.replaceVarsSymbol(text, from, to)](#module_dsl_parser+replaceVarsSymbol) ⇒ <code>String</code>
    * _inner_
        * [~NodeDSL](#module_dsl_parser..NodeDSL) : <code>Object</code>
        * [~Arrow](#module_dsl_parser..Arrow) : <code>Object</code>

<a name="module_dsl_parser+process"></a>

### dsl_parser.process()
Executes initial processing for parser

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  
<a name="module_dsl_parser+getParser"></a>

### dsl_parser.getParser() ⇒ <code>Object</code>
Gets a reference to the internal parser

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  
<a name="module_dsl_parser+getNodes"></a>

### dsl_parser.getNodes([text], [attribute], [attribute_value], [icon], [level], [link], [recurse], [nodes_raw]) ⇒ <code>Array.&lt;NodeDSL&gt;</code>
Get all nodes that contain the given arguments (all optional)

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [text] | <code>String</code> |  | Finds all nodes that contain its text with this value |
| [attribute] | <code>String</code> |  | Finds all nodes that contain an attribute with this name |
| [attribute_value] | <code>String</code> |  | Finds all nodes that contain an attribute with this value |
| [icon] | <code>String</code> |  | Finds all nodes that contain these icons |
| [level] | <code>Int</code> |  | Finds all nodes that are on this level |
| [link] | <code>String</code> |  | Finds all nodes that contains this link |
| [recurse] | <code>Boolean</code> | <code>true</code> | include its children |
| [nodes_raw] | <code>Boolean</code> | <code>false</code> | if this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them. |

<a name="module_dsl_parser+getNode"></a>

### dsl_parser.getNode(id, [recurse], [dates], [$], [nodes_raw]) ⇒ <code>Array.&lt;NodeDSL&gt;</code>
Get node data for the given id

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Int</code> |  | ID of node to request |
| [recurse] | <code>Boolean</code> | <code>true</code> | include its children |
| [dates] | <code>Boolean</code> | <code>true</code> | include parsing creation/modification dates |
| [$] | <code>Boolean</code> | <code>false</code> | include cheerio reference |
| [nodes_raw] | <code>Boolean</code> | <code>false</code> | if recurse is false and this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them. |

<a name="module_dsl_parser+getParentNode"></a>

### dsl_parser.getParentNode(id, [recurse]) ⇒ <code>NodeDSL</code>
Returns the parent node of the given node id

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Int</code> |  | ID of node to request |
| [recurse] | <code>Boolean</code> | <code>false</code> | include its children |

<a name="module_dsl_parser+getParentNodesIDs"></a>

### dsl_parser.getParentNodesIDs(id, [array]) ⇒ <code>String</code> \| <code>Array</code>
Returns the parent nodes ids of the given node id

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Int</code> |  | node id to query |
| [array] | <code>Boolean</code> | <code>false</code> | get results as array, or as a string |

<a name="module_dsl_parser+getChildrenNodesIDs"></a>

### dsl_parser.getChildrenNodesIDs(id, [array]) ⇒ <code>String</code> \| <code>Array</code>
Returns the children nodes ids of the given node id

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Int</code> |  | node id to query |
| [array] | <code>Boolean</code> | <code>false</code> | get results as array, or as a string |

<a name="module_dsl_parser+getBrotherNodesIDs"></a>

### dsl_parser.getBrotherNodesIDs(id, [before], [after]) ⇒ <code>String</code>
Returns the brother nodes ids of the given node id

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>Int</code> |  | node id to query |
| [before] | <code>Boolean</code> | <code>true</code> | consider brothers before the queried node |
| [after] | <code>Boolean</code> | <code>true</code> | consider brothers after the queried node |

<a name="module_dsl_parser+createGitVersion"></a>

### dsl_parser.createGitVersion() ⇒ <code>String</code>
Returns a modified version of the current loaded DSL, ready to be push to a version control (like github)

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  
**Returns**: <code>String</code> - Modified DSL source ready to be saved and pushed to a version control  
<a name="module_dsl_parser+findVariables"></a>

### dsl_parser.findVariables(text, [symbol], [symbol_closing], [array]) ⇒ <code>String</code>
Finds variables within given text

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>String</code> |  | String from where to parse variables |
| [symbol] | <code>String</code> | <code>**</code> | Wrapper symbol used as variable openning definition. |
| [symbol_closing] | <code>String</code> | <code>**</code> | Wrapper symbol used as variable closing definition. |
| [array] | <code>Boolean</code> | <code>false</code> | get results as array, or as a string |

<a name="module_dsl_parser+replaceVarsSymbol"></a>

### dsl_parser.replaceVarsSymbol(text, from, to) ⇒ <code>String</code>
Finds and transform variables wrapping/handlebars symbols given a 'from' symbol object and a 'to' symbol object within the given text

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | String from where to parse variables |
| from | <code>Object</code> | Object to identify source variables symbols (keys: open and close) |
| to | <code>Object</code> | Object to identify target variables symbols (keys: open and close) |

<a name="module_dsl_parser..NodeDSL"></a>

### dsl_parser~NodeDSL : <code>Object</code>
A node object representation of a DSL node.

**Kind**: inner typedef of [<code>dsl\_parser</code>](#module_dsl_parser)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Node unique ID. |
| level | <code>number</code> | Indicates the depth level from the center of the dsl map. |
| text | <code>string</code> | Indicates the text defined in the node itself. |
| text_rich | <code>string</code> | Indicates the html defined in the node itself. |
| text_note | <code>string</code> | Indicates the text/html defined in the notes view of the node (if any). |
| image | <code>string</code> | Image link defined as an image within the node. |
| cloud | <code>Object</code> | Cloud information of the node. |
| cloud.bgcolor | <code>string</code> | Background color of cloud. |
| cloud.used | <code>boolean</code> | True if cloud is used, false otherwise. |
| arrows | <code>Array.&lt;Arrow&gt;</code> | Visual connections of this node with other nodes [#module_dsl_parser..Arrow](#module_dsl_parser..Arrow). |
| nodes | <code>Array.&lt;NodeDSL&gt;</code> | Children nodes of current node. |
| font | <code>Object</code> | Define font, size and styles of node texts. |
| font.face | <code>Object</code> | Font face type used on node. |
| font.size | <code>Object</code> | Font size used on node. |
| font.bold | <code>Object</code> | True if node text is in bold. |
| font.italic | <code>Object</code> | True if node text is in italics. |
| style | <code>string</code> | Style applied to the node. |
| color | <code>string</code> | Text color of node. |
| bgcolor | <code>string</code> | Background color of node. |
| link | <code>string</code> | Link defined on node. |
| position | <code>string</code> | Position in relation of central node (left,right). |
| attributes | <code>Object</code> | Object with each attribute (key is attribute name, value is attribute value). |
| icons | <code>Array.&lt;string&gt;</code> | Array with icon names used in the node. |
| date_modified | <code>date</code> | Date of node when it was last modified. |
| date_created | <code>date</code> | Date of node when it was created. |

<a name="module_dsl_parser..Arrow"></a>

### dsl_parser~Arrow : <code>Object</code>
Arrow object definition, for connections to other nodes within a DSL.

**Kind**: inner typedef of [<code>dsl\_parser</code>](#module_dsl_parser)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| target | <code>string</code> | Target node ID of connection. |
| color | <code>string</code> | Color of visual connection. |
| style | <code>string</code> | Graphical representation type of link (source-to-target, target-to-source, both-ways). |


* * *

&copy; 2020 Pablo Schaffner &lt;pablo@puntorigen.com&gt;.
Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).