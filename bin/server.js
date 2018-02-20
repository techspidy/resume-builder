/* jshint node: true */
'use strict';

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
let debug = require('debug')('eblocks:server');

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	if (process.env.NODE_ENV === 'production') {
		let httpsServer = require('../app');
		httpsServer.listen(80, 443);
	} else {
		let app = require('./www');
	}
	debug('started on worker');	
	//var app = require('./www');
}