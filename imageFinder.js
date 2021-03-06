var sdk = require('./nitroSdk.js');
var api = require('./nitroApi/api.js');

var config = require('./config.json');

var query = sdk.newQuery();
query.add(api.fImagesQ,process.argv[2],true);
query.add(api.xImagesEmbargoedInclude);

var host = config.nitro.host;
var path = api.nitroImages;
var key = config.nitro.api_key;
var recipe = process.argv.length>3 ? process.argv[3] : 'raw';

function processResults(obj){
	if (!obj.nitro.results.items) {
		//console.log(JSON.stringify(obj,null,2));
	}
	else {
		for (var i of obj.nitro.results.items) {
			var url = i.template_url.replace('$recipe',recipe);
			console.log('# '+(i.synopses.medium ? i.synopses.medium : i.synopses.short));
			console.log('curl -O http://'+url);
		}
	}
}

function handleResponse(obj){
	//console.log(JSON.stringify(obj,null,2));
	processResults(obj);
	if (obj.nitro.pagination && obj.nitro.pagination.next) {
		var query = sdk.newQuery();
		query = query.fromString(obj.nitro.pagination.next.href,true);
		sdk.make_request(host,path,key,query,{},handleResponse,function(err){
		});
	}
}

if (process.argv.length<3) {
	console.log('Usage: imageFinder {search-term} [{recipe}]');
}
else {
	sdk.make_request(host,path,key,query,{},handleResponse,function(err){
	});
}
