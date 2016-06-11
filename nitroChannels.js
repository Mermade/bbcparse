/*

Lists Nitro masterbrands (channels)

*/

function processResponse(obj) {
	for (var m in obj.nitro.results.items) {
		var mb = obj.nitro.results.items[m];
		console.log(mb.mid+','+mb.url_key+','+(mb.title ? mb.title : mb.name));
	}
	var dest = {};
	if ((obj.nitro.pagination) && (obj.nitro.pagination.next)) {
		dest.query = helper.queryFrom(obj.nitro.pagination.next.href,true);
		dest.path = path;
		dest.callback = processResponse;
	}
	nitro.setReturn(dest);
	return true;
}

var nitro = require('./nitroCommon');
var helper = require('./apiHelper');
var api = require('./nitroApi/api');

var config = require('./config.json');
var host = config.nitro.host;
var api_key = config.nitro.api_key;

var path = api.nitroMasterbrands;

var query = helper.newQuery();

nitro.make_request(host,path,api_key,query,{},processResponse);

process.on('exit', function(code) {
	//console.log('About to exit with code:', code);
});