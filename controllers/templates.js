'use strict';

class TemplatesController {
	constructor() {

	}

	// retrive all templates
	static index(req, res, next) {
       	res.status(200).json(TemplatesController.generateObject());
	}

	static getDefaultTemplate() {
		return TemplatesController.generateObject()[0];
	}

	static isTemplatePro(templateSlug) {
		let templates = TemplatesController.generateObject();
		let isPro = false;
		for (var i = 0; i < templates.length; i++) {
			if (templates[i].slug === templateSlug) {
				isPro = templates[i].isPro;
				break;
			}
		}
		return isPro;
	}

	// TBD - move to db
	static generateObject() {
		return [
			{
				name: 'The Balance',
				slug: 'classic',
				isPro: false,
				previewUrl: 'https://apollo-resume.co/john_doe/demo-resume',
				options: [
					{
						slug: 'primaryColor',
						type: 'color',
						label: 'Color',
						value: '#000000'
					}
				]
			},
			{
				name: 'Minimal Creative',
				slug: 'minimal',
				isPro: false,
				previewUrl: 'https://apollo-resume.co/john_doe/minimal_creative',
				options: [
					{
						slug: 'primaryColor',
						type: 'color',
						label: 'Color',
						value: '#000000'
					}
				]
			}//,
			// {
			// 	name: 'Creative',
			// 	slug: 'default3',
			// 	isPro: true,
			// 	previewUrl: 'http://google.com',
			// 	options: [
			// 		{
			// 			slug: 'primaryColor',
			// 			type: 'color',
			// 			label: 'Color',
			// 			value: '#000000'
			// 		}
			// 	]
			// },
			// {
			// 	name: 'The hulk',
			// 	slug: 'default-second4',
			// 	isPro: true,
			// 	previewUrl: 'http://google.com',
			// 	options: [
			// 		{
			// 			slug: 'primaryColor',
			// 			type: 'color',
			// 			label: 'Color',
			// 			value: '#000000'
			// 		}
			// 	]
			// }
		];
	}
}

module.exports = TemplatesController;
