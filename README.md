# Punto Origen OPEN Framework : ES6 Classes
<sup>Note: you need to pass all arguments as an Object with keys.</sup>

# API Reference
dsl_parser: A class for parsing Concepto DSL files, and compile them with the OPEN Framework.


* [dsl_parser](#module_dsl_parser)
    * [.getParser()](#module_dsl_parser+getParser) ⇒ <code>Object</code>
    * [.getNodes([text], [attribute], [attribute_value], [icon], [level], [link], [recurse], [nodes_raw])](#module_dsl_parser+getNodes) ⇒ <code>Array</code>
    * [.getNode(id, [recurse], [dates], [$], [nodes_raw])](#module_dsl_parser+getNode) ⇒ <code>Array</code>
    * [.getParentNode(id, [recurse])](#module_dsl_parser+getParentNode) ⇒ <code>Object</code>
    * [.getParentNodesIDs(id, [array])](#module_dsl_parser+getParentNodesIDs) ⇒ <code>String</code> \| <code>Array</code>
    * [.getChildrenNodesIDs(id, [array])](#module_dsl_parser+getChildrenNodesIDs) ⇒ <code>String</code> \| <code>Array</code>
    * [.getBrotherNodesIDs(id, [before], [after])](#module_dsl_parser+getBrotherNodesIDs) ⇒ <code>String</code>
    * [.createGitVersion()](#module_dsl_parser+createGitVersion) ⇒ <code>String</code>
    * [.findVariables(text, [symbol], [symbol_closing])](#module_dsl_parser+findVariables) ⇒ <code>String</code>

<a name="module_dsl_parser+getParser"></a>

### dsl_parser.getParser() ⇒ <code>Object</code>
Gets a reference to the internal parser

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  
<a name="module_dsl_parser+getNodes"></a>

### dsl_parser.getNodes([text], [attribute], [attribute_value], [icon], [level], [link], [recurse], [nodes_raw]) ⇒ <code>Array</code>
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
| [nodes_raw] | <code>Boolean</code> | <code>false</code> | if recurse is false and this is true, includes key nodes_raw (children nodes) in result with a cheerio reference instead of processing them. |

<a name="module_dsl_parser+getNode"></a>

### dsl_parser.getNode(id, [recurse], [dates], [$], [nodes_raw]) ⇒ <code>Array</code>
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

### dsl_parser.getParentNode(id, [recurse]) ⇒ <code>Object</code>
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

### dsl_parser.findVariables(text, [symbol], [symbol_closing]) ⇒ <code>String</code>
Finds variables within given text

**Kind**: instance method of [<code>dsl\_parser</code>](#module_dsl_parser)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>String</code> |  | String from where to parse variables |
| [symbol] | <code>Boolean</code> | <code>**</code> | Wrapper symbol used as variable openning definition. |
| [symbol_closing] | <code>Boolean</code> | <code>**</code> | Wrapper symbol used as variable closing definition. |


* * *

&copy; 2020 Pablo Schaffner &lt;pablo@puntorigen.com&gt;.
Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).