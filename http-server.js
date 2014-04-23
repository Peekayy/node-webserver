var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use('/', express.static(process.cwd()));

if(!process.argv[2]){
	console.info('Usage : node-webserver PORT');
}else{
	try{
		app.listen(process.argv[2]);
		console.info('Server listening on '+process.argv[2]);
	}catch(e){
		console.info(e);
	}
}