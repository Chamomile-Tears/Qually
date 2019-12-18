// ==UserScript==
// @name         Новый докач
// @version      0.1
// @match        https://ca.howrse.com/*
// @match        https://www.lowadi.com/*
// ==/UserScript==

var horse = {};
var set = {};

function getKeyByValue(object, value) { 
	return Object.keys(object).find(key => object[key] === value); 
}

function randomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
}

async function get(url, update) {
	result = await $.ajax({
		type: "GET",
		url: window.location.origin + url
	});
	if (update) {updatePage(result, false);}
	return result;
}

async function post(postData, url, update) {
	result = await $.ajax({
		type: "POST",
		url: window.location.origin + url,
		data: postData
	});
	if (update) {updatePage(result, true);}
	return result;
}

function updatePage(result, post) {
	if (post) {
		if (result['chevalEnergie'] !== undefined) {
			horse.energy = result['chevalEnergie']; $('#energie').text(result['chevalEnergie'].toFixed(0));
			$('#gauge-energie span:eq(0)').attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalEnergie'].toFixed(0));
		}
		if (result['chevalSante'] !== undefined) {
			horse.health = result['chevalSante']; $('#sante').text(result['chevalSante'].toFixed(0));
			$('#gauge-sante span:eq(0)').attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalSante'].toFixed(0));
		}
		if (result['chevalMoral'] !== undefined) {
			horse.mood = result['chevalMoral']; $('#moral').text(result['chevalMoral'].toFixed(0));
			$('#gauge-moral span:eq(0)').attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalMoral'].toFixed(0));
		}

		if (result['coefficientEnergieEndurance'] !== undefined) {
			horse.entrainementEnduranceEn = result['coefficientEnergieEndurance'] / 2;
		}
		if (result['coefficientEnergievitesse'] !== undefined) {
			horse.entrainementVitesseEn = result['coefficientEnergievitesse'] / 2;
		}
		if (result['coefficientEnergieDressage'] !== undefined) {
			horse.entrainementDressageEn = result['coefficientEnergieDressage'] / 2;
		}
		if (result['coefficientEnergieGalop'] !== undefined) {
			horse.entrainementGalopEn = result['coefficientEnergieGalop'] / 2;
		}
		if (result['coefficientEnergieTrot'] !== undefined) {
			horse.entrainementTrotEn = result['coefficientEnergieTrot'] / 2;
		}
		if (result['coefficientEnergieSaut'] !== undefined) {
			horse.entrainementSautEn = result['coefficientEnergieSaut'] / 2;
		}

		if (result['chevalTemps'] !== undefined) {
			var date = new Date(null); date.setSeconds(result['chevalTemps']);
			horse.time = (result['chevalTemps']/60);
			$('.circle-item-off').text(date.toISOString().substr(11, 5));
		}

		if (result['varsB3'] !== undefined) {horse.forest = result['varsB3'];}
		if (result['varsB1'] !== undefined) {horse.mountain = result['varsB1'];}

		if (result['blocks'] !== undefined) {
			let blocks = Object.values(result['blocks']);
			blocks.forEach((elem) => {
				if (elem !== null) {
					let blockId = elem.split('id="')[1];
					if (blockId !== undefined) {
						blockId = blockId.split('"')[0];
						$('#' + blockId).html(elem).change();
					}
				}
			});
		}
	}
	else {
		var html = document.createElement('html');
		html.innerHTML = result;
		$('#content').html($('#content', html).html()).change();
		$('#reserve').html($('#reserve', html).html()).change();
		$('#pass').html($('#pass', html).html()).change();
	}
}

function setRandomCoordinates(id, html) {
	$('#' + id, html).find('input').eq(2).val(randomInteger(10,90));
	$('#' + id, html).find('input').eq(3).val(randomInteger(10,90));
}

async function action(id, url, html) {
	if ($('#' + id).length > 0) {
		let re = new RegExp(id,'g');
		let postData = $('#' + id, html).serialize().replace(re, '').toLowerCase().split('&');
		if (postData.length == 4) {
			setRandomCoordinates(id, html);
		}
		postData = postData.join('&');
		await post(postData, url, true);
	}
}

async function feed(html, plus) {
	setRandomCoordinates('feeding', html);
	if (chevalAge > 5) {
		let fourrage = $('.section-fourrage-quantity', html).text().trim().replace(/ /g, '').split('/');
		let avoine = 0;
		fourrage = fourrage[1] - fourrage[0];
		$('#feeding', html).find('input').eq(4).val(fourrage);
		
		if (chevalAge > 17) {
			avoine = $('.section-avoine-quantity', html).text().trim().replace(/ /g, '').split('/');
			avoine = avoine[1] - avoine[0];
			if (plus) {avoine += 3;}
			$('#feeding', html).find('input').eq(5).val(avoine);
		}
		
		if ($('#feeding .message', html).length !== 0) {
			if ($('#feeding .message', html).text().indexOf('20') !== -1) {
				$('#feeding', html).find('input').eq(4).val(20 - $('.section-fourrage-quantity', html).text().trim().replace(/ /g, '').split('/')[0]);
			}
			else {
				$('#feeding', html).find('input').eq(4).val(0);
			}
		}

		if ((fourrage !== 0) || (avoine !== 0)) {
			let re = new RegExp('feeding','g');
			postData = $('#feeding', html).serialize().replace(re, '').toLowerCase();
			await post(postData, '/elevage/chevaux/doEat', true);
		}
	}
	else {
		await action('form-do-suckle', '/elevage/chevaux/doSuckle', html);
	}
}

async function train(id, url, html, first) {
	var maxTime;
	var energyPoints;
	first ? maxTime = 1230 : maxTime = 1290;
	if (id == 'formCenterPlay') {
		energyPoints = Math.floor((horse.energy - 20) / horse.playEnergy);
	}
	else {
		energyPoints = Math.floor((horse.energy - 20) / horse[id+'En']);
	}
	let timePoints = Math.floor((maxTime - horse.time) / 30);
	let points = Math.min(energyPoints, timePoints);
	await doTrain(id, url, points, html);
}

async function doTrain(id, url, points, html) {
	let re = new RegExp(id,'g');
	if (id == 'formCenterPlay') {
		$('#' + id, html).find('input').eq(8).val(points);
		horse.energy -= horse.playEnergy * points;
	}
	else {
		$('#' + id, html).find('input').eq(3).val(points);
		horse.energy -= horse[id+'En'] * points;
	}
	let postData =  $('#' + id, html).serialize().replace(re, '').replace('formcenterplay', 'formCenterPlay').toLowerCase();
	await post(postData, url, true);
}

async function mission(html) {
	if (horse.age > 23) {
		tooltip = document.createElement('html'); 
		tooltip.innerHTML = $('[id*="boutonMission"]', html).attr('_tooltip');
		let energyDelta = horse.energy - $('strong:eq(1)', tooltip).text().replace(/[^0-9]/gim, '');
		if (energyDelta > 19) {
			let postData = 'id=' + horse.id;
			await post(postData, '/elevage/chevaux/doCentreMission', true);
		}
	}
}

async function competitions(type) {
	var postData;
	if ((type == 'trot') || (type == 'galop')) {
		postData = `type=${type}&id=${horse.id}&course=${type}&sort=inscrits-d`;
	}
	else if (type == 'cross') {
		postData = `type=${type}&id=${horse.id}&longueur=5&sort=inscrits-d`;
	}
	else if (type == 'cso') {
		postData = `type=${type}&id=${horse.id}&longueur=2&sort=inscrits-d`;
	}
	else {
		postData = `type=${type}&id=${horse.id}&sort=inscrits-d`;
	}
	result =  await post(postData, '/elevage/competition/liste');
	result = result['content'];
	await doCompetitions(result, 0);
}

async function doCompetitions(list, count) {
	var html = document.createElement('html');
	html.innerHTML = list;
	var compEnergyNext = Number($('.highlight:eq(' + (count+1) + ') td:eq(6)', html).text().replace(/[^.0-9]/g, ''));
	if ((horse.energy - compEnergyNext > 19) && (horse.time < 1291)) {
		let scr = $('#public script:contains("key"):eq(' + count + ')', html).html();
		if (scr !== undefined) {
			scr = scr.split('AjaxPAGE(\'')[1].split('\', {\'method')[0];
			let url = scr;
			let result = await get(url);
			if (result['fieldsErrors'] !== undefined) {
				if ((result['fieldsErrors']['place'] !== undefined) || (result['fieldsErrors']['deja'] !== undefined)) {
					count++;
					await doCompetitions(list, count);
				}
			}
			else {
				let compEnergy = Number($('.highlight:eq(' + count + ') td:eq(6)', html).text().replace(/[^.0-9]/g, ''));
				compEnergyNext = Number($('.highlight:eq(' + (count+1) + ') td:eq(6)', html).text().replace(/[^.0-9]/g, ''));
				horse.energy -= compEnergy;
				horse.time += 120;
				if ((horse.energy - compEnergyNext > 19) && (horse.time < 1291)) {
					count++;
					await doCompetitions(list, count);
				}
				else {
					await get('/elevage/chevaux/cheval?id=' + horse.id, true);
				}
			}
		}
	}
}

async function work(id, first) {
	if (id == 'formCenterPlay') {
		await train(id, '/elevage/chevaux/doPlay', document, first);
	}
	else if (id.indexOf('formbalade') !== -1) {
		await train(id, '/elevage/chevaux/doWalk', document, first);
	}
	else if (id.indexOf('entrainement') !== -1) {
		await train(id, '/elevage/chevaux/doTraining', document, first);
	}
	else {
		await competitions(id);
	}
}

function setHorseSkills() {
	let arr = ['entrainementEndurance', 'entrainementVitesse', 'entrainementDressage', 'entrainementGalop', 'entrainementTrot', 'entrainementSaut'];
	let skills = $('#training-body-content .gauge-container');
	for (let i = 0; i < skills.length; i++) {
		horse[arr[i]] = Number($(skills).eq(i).attr('class').split('width-')[1]);
	}
	skillsAnalysis();
}

function skillsAnalysis() {
	var skills = [];
	let trainOrder = [];
	if (chevalAge < 18) {
		trainOrder[trainOrder.length] = 'formCenterPlay';
	}
	else if (chevalAge > 23) {
		skills = ['entrainementEndurance', 'entrainementVitesse', 'entrainementDressage', 'entrainementGalop', 'entrainementTrot', 'entrainementSaut'];
		var skillsValues = [enduranceGenetique, vitesseGenetique, dressageGenetique, galopGenetique, trotGenetique, sautGenetique];
		for (let i = 0; i < 6; i++) {
			let indexOfMaxItem = skillsValues.indexOf(Math.max(...skillsValues));
			if (horse[skills[indexOfMaxItem]] < 100) {trainOrder.push(skills[indexOfMaxItem]);}
			skills.splice(indexOfMaxItem, 1);
			skillsValues.splice(indexOfMaxItem, 1);
		}
	}
	if (chevalAge > 17) {
		let sumForet = dressageGenetique + galopGenetique + sautGenetique;
		let sumMontagne = vitesseGenetique + enduranceGenetique + trotGenetique;
		if ($('a.centerLocalisationForet').length > 0) {sumForet *= 2;}
		else if ($('a.centerLocalisationMontagne').length > 0) {sumMontagne *= 2;}
		if (sumForet > sumMontagne) {
			if (b3 < 100) {trainOrder.push('formbaladeForet');}
			if (b1 < 100) {trainOrder.push('formbaladeMontagne');}
		}
		else {
			if (b1 < 100) {trainOrder.push('formbaladeMontagne');}
			if (b3 < 100) {trainOrder.push('formbaladeForet');}
		}
	}
	if (chevalAge > 35) {
		//Получаем массив незажирнённых скиллов
		let notBoldSkills = [];
		let notBoldSkillsValues = [];
		skills = ['entrainementEndurance', 'entrainementVitesse', 'entrainementDressage', 'entrainementGalop', 'entrainementTrot', 'entrainementSaut'];
		var skillsValues = [enduranceGenetique, vitesseGenetique, dressageGenetique, galopGenetique, trotGenetique, sautGenetique];
		let boldValues = [enduranceComplet, vitesseComplet, dressageComplet, galopComplet, trotComplet, sautComplet];
		for (let i = 0; i < 6; i++) {
			if (!(boldValues[i])) {
				notBoldSkills.push(skills[i]);
				notBoldSkillsValues.push(skillsValues[i]);
			}
		}
		//Сортируем массив незажирнённых скиллов по ГП
		let arr = [];
		let notBoldSkillsLength = notBoldSkills.length;
		for (let i = 0; i < notBoldSkillsLength; i++) {
			let indexOfMaxItem = notBoldSkillsValues.indexOf(Math.max(...notBoldSkillsValues));
			arr.push(notBoldSkills[indexOfMaxItem]);
			notBoldSkills.splice(indexOfMaxItem, 1);
			notBoldSkillsValues.splice(indexOfMaxItem, 1);
		}
		notBoldSkills = arr;
		var comp = getBestCompetition(notBoldSkills.reverse());
		if (comp !== '') {trainOrder.push(comp);}
	}
	horse.trainOrder = trainOrder;
	console.log(horse.trainOrder);
}

function getBestCompetition(skills) {
	let classicCompetitions = {
		trot: ['entrainementTrot', 'entrainementVitesse', 'entrainementDressage'],
		galop: ['entrainementGalop', 'entrainementVitesse', 'entrainementDressage'],
		dressage: ['entrainementDressage', 'entrainementTrot', 'entrainementGalop'],
		cross: ['entrainementEndurance', 'entrainementDressage', 'entrainementSaut'],
		cso: ['entrainementSaut', 'entrainementDressage', 'entrainementVitesse']
	}
	let westernCompetitions = {
		barrel: ['entrainementVitesse', 'entrainementEndurance', 'entrainementGalop'],
		cutting: ['entrainementEndurance', 'entrainementDressage', 'entrainementVitesse'],
		trailClass: ['entrainementDressage', 'entrainementTrot', 'entrainementSaut'],
		reining: ['entrainementGalop', 'entrainementDressage', 'entrainementEndurance'],
		westernPleasure: ['entrainementTrot', 'entrainementEndurance', 'entrainementDressage']
	}

	//Проверяем специализацию
	let specialization;
	let competitionsValues;
	if ($('#competition-body-content #specialisationClassique').length !== 0) {
		specialization = 'none';
		competitionsValues = Object.values(classicCompetitions);
		competitionsValues.push(...Object.values(westernCompetitions));
	}
	else if ($('#competition-body-content a:eq(0)').attr('class').indexOf('competition-trot') !== -1) {
		specialization = 'classique';
		competitionsValues = Object.values(classicCompetitions);
	}
	else if ($('#competition-body-content a:eq(0)').attr('class').indexOf('competition-barrel') !== -1) {
		specialization = 'western';
		competitionsValues = Object.values(westernCompetitions);
	}
	else if ($('span[style*="equiper.png"]').length !== 0) {
		//экипировать
		specialization = 'none';
		competitionsValues = Object.values(classicCompetitions);
		competitionsValues.push(...Object.values(westernCompetitions));
	}
	//Оцениваем эффективность соревнований
	let newSpec = '';
	let maxSum = 0;
	let bestCompetition = '';
	for (let i = 0; i < competitionsValues.length; i++) {
		let sum = 0;
		let comp = competitionsValues[i].filter(value => -1 !== skills.indexOf(value));
		for (let j = 0; j < comp.length; j++) {
			sum += ((skills).indexOf(comp[j]) + 1);
		}
		if (sum > maxSum) {
			if (specialization == 'classique') {bestCompetition = getKeyByValue(classicCompetitions, competitionsValues[i]);}
			else if (specialization == 'western') {bestCompetition = getKeyByValue(westernCompetitions, competitionsValues[i]);}
			else {
				if (getKeyByValue(classicCompetitions, competitionsValues[i]) !== undefined) {
					bestCompetition = getKeyByValue(classicCompetitions, competitionsValues[i]);
					newSpec = 'classique';
				}
				else {
					bestCompetition = getKeyByValue(westernCompetitions, competitionsValues[i]);
					newSpec = 'western';
				}
			}
			maxSum = sum;
		}
	}
	if (specialization == 'none') {return [newSpec, bestCompetition];}
	else return bestCompetition;
}

async function main() {
	if (horse.age < 8) {
		await action('form-do-groom', '/elevage/chevaux/doGroom', document);
		await feed(document);
		await action('form-do-night', '/elevage/chevaux/doNight', document);
	}
	else {
		await action('form-do-groom', '/elevage/chevaux/doGroom', document);
		await mission(document);
		if ((horse.trainOrder.length > 0) && (horse.age < 300)) {
			await work(horse.trainOrder[0], true);
			await action('form-do-stroke', '/elevage/chevaux/doStroke', document);
			await action('form-do-drink', '/elevage/chevaux/doDrink', document);
			//await action('form-do-eat-treat-carotte', '/elevage/chevaux/doEatTreat', document);
			//await action('form-do-eat-treat-mash', '/elevage/chevaux/doEatTreat', document);
			await feed(document, true);
			setHorseSkills();
			await work(horse.trainOrder[0], false);
		}
		else {
			await feed(document);
		}
		await action('form-do-night', '/elevage/chevaux/doNight', document);
		location.href = $('#nav-next').attr('href');
	}
}

$(document).ready(() => {
	(async () => {
		horse = {
			id: chevalId,
			age: chevalAge,
			sex: chevalSexe,
			name: $('.horse-name a').text(),
			energy: chevalEnergie,
			health: chevalSante,
			time: Number($('.circle-item-off').text().split(':')[0]*60) + Number($('.circle-item-off').text().split(':')[1]),
			forest: b3,
			mountain: b1,
			entrainementEnduranceEn: 8,
			entrainementVitesseEn: 8,
			entrainementDressageEn: 5,
			entrainementGalopEn: 7,
			entrainementTrotEn: 7,
			entrainementSautEn: 7,
		};
		switch (horse.age) {
			case 8: chevalDouche ? horse.playEnergy = 5.4: horse.playEnergy = 6; break;
			case 10: chevalDouche ? horse.playEnergy = 4.95 : horse.playEnergy = 5.5; break;
			case 12: chevalDouche ? horse.playEnergy = 4.5 : horse.playEnergy = 5; break;
			case 14: chevalDouche ? horse.playEnergy = 4.05 : horse.playEnergy = 4.5; break;
			case 16: chevalDouche ? horse.playEnergy = 3.6 : horse.playEnergy = 4; break;
		}
		chevalDouche ? horse.formbaladeForetEn = 8.1 : horse.formbaladeForetEn = 9;
		chevalDouche ? horse.formbaladeMontagneEn = 8.1 : horse.formbaladeMontagneEn = 9;
		setHorseSkills();
		await main();
	})();
});
