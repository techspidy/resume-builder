'use strict';

class Utils {
	static guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	static DateFormater(dateString) {
		let d = false;
		try {
			d = new Date(dateString);
		} catch (e) {

		}
		return {
			format: function(f) {
				return (d) ? d.getFullYear() : 'undefined';
			}
		}
	}
}

module.exports = Utils;
