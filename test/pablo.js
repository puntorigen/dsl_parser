const dsl_parser = require('../lib/index');
var myArgs = process.argv.slice(2);

(async () => {
	let thefile = 'vue.dsl';
	if (myArgs.length>0) {
		thefile = myArgs[0];
	}
	// init DSL processing
	let test = new dsl_parser({ file:thefile, config:{ cancelled:false, debug:true } });
    await test.process();
    console.time('create git dsl');
    let gitdsl = await test.createGitVersion();
    console.timeEnd('create git dsl');
    //console.log('new git dsl',gitdsl);

    // get all level 2 nodes
    console.time('get all config');
    let level2 = await test.getNodes({ text:'config', icon:'desktop_new', level:2, nodes_raw:true });
    console.timeEnd('get all config');
    console.log('getNodes',level2);

    if (level2[0].getNodes) {
        console.log('getting sub-nodes');
        console.time('get sub nodes');
        let sub = await level2[0].getNodes();
        console.timeEnd('get sub nodes');
        console.log('sub nodes dump',sub);
    }
    // get 1 node
    /*     */
    /*
    console.time('test singlenode');
    let nodetest = await test.getNode({ id:'ID_531063662',recurse:true, $:false });
    console.timeEnd('test singlenode');
    console.log('single node test',nodetest);
    // get brother nodes
    console.time('test broterNodes:before');
    let nodetest2 = await test.getBrotherNodesIDs({ id:'ID_557757424', after:false });
    console.timeEnd('test broterNodes:before');
    console.log('botherNodes test :before',nodetest2);

    console.time('test broterNodes:after');
    nodetest2 = await test.getBrotherNodesIDs({ id:'ID_557757424', before:false });
    console.timeEnd('test broterNodes:after');
    console.log('botherNodes test :after',nodetest2);

    console.time('test broterNodes:both');
    nodetest2 = await test.getBrotherNodesIDs({ id:'ID_557757424' });
    console.timeEnd('test broterNodes:both');
    console.log('botherNodes test :both',nodetest2);

    let pattern = test.findVariables({ symbol:'{', symbol_closing:'}', text:'Esta es una {cosa} entre {la} frase' });
    console.log('findVariables result',pattern);

    let pattern2 = test.findVariables({ text:'La **persona**, que va **accion** es muy **tipo**.', array:true });
    console.log('findVariables2 result',pattern2);    
    
    
    */
    //console.log('debug level 2',level2);
    //console.log('debug level 2,config nodes',level2[0].nodes);
    //test parent node
    /*
    let parent = await test.getParentNode({ id:'ID_1727308935' });
    console.log('parent of copiar',parent);
    let parent2 = await test.getParentNode({ id:'ID_754025712' });
    console.log('parent of copiar2',parent2);*/
    /*
    // test get parent IDs
    let parentIDS = await test.getParentNodesIDs({ id:'ID_903673357' });
    console.log('parent IDs',parentIDS);
    // get children IDs of node
    let children = await test.getChildrenNodesIDs({ id:'ID_1867220605' });
    console.log('children IDs',children);
    */
	
})().catch(err => {
    console.error(err);
});
