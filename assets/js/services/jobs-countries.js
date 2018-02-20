(function() {
'use strict';
	
	angular.module('apollo').service('JobsCountriesService', function($q, $http) {

		return {
			getAll: function() {
				return [
					{ countryCode: 'aq', countryLabel: 'Antarctica' },
					{ countryCode: 'ar', countryLabel: 'Argentina' },
					{ countryCode: 'au', countryLabel: 'Australia' },
					{ countryCode: 'at', countryLabel: 'Austria' },
					{ countryCode: 'bh', countryLabel: 'Bahrain' },
					{ countryCode: 'be', countryLabel: 'Belgium' },
					{ countryCode: 'br', countryLabel: 'Brazil' },
					{ countryCode: 'ca', countryLabel: 'Canada' },
					{ countryCode: 'cl', countryLabel: 'Chile' },
					{ countryCode: 'cn', countryLabel: 'China' },
					{ countryCode: 'co', countryLabel: 'Colombia' },
					{ countryCode: 'cr', countryLabel: 'Costa Rica' },
					{ countryCode: 'cz', countryLabel: 'Czech Republic' },
					{ countryCode: 'dk', countryLabel: 'Denmark' },
					{ countryCode: 'ec', countryLabel: 'Ecuador' },
					{ countryCode: 'eg', countryLabel: 'Egypt' },
					{ countryCode: 'fi', countryLabel: 'Finland' },
					{ countryCode: 'fr', countryLabel: 'France' },
					{ countryCode: 'de', countryLabel: 'Germany' },
					{ countryCode: 'gr', countryLabel: 'Greece' },
					{ countryCode: 'hk', countryLabel: 'Hong Kong' },
					{ countryCode: 'hu', countryLabel: 'Hungary' },
					{ countryCode: 'in', countryLabel: 'India' },
					{ countryCode: 'id', countryLabel: 'Indonesia' },
					{ countryCode: 'ie', countryLabel: 'Ireland' },
					{ countryCode: 'il', countryLabel: 'Israel' },
					{ countryCode: 'it', countryLabel: 'Italy' },
					{ countryCode: 'jp', countryLabel: 'Japan' },
					{ countryCode: 'kw', countryLabel: 'Kuwait' },
					{ countryCode: 'lu', countryLabel: 'Luxembourg' },
					{ countryCode: 'my', countryLabel: 'Malaysia' },
					{ countryCode: 'mx', countryLabel: 'Mexico' },
					{ countryCode: 'ma', countryLabel: 'Morocco' },
					{ countryCode: 'nl', countryLabel: 'Netherlands' },
					{ countryCode: 'nz', countryLabel: 'New Zealand' },
					{ countryCode: 'ng', countryLabel: 'Nigeria' },
					{ countryCode: 'no', countryLabel: 'Norway' },
					{ countryCode: 'om', countryLabel: 'Oman' },
					{ countryCode: 'pk', countryLabel: 'Pakistan' },
					{ countryCode: 'pa', countryLabel: 'Panama' },
					{ countryCode: 'pe', countryLabel: 'Peru' },
					{ countryCode: 'ph', countryLabel: 'Philippines' },
					{ countryCode: 'pl', countryLabel: 'Poland' },
					{ countryCode: 'pt', countryLabel: 'Portugal' },
					{ countryCode: 'qa', countryLabel: 'Qatar' },
					{ countryCode: 'ro', countryLabel: 'Romania' },
					{ countryCode: 'ru', countryLabel: 'Russia' },
					{ countryCode: 'sa', countryLabel: 'Saudi Arabia' },
					{ countryCode: 'sg', countryLabel: 'Singapore' },
					{ countryCode: 'za', countryLabel: 'South Africa' },
					{ countryCode: 'kr', countryLabel: 'South Korea' },
					{ countryCode: 'es', countryLabel: 'Spain' },
					{ countryCode: 'se', countryLabel: 'Sweden' },
					{ countryCode: 'ch', countryLabel: 'Switzerland' },
					{ countryCode: 'tw', countryLabel: 'Taiwan' },
					{ countryCode: 'th', countryLabel: 'Thailand' },
					{ countryCode: 'tr', countryLabel: 'Turkey' },
					{ countryCode: 'ua', countryLabel: 'Ukraine' },
					{ countryCode: 'ae', countryLabel: 'United Arab Emirates' },
					{ countryCode: 'gb', countryLabel: 'United Kingdom' },
					{ countryCode: 'us', countryLabel: 'United States' },
					{ countryCode: 'uy', countryLabel: 'Uruguay' },
					{ countryCode: 've', countryLabel: 'Venezuela' },
					{ countryCode: 'vn', countryLabel: 'Vietnam' } 
				];
				
			},
		};
	});

}());