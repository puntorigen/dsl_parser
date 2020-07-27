const dsl_parser = require('../lib/index');
var myArgs = process.argv.slice(2);

(async () => {
	let thefile = 'vue.dsl';
	if (myArgs.length>0) {
		thefile = myArgs[0];
	}
	// init DSL processing
	let test = new dsl_parser(thefile,{ cancelled:false });
    await test.process();
    // get 1 node
    /*
    console.time('test singlenode');
    let nodetest = await test.getNode({ id:'ID_531063662',recurse:true });
    console.timeEnd('test singlenode');
    console.log('single node test',nodetest);
    */
    // get all level 2 nodes
    console.time('level 2 nodes');
    let level2 = await test.getNodes({ level:2, recurse:true });
    console.timeEnd('level 2 nodes');
    //console.log('debug level 2',level2);
    console.log('debug level 2,config nodes',level2[0].nodes);
    //test parent node
    let parent = await test.getParentNode({ id:'ID_1727308935' });
    console.log('parent of copiar',parent);
    let parent2 = await test.getParentNode({ id:'ID_754025712' });
    console.log('parent of copiar2',parent2);
	
})().catch(err => {
    console.error(err);
});
