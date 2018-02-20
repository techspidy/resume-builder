'use strict';

let http = require('http');

const indeedPublisherId = 'INDEED_PUBLISHER_ID';
let indeedHost = 'api.indeed.com';
let indeedApiPath = '/ads/apisearch?publisher=' + indeedPublisherId;
indeedApiPath += '&format=json';

class JobsController {

	static getJobsByProvider(req, res, next) {
		// :provider/:country/:page/:limit/:query
		let limit = 20;
		let q = req.params.query;
		if (q === 'all') {
			q = '';			
		} else {
			q = encodeURIComponent(q);
		}

		let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		let indeedPathBuild = indeedApiPath;
		indeedPathBuild += '&q=' + encodeURIComponent(req.params.query);
		indeedPathBuild += '&co=' + req.params.country;
		indeedPathBuild += '&useragent=' + encodeURIComponent(req.useragent.source);
		indeedPathBuild += '&userip=' + ip;
		indeedPathBuild += '&v=' + 2;
		indeedPathBuild += '&limit=' + limit;

		let startAt = 0;		
		let page = parseInt(req.params.page, 10);
		startAt = page * limit;

		indeedPathBuild += '&start=' + startAt;

		JobsController.requestIndeed(indeedPathBuild)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			return res.status(401).json({
				title: 'Could not retrive data',
				status: 401
			});
		});
	}

	static requestIndeed(path) {
		return new Promise((resolve, reject) => {

			var options = {
			  hostname: indeedHost,
			  port: 80,
			  path: path,
			  method: 'GET'
			};
			let req = http.request(options, (res) => {
				if (res.statusCode != 200) {
					reject(new Error('Could not retrive data, wrong status'));
				}
				let dataBuffer = '';
				let indeedDataResponse = {};

				res.on('end', function () {
					try {
						indeedDataResponse = JSON.parse(dataBuffer);
					} catch (e) {
						reject(e);
					}
					resolve(indeedDataResponse);
				});

			  	res.on('data', (chunk) => {
			  		dataBuffer += chunk;
			  	});
			});
			req.end();

			req.on('error', (e) => {
			  reject(e);
			});
		});
	}
}

module.exports = JobsController;

