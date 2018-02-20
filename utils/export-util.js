'use strict';

class ExportUtil {

	static getCustomCSS(templateSlug) {
		let out = '';
		if (templateSlug === 'classic') {
			out = [
				'.container { margin-top: 0px; }'
			].join('');
		}
		return out;
	}
}

module.exports = ExportUtil;

