/* jshint node: true */
'use strict';

class ResHelper {
	static error(res, err, statusCode) {
		res.status(statusCode || 404).json(err);
	}

	static success(req, res, data, statusCode, links) {
		let responseData = {};
		responseData.links = {
			self: ''
		};

		responseData.attributes = data;

		res.status(statusCode || 200).json({
			data: responseData,
			meta: {},
			errors: [],
			included: []
		});
	}
}

module.exports = ResHelper;
