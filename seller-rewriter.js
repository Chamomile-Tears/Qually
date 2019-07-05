//Глобальные переменные
var i;
var j;
var html = document.createElement('html');
var post;
var get;
var horsesId = [];
var salesList = [];
var listToSaleRewrite = [];
var affixesList = [];
var farmsList = [];
var fNames = femaleNames.split(',');
var mNames = maleNames.split(',');
var mode;
var subMode;
var listCounter = 0;
//Загрузка настроек
var inputs = ['sellrewBuyPrice', 'sellrewFarm', 'sellrewAffixe', 'sellrewMale', 'sellrewFemale', 'sellrewAuctionEquus', 'sellrewDirectEquus', 'sellrewDirectPasses', 'sellrewReserveEquus', 'sellrewReservePasses', 'sellrewBreeder', 'sellrewSelectAmount', 'sellrewHorseNumber'];
var selects = ['sellrewAddToName'];
var checkboxes = ['sellrewBuy', 'sellrewRewrite', 'sellrewRandom', 'sellrewSell', 'sellrewTeam', 'sellrewBuyEquus', 'sellrewBuyPasses', 'sellrewAuction', 'sellrewDirect', 'sellrewReserved'];
var arr = [];
arr = arr.concat(inputs).concat(selects).concat(checkboxes);
var set = {};
for (i = 0; i < arr.length; i++) {
	set[arr[i]] = localStorage.getItem(arr[i]);
}
var sellrewStartup = localStorage.getItem('sellrewStartup');
if ((sellrewStartup == null) || (sellrewStartup == undefined)) {sellrewStartup = 0;}
if (set.sellrewBuyEquus == '1') {$('#sellrewBuyPrice').attr('min', '500').change(); $('#sellrewBuyPrice').attr('max', '1500000').change();}
else if (set.sellrewBuyPasses == '1') {$('#sellrewBuyPrice').attr('min', '10').change(); $('#sellrewBuyPrice').attr('max', '2500').change();}
function parse(result) {
	html.innerHTML = result;
}

function randomInteger(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
}

function fillSalesList(i) {
	var horseGp = 0;
	var cTable = document.createElement('html')
	cTable.innerHTML = $('#table-0 tr.highlight:eq('+ i +') span.competence', html).attr('data-tooltip');
	for (j = 0; j < $('strong', cTable).length; j++) {horseGp += (Number($('strong', cTable).eq(j).text().replace(/ /gim, '').replace(/,/gim, '.')));}
	horseGp = horseGp.toFixed(2);

	var horseSkills = 0;
	var cTable = document.createElement('html')
	cTable.innerHTML = $('#table-0 tr.highlight:eq('+ i +') div.competence', html).attr('data-tooltip');
	for (j = 0; j < $('strong', cTable).length; j++) {horseSkills += (Number($('strong', cTable).eq(j).text().replace(/ /gim, '').replace(/,/gim, '.')));}
	horseSkills = horseSkills.toFixed(2);

	horsesId[horsesId.length] = $('#table-0 tr.highlight:eq('+ i +') a.horsename', html).attr('href').split('=')[1] + 'SELLREW' + $('#table-0 tr.highlight:eq('+ i +') a.horsename', html).text() + 'SELLREW' + $('#table-0 tr.highlight:eq('+ i +') img:eq(1)', html).attr('src').split('/')[6] + 'SELLREW' + horseGp + 'SELLREW' + horseSkills + 'SELLREW' + $('#table-0 tr.highlight:eq('+ i +') img.cheval-icone', html).attr('alt');
	var firstPrix = Number($('#table-0 tr.highlight:eq('+ i +') td div[id*="prix"]', html).text().replace(/[ ,NEGOTIABLE]/gim, ''));
	var scr = $('#table-0 tr.highlight:eq('+ i +') td div[id*="acheter"] script', html).html();
	var i1 = scr.indexOf('params') + 10;
	var i2 = scr.indexOf(' return false') - 7;
	scr = scr.substring(i1, i2).toLowerCase();
	salesList[salesList.length] = scr;
}

function getSales(m) {
	document.title = 'Страница продаж';
	salesList = [];
	if (localStorage.getItem('race-ane') == null) {
		get = $.ajax({
			type: "GET",
			url: window.location.origin + "/marche/vente/?type=prive&typeSave=1&"
		})
		.then(function(result) {
			parse(result);
			localStorage.setItem('race-ane', $('#race-ane', html).val());
			getSales();
		});
	}
	else {
		var compar = 'l';
		if (set.sellrewBuyPrice == '') {compar = 'g';}
		if (set.sellrewBuyEquus == '1') {
			get = $.ajax({
				type: "GET",
				url: window.location.origin + "/marche/vente/?type=prive&typeSave=1&amountComparaison=" + compar + "&amount=" + (Number(set.sellrewBuyPrice) + 1) + "&currency=soft&race-ane=" + localStorage.getItem('race-ane') + "&pierre-philosophale=2&sablier-chronos=2&bras-morphee=2&lyre-apollon=2&pack-nyx=2&caresse-philotes=2&don-hestia=2&chapeau-magique=2&double-face=2&livre-monstres=2&catrina-brooch=2&esprit-nomade=2&cloches=2&cravache=2&eperons=2&longe=2&crampons=2&tri=expirationDate&sens=DESC"
			})
			.then(function(result) {
				parse(result);
				if ($('img[src*="chevaux"]', html).length > 1) {
					for (i = 0; i < $('#table-0 tr.highlight', html).length; i++) {
						fillSalesList(i);
					}
					buyHorse(m);
				}
				else {
					if ((set.sellrewRewrite == '2') && (set.sellrewSell == '2')) {
						if (horsesId.length == 0) {
							alert('Ваши зарезервированные продажи по данным настройкам пусты. Ваши настройки:\nВалюта: экю\nМакс. цена: ' + set.sellrewBuyPrice);
						}
						localStorage.setItem('sellrewStartup', 0);
						localStorage.removeItem('sellrewWorkPlace');
						location.reload();
					}
				}
			});
		}
		else if (set.sellrewBuyPasses == '1') {
			get = $.ajax({
				type: "GET",
				url: window.location.origin + "/marche/vente/?type=prive&typeSave=1&amountComparaison=" + compar + "&amount=" + (Number(set.sellrewBuyPrice) + 1) + "&currency=hard&race-ane=" + localStorage.getItem('race-ane') + "&pierre-philosophale=2&sablier-chronos=2&bras-morphee=2&lyre-apollon=2&pack-nyx=2&caresse-philotes=2&don-hestia=2&chapeau-magique=2&double-face=2&livre-monstres=2&catrina-brooch=2&esprit-nomade=2&cloches=2&cravache=2&eperons=2&longe=2&crampons=2&tri=expirationDate&sens=DESC"
			})
			.then(function(result) {
				parse(result);
				if ($('img[src*="chevaux"]', html).length > 1) {
					for (i = 0; i < $('#table-0 tr.highlight', html).length; i++) {
						fillSalesList(i);
					}
					buyHorse(m);
				}
				else {
					if ((set.sellrewRewrite == '2') && (set.sellrewSell == '2')) {
						if (horsesId.length == 0) {
							alert('Ваши зарезервированные продажи по данным настройкам пусты. Ваши настройки:\nВалюта: пропуск\nМакс. цена: ' + set.sellrewBuyPrice);
						}
						localStorage.setItem('sellrewStartup', 0);
						localStorage.removeItem('sellrewWorkPlace');
						location.reload();
					}
				}
			});
		}
		else {
			alert('Вы не выбрали тип валюты для скупки лошадей! Проверьте настройки скрипта.');
		}
	}
}

var buyCounter = 0;
function buyHorse(m) {
	document.title = 'Покупаю лошадь № ' + buyCounter;
	post = $.ajax({
		type: "POST",
		url : window.location.origin + '/marche/vente/prive/doAcheter',
		data: salesList[buyCounter]
	})
	.then(function(result) {
		buyCounter++;
		if (salesList[buyCounter] == undefined) {
			if (salesList[buyCounter-1] == undefined) {
				buyCounter = 0;
				if (m == '1.1') {alert('Все зарезервированные лошади успешно выкуплены!');}
				else if (m == '1.2') {alert('Все зарезервированные лошади успешно выкуплены и переименованы!');}
				else if (m == '1.3') {alert('Все зарезервированные лошади успешно выкуплены и проданы!');}
				else if (m == '1.4') {alert('Все зарезервированные лошади успешно выкуплены, переименованы и проданы!');}
				$('#sellrewPower').click();
			}
			else {
				if (m == '1.1') {buyHorse(m);}
				else if (m == '1.2') {formRewriteData(horsesId[buyCounter-1], m);}
				else if (m == '1.3') {formSellData((horsesId[buyCounter-1]), m);}
				else if (m == '1.4') {formRewriteData(horsesId[buyCounter-1], m);}
			}
		}
		else {
			if (m == '1.1') {buyHorse(m);}
			else if (m == '1.2') {formRewriteData(horsesId[buyCounter-1], m);}
			else if (m == '1.3') {formSellData((horsesId[buyCounter-1]), m);}
			else if (m == '1.4') {formRewriteData(horsesId[buyCounter-1], m);}
		}
	});
}

var teamAffixesCount = 0;
var teamAffixes = [];
function getTeamAffixes(m) {
	document.title = 'Командные аффиксы';
	if ($('a.level-2.grid-table.width-100.align-middle[href^="/equipe/"]').length !== 0) {
		get = $.ajax({
			type: "GET",
			url: window.location.origin + '/equipe/'
		}).
		then(function(result) {
			parse(result);
			var teams = $('a[href*="/equipe/membre/?id="]', html);
			if ($(teams).eq(teamAffixesCount).length == 0) {
				getAffixes(m);
			}
			else {
				get = $.ajax({
					type: "GET",
					url: $(teams).eq(teamAffixesCount).attr('href'),
				}).
				then(function(result) {
					parse(result);
					teamAffixes[teamAffixes.length] = $('a.affixe', html).eq(0).text().replace(/ /gim, '').toLowerCase() + 'SELLREW' + $('a.affixe', html).eq(0).attr('href').split('id=')[1];
					teamAffixesCount++;
					if (teamAffixes.length < teams.length) {getTeamAffixes(m);}
					else {
						getAffixes(m);
					}
				});
			}
		});
	}
	else {
		getAffixes(m);
	}
}

function getAffixes(m) {
	document.title = 'Аффиксы игрока';
	affixesList = [];
	get = $.ajax({
		type: "GET",
		url: window.location.origin + '/elevage/bureau/?type=affixe'
	})
	.then(function(result) {
		parse(result);
		var affs = $('tr[height^="40"] .affixe', html);
		for (i = 0; i < affs.length; i++) {
			affixesList[affixesList.length] = $('tr[height^="40"] .affixe', html).eq(i).text().replace(/ /gim, '').toLowerCase() + 'SELLREW' + $('tr[height^="40"] .affixe', html).eq(i).attr('href').split('id=')[1];
		}
		if (teamAffixes.length > 0) {affixesList = affixesList.concat(teamAffixes);}
		localStorage.setItem('affixesList', affixesList);
		getFarms(m);
	});
}

function getFarms(m) {
	try {
		document.title = 'Заводы игрока';
		farmsList = [];
		get = $.ajax({
			type: "GET",
			url: window.location.origin + '/elevage/chevaux/?elevage=all-horses'
		})
		.then(function(result) {
			parse(result);
			var farms = $('.tab-action-select', html);
			for (i = 0; i < farms.length; i++) {
				farmsList[farmsList.length] = $('.tab-action-select', html).eq(i).text().replace(/ /gim, '').toLowerCase() + 'SELLREW' + $('.tab-action-select', html).eq(i).attr('href').split('tab-')[1];
			}
			localStorage.setItem('farmsList', farmsList);
			if ((m == '1.2') || (m == '1.4')) {
				getSales(m);
			}
			else if ((m == '2.1') || (m == '2.3')) {
				formRewriteData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
			}
		});
	}
	catch(e) {
		farmsList = [];
		getFarms();
	}
}

var coatRarity = 0;
var rewriteData = '';

function getCoatRarity(horse, m) {
	document.title = 'Редкость окраса';
	if (horse.indexOf('SELLREW') !== -1) {
		var hor = horse.split('SELLREW')[5];
		post = $.ajax({
			type: "POST",
			url: window.location.origin + '/communaute/doTabContent',
			data: 'type=tab-chevaux'
		})
		.then(function(result) {
			parse(result['statisticComplement']);
			var a = $('#table-2 a', html);
			var b = '';
			for (i = 0; i < a.length; i++) {
				if (hor.indexOf($(a).eq(i).text()) !== -1) {
					b = $(a).eq(i).attr('href'); break;
				}
			}
			get = $.ajax({
				type: "GET",
				url: window.location.origin + '/' + b,
			})
			.then(function(result) {
				parse(result);
				var percent = 100;
				var coats = $('#table-0 strong:not(".nowrap")', html);
				for (i = 0; i < coats.length; i++) {
					if (hor.indexOf($(coats).eq(i).text()) !== -1) {
						percent = Number($('#table-0 strong.nowrap', html).eq(i).text().replace('%', '')); break;
					}
				}
				if (percent < 6) {coatRarity = ' ' + percent + '%';}
				else {coatRarity = '';}
				formRewriteData(horse, m);
			});
		});
	}
	else {
		var url = horse.split(',')[0];
		var ct = horse.split(',')[1];
		get = $.ajax({
			type: "GET",
			url : window.location.origin + url
		})
		.then(function(result) {
			parse(result);
			var percent;
			var pNum;
			var percents = $('#table-0 td', html);
			for (var i = 0; i < percents.length; i++) {
				if ($('#table-0 td:eq('+i+')', html).text() == ct) {
					percent = $('#table-0 td:eq('+i+')', html).next().text();
					pNum = Number(percent.replace('%', ''));
				}
			}
			if (pNum < 6) {coatRarity = ' ' + pNum + '%';}
			else {coatRarity = '';}
			formRewriteData(horse.split(',')[2].toString(), m);
		});
	}
}

function formRewriteData(horse, m) {
	var a1; var a2; var a3; var a4; var isHorseFem;
	if (mode == 1) {
		document.title = 'Переименую № ' + buyCounter;
		if ((Number(set.sellrewAddToName) > 2) && (coatRarity === 0)) {
			getCoatRarity(horse, m);
		}
		else {
			a1 = horse.split('SELLREW')[0];
			if (horse.split('SELLREW')[2].indexOf('fem') == -1) {isHorseFem = false} else {isHorseFem = true;}
			if ((isHorseFem) && (set.sellrewFemale == '')) {
				if (set.sellrewRandom !== '1') {a2 = horse.split('SELLREW')[1];}
				else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
			}
			else if ((isHorseFem == false) && (set.sellrewMale == '')) {
				if (set.sellrewRandom !== '1') {a2 = horse.split('SELLREW')[1];}
				else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
			}
			else if ((isHorseFem) && (set.sellrewFemale !== '')) {
				if (set.sellrewRandom !== '1') {a2 = set.sellrewFemale;}
				else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
			}
			else if ((isHorseFem == false) && (set.sellrewMale !== '')) {
				if (set.sellrewRandom !== '1') {a2 = set.sellrewMale;}
				else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
			}
			switch(set.sellrewAddToName) {
				case 'none': break;
				case '0': a2 = a2 + ' ' + horse.split('SELLREW')[3]; break;
				case '1': a2 = a2 + ' ' + horse.split('SELLREW')[3].slice(-5); break;
				case '2': a2 = a2 + ' ' + horse.split('SELLREW')[4]; break;
				case '3': a2 = a2 + coatRarity; break;
				case '4': a2 = a2 + ' ' + horse.split('SELLREW')[3] + ' ' + coatRarity; break;
				case '5': a2 = a2 + ' ' + horse.split('SELLREW')[3].slice(-5) + ' ' + coatRarity; break;
				case '6': a2 = a2 + ' ' + horse.split('SELLREW')[4] + ' ' + coatRarity; break;
			}
			if (set.sellrewAffixe !== '') {
				if (set.sellrewAffixe == 'Без аффикса') {
					a3 = '';
				}
				else {
					for (i = 0; i < affixesList.length; i++) {
						if (set.sellrewAffixe.replace(/ /gim, '').toLowerCase() == affixesList[i].split('SELLREW')[0]) {a3 = affixesList[i].split('SELLREW')[1]; break;}
					}
				}
			}
			else {a3 = 'none';}
			if (set.sellrewFarm !== '') {
				if (set.sellrewFarm == 'Без завода') {
					a4 = '';
				}
				else {
					for (i = 0; i < farmsList.length; i++) {
						if (set.sellrewFarm.replace(/ /gim, '').toLowerCase() == farmsList[i].split('SELLREW')[0]) {a4 = farmsList[i].split('SELLREW')[1]; break;}
					}
				}
			}
			else {a4 = '';}

			if (a3 == 'none') {rewriteData = 'id=' + a1 + '&name=' + a2 + '&elevage=' + a4;}
			else {rewriteData = 'id=' + a1 + '&name=' + a2 + '&affixe=' + a3 + '&elevage=' + a4;}
			coatRarity = 0;
			if (rewriteData.indexOf('undefined') !== -1) {
				alert('Внимание! Неправильно указан аффикс или завод.\n' + rewriteData);
				$('#sellrewPower').click();
			}
			else {
				post = $.ajax({
					type: "POST",
					url: window.location.origin + '/elevage/chevaux/doUpdateProfil',
					data: rewriteData
				})
				.then(function(result) {
					if (m == '1.2') {buyHorse(m);}
					else if (m == '1.4') {formSellData(horsesId[buyCounter-1], m);}
				});
			}	
		}
	}
	else {
		document.title = 'Переименую № ' + (listCounter + 1);
		get = $.ajax({
			type: "GET",
			url: window.location.origin + '/elevage/chevaux/cheval?id=' + horse,
		})
		.then(function(result) {
			parse(result);
			a1 = horse;
			if ($('input[id*="poulain"]', html).length > 0) {
				if ($('input[id*="poulain"]', html).next().attr('src').indexOf('fem') == -1) {isHorseFem = false} else {isHorseFem = true;}
				if ((isHorseFem) && (set.sellrewFemale == '')) {
					if (set.sellrewRandom !== '1') {a2 = 'Девочка';}
					else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
				}
				else if ((isHorseFem == false) && (set.sellrewMale == '')) {
					if (set.sellrewRandom !== '1') {a2 = 'Мальчик';}
					else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
				}
				else if ((isHorseFem) && (set.sellrewFemale !== '')) {
					if (set.sellrewRandom !== '1') {a2 = set.sellrewFemale;}
					else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
				}
				else if ((isHorseFem == false) && (set.sellrewMale !== '')) {
					if (set.sellrewRandom !== '1') {a2 = set.sellrewMale;}
					else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
				}
				if (set.sellrewAffixe !== '') {
					if (set.sellrewAffixe == 'Без аффикса') {
						a3 = '';
					}
					else {
						for (i = 0; i < affixesList.length; i++) {
							if (set.sellrewAffixe.replace(/ /gim, '').toLowerCase() == affixesList[i].split('SELLREW')[0]) {a3 = affixesList[i].split('SELLREW')[1]; break;}
						}
					}
				}
				else {a3 = '';}
				if (set.sellrewFarm !== '') {
					if (set.sellrewFarm == 'Без завода') {
						a4 = '';
					}
					else {
						for (i = 0; i < farmsList.length; i++) {
							if (set.sellrewFarm.replace(/ /gim, '').toLowerCase() == farmsList[i].split('SELLREW')[0]) {a4 = farmsList[i].split('SELLREW')[1]; break;}
						}
					}
				}
				else {a4 = '';}
				rewriteData = 'valider=ok&poulain-1=' + a2 + '&affixe-1=' + a3 + '&elevage-1=' + a4;
				post = $.ajax({
					type: "POST",
					url: window.location.origin + '/elevage/chevaux/choisirNoms?jument=' + $('form', html).attr('action').split('=')[1],
					data: rewriteData
				})
				.then(function(result) {
					if (m == '2.1') {
						listCounter++;
						if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
							formRewriteData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
						}
						else {
							alert('Все отмеченные лошади успешно переименованы!');
							$('#sellrewPower').click();
						}
					}
					else if (m == '2.3') {
						formSellData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
					}
				});
			}
			else {
				var unusual = false;
				if ($('div.element img', html).length > 0) {
					if (($('div.element img', html).attr('src').indexOf('divin') !== -1) || ($('div.element img', html).attr('src').indexOf('chimerique') !== -1) || ($('div.element img', html).attr('src').indexOf('feuille-sauvage') !== -1) || ($('div.element img', html).attr('src').indexOf('arbre-ancestral') !== -1)) {unusual = true;}
				}
				var death = $('span[style*="ressusciter-cheval"]', html);
				var old = $('span[style*="2/paradis"]', html);
				if ((death.length !== 0) || (old.length !== 0)) {unusual = true;}
				if (unusual == false) {
					var info = $('script:contains("chevalAge")', html).text().replace(/[^a-zA-Zа-яА-Я0-9; =.'</>]/gim, '').split(';');
					horseId = +(info[0].replace(/\D+/g,""));
					horseSex = info[8].substr(info[8].indexOf("'")).replace(/'/gim, '');
					horseGP = $('#genetic-body-content strong:eq(1)', html).text().split(': ')[1];
					horseBreed = $('#characteristics-body-content td.first:eq(0) a', html).attr('href');
					horseCoat = $('#characteristics-body-content td.first:eq(3)', html).text().split(': ')[1];
					myName = info[4].substr(16).replace("<b>", '').replace("</b>", '');
					myName = myName.substr(1, myName.length-2);
					if ((Number(set.sellrewAddToName) > 2) && (coatRarity === 0)) {
						getCoatRarity((horseBreed + ',' + horseCoat + ',' + horseId), m);
					}
					else {
						if (horseSex.indexOf('fem') == -1) {isHorseFem = false} else {isHorseFem = true;}
						if ((isHorseFem) && (set.sellrewFemale == '')) {
							if (set.sellrewRandom !== '1') {a2 = myName;}
							else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
						}
						else if ((isHorseFem == false) && (set.sellrewMale == '')) {
							if (set.sellrewRandom !== '1') {a2 = myName;}
							else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
						}
						else if ((isHorseFem) && (set.sellrewFemale !== '')) {
							if (set.sellrewRandom !== '1') {a2 = set.sellrewFemale;}
							else {a2 = fNames[randomInteger(0, (fNames.length - 1))];}
						}
						else if ((isHorseFem == false) && (set.sellrewMale !== '')) {
							if (set.sellrewRandom !== '1') {a2 = set.sellrewMale;}
							else {a2 = mNames[randomInteger(0, (mNames.length - 1))];}
						}
						switch(set.sellrewAddToName) {
							case 'none': break;
							case '0': a2 = a2 + ' ' + horseGP; break;
							case '1': a2 = a2 + ' ' + horseGP.slice(-5); break;
							case '2': a2 = a2 + ' ' + $('#competencesValeur', html).text(); break;
							case '3': a2 = a2 + coatRarity; break;
							case '4': a2 = a2 + ' ' + horseGP + ' ' + coatRarity; break;
							case '5': a2 = a2 + ' ' + horseGP.slice(-5) + ' ' + coatRarity; break;
							case '6': a2 = a2 + ' ' + $('#competencesValeur', html).text() + ' ' + coatRarity; break;
						}
						if (set.sellrewAffixe !== '') {
							if (set.sellrewAffixe == 'Без аффикса') {
								a3 = '';
							}
							else {
								for (i = 0; i < affixesList.length; i++) {
									if (set.sellrewAffixe.replace(/ /gim, '').toLowerCase() == affixesList[i].split('SELLREW')[0]) {a3 = affixesList[i].split('SELLREW')[1]; break;}
								}
							}
						}
						else {a3 = 'none';}
						if (set.sellrewFarm !== '') {
							if (set.sellrewFarm == 'Без завода') {
								a4 = '';
							}
							else {
								for (i = 0; i < farmsList.length; i++) {
									if (set.sellrewFarm.replace(/ /gim, '').toLowerCase() == farmsList[i].split('SELLREW')[0]) {a4 = farmsList[i].split('SELLREW')[1]; break;}
								}
							}
						}
						else {
							a4 = $('div.elevage.align-center a', html).attr('href').split('=')[1];
							if (a4 == 'all-horses') {a4 = '';}
						}

						if (a3 == 'none') {rewriteData = 'id=' + a1 + '&name=' + a2 + '&elevage=' + a4;}
						else {rewriteData = 'id=' + a1 + '&name=' + a2 + '&affixe=' + a3 + '&elevage=' + a4;}
						coatRarity = 0;
						if (rewriteData.indexOf('undefined') !== -1) {
							alert('Внимание! Неправильно указан аффикс или завод.\n' + rewriteData);
							$('#sellrewPower').click();
						}
						else {
							post = $.ajax({
								type: "POST",
								url: window.location.origin + '/elevage/chevaux/doUpdateProfil',
								data: rewriteData
							})
							.then(function(result) {
								if (m == '2.1') {
									listCounter++;
									if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
										formRewriteData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
									}
									else {
										alert('Все отмеченные лошади успешно переименованы!');
										$('#sellrewPower').click();
									}
								}
								else if (m == '2.3') {
									formSellData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
								}
							});
						}	
					}
				}
				else {
					listCounter++;
					if (m == '2.1') {
						if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
							formRewriteData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
						}
						else {
							alert('Все отмеченные лошади успешно переименованы!');
							$('#sellrewPower').click();
						}
					}
					else if (m == '2.3') {
						if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
							formSellData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
						}
						else {
							alert('Все отмеченные лошади успешно переименованы и проданы!');
							$('#sellrewPower').click();
						}
					}
				}
			}
		});
	}
}

sellData = '';
function formSellData(horse, m) {
	if (mode == 1) {document.title = 'Продаю № ' + buyCounter;;}
	else {document.title = 'Продаю № ' + (listCounter+1);}
	var a1;
	var id;
	if (horse.indexOf('SELLREW') !== -1) {id = horse.split('SELLREW')[0];}
	else {id = horse;}
	var id = horse.split('SELLREW')[0];
	get = $.ajax({
		type: "GET",
		url: window.location.origin + '/marche/vente/vendre?id=' + id + '&pageOrigine=%2Felevage%2Fchevaux%2Fcheval%3Fid%3D' + id,
		data: 'pageOrigine=/elevage/chevaux/cheval?id=' + id
	})
	.then(function(result) {
		parse(result);
		var name = $('#vendreCheval input:eq(0)', html).attr('name').toLowerCase();
		var value = $('#vendreCheval input:eq(0)', html).attr('value').toLowerCase();
		var type = '';
		var valuteType = '';
		var prix = '';
		if (set.sellrewAuction == '1') {type = 'enchere';}
		else if (set.sellrewDirect == '1') {type = 'direct';}
		else if (set.sellrewReserved == '1') {type = 'prive';}
		else {alert('Внимание! Вы не выбрали тип продажи!'); $('#sellrewPower').click();}
		a1 = 'go=1&' + name + '=' + value + '&chevalSelection=' + id + '&divin=0&venteType=' + type + '&feesCollectedPercent=10&';
		if (($('.header-logo').html().indexOf('vip') == -1) && ($('.header-logo').html().indexOf('pegase') == -1)) {a1 += 'hasAddon=&canTransactionPass=1&canVendreEquipe=1&';}
		else {a1 += 'hasAddon=1&canTransactionPass=1&canVendreEquipe=1&';}
		if ((type == 'enchere') || (type == 'direct')) {
			if (type == 'enchere') {
				valuteType = 'soft';
				prix = set.sellrewAuctionEquus;
				if (($('.header-logo').html().indexOf('vip') == -1) && ($('.header-logo').html().indexOf('pegase') == -1)) {} else {a1 += 'seller=user&';}
				a1 += 'currencyType='+ valuteType + '&amountAuction' + (valuteType.charAt(0).toUpperCase() + valuteType.slice(1)) + '=' + prix + '&reservationType=prive&reservation=';
			}
			else {
				if (set.sellrewDirectPasses == '') {valuteType = 'soft'; prix = set.sellrewDirectEquus;} else {valuteType = 'hard'; prix = set.sellrewDirectPasses;}
				a1 += 'seller=user&';
				a1 += 'currencyType='+ valuteType + '&amount' + (type.charAt(0).toUpperCase() + type.slice(1)) + (valuteType.charAt(0).toUpperCase() + valuteType.slice(1)) + '=' + prix + '&reservationType=prive&reservation=';
			}
		}
		else if ((type == 'prive') && (set.sellrewTeam !== '1')) {
			if (set.sellrewReservePasses == '') {valuteType = 'soft'; prix = set.sellrewReserveEquus;} else {valuteType = 'hard'; prix = set.sellrewReservePasses;}
			a1 += 'reservationType=prive&reservation=' + set.sellrewBreeder + '&currencyType=' + valuteType + '&amountPrivate' + (valuteType.charAt(0).toUpperCase() + valuteType.slice(1)) + '=' + prix;
		}
		else if ((type == 'prive') && (set.sellrewTeam == '1')) {
			if (set.sellrewReservePasses == '') {valuteType = 'soft'; prix = set.sellrewReserveEquus;} else {valuteType = 'hard'; prix = set.sellrewReservePasses;}
			a1 += 'reservation=&reservationType=equipe&currencyType=' + valuteType + '&amountPrivate' + (valuteType.charAt(0).toUpperCase() + valuteType.slice(1)) + '=' + prix;
		}
		sellData = a1;
		var checkSellData = true;
		switch(type) {
			case 'enchere': if (set.sellrewAuctionEquus == '') {checkSellData = false;} break;
			case 'direct': if ((set.sellrewDirectEquus == '') && (set.sellrewDirectPasses == '')) {checkSellData = false;} break;
			case 'prive': if ((set.sellrewReserveEquus == '') && (set.sellrewReservePasses == '')) {checkSellData = false;} break;
		}
		if (checkSellData) {
			post = $.ajax({
				type: "POST",
				url: window.location.origin + "/marche/vente/doVendreCheval",
				data: sellData
			})
			.then(function(result) {
				if ((m == '1.3') || (m == '1.4')) {buyHorse(m);}
				else if (m == '2.2') {
					listCounter++;
					if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
						formSellData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
					}
					else {
						alert('Все отмеченные лошади успешно проданы!');
						$('#sellrewPower').click();
					}
				}
				else if (m == '2.3') {
					listCounter++;
					if (localStorage.getItem('listToSaleRewrite').split(',')[listCounter] !== undefined) {
						formRewriteData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), m);
					}
					else {
						alert('Все отмеченные лошади успешно переименованы и проданы!');
						$('#sellrewPower').click();
					}
				}
			});
		}
		else {
			alert("Внимание! Вы не установили цену для продажи лошади!");
			$('#sellrewPower').click();
		}
	});
}

function main() {
	var startWork;
	refreshStatus(); refreshAm();
	if (mode == 1) {
		switch(subMode) {
			case 1: getSales('1.1'); break;
			case 2: getTeamAffixes('1.2'); break;
			case 3: 
				startWork = confirm('Включён режим продажи лошадей. Нажмите ОК, чтобы продолжить, или Отмена, чтобы остановить скрипт.');
				if (startWork) {getSales('1.3');}
				else {$('#sellrewPower').click();}
			break;
			case 4: 
				startWork = confirm('Включён режим продажи лошадей. Нажмите ОК, чтобы продолжить, или Отмена, чтобы остановить скрипт.');
				if (startWork) {getTeamAffixes('1.4'); }
				else {$('#sellrewPower').click();}
			break;
		}
	}
	else if (mode == 2) {
		switch(subMode) {
			case 1: getTeamAffixes('2.1'); break;
			case 2: 
				startWork = confirm('Включён режим продажи лошадей. Нажмите ОК, чтобы продолжить, или Отмена, чтобы остановить скрипт.');
				if (startWork) {formSellData(localStorage.getItem('listToSaleRewrite').split(',')[listCounter].toString(), '2.2');}
				else {$('#sellrewPower').click();}
			break;
			case 3:
				startWork = confirm('Включён режим продажи лошадей. Нажмите ОК, чтобы продолжить, или Отмена, чтобы остановить скрипт.');
				if (startWork) {getTeamAffixes('2.3');}
				else {$('#sellrewPower').click();}
			break;
		}
	}
	else {
		alert('Вы не настроили режимы работы!');
	}
}

$(document).ready(function() {
	try {
		if (sellrewStartup == 1) {
			main();
		}
	}
	catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки:\n' + e);}
});

function refreshStatus() {
		//Отображение режима
		$('#sellrewPanelSettings').css('height', '455px');
		if (localStorage.getItem('sellrewBuy') == '1') {
			$('#sellrewPanelSettings').css('height', '455px');
			switch(true) {
				case ((localStorage.getItem('sellrewRewrite') == '1') && (localStorage.getItem('sellrewSell') == '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Выкуп -> переименовка -> продажа купленных');
					$('#sellrewPanelSettings').css('height', '470px'); subMode = 4;
				break;
				case ((localStorage.getItem('sellrewRewrite') == '1') && (localStorage.getItem('sellrewSell') !== '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Выкуп -> переименовка купленных'); subMode = 2;
				break;
				case ((localStorage.getItem('sellrewRewrite') !== '1') && (localStorage.getItem('sellrewSell') == '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Выкуп -> продажа купленных'); subMode = 3;
				break;
				default: $('#sellrewModeStatus p:eq(0)').text('Текущий режим: Только выкуп'); subMode = 1;
			}
			$('#sellrewModeStatus p:eq(1)').text('Место запуска: Офис или страница ЗП');
			mode = 1;
		}
		else if ((localStorage.getItem('sellrewBuy') !== '1') && ((localStorage.getItem('sellrewRewrite') == '1') || (localStorage.getItem('sellrewSell') == '1'))) {
			$('#sellrewPanelSettings').css('height', '455px');
			switch(true) {
				case ((localStorage.getItem('sellrewRewrite') == '1') && (localStorage.getItem('sellrewSell') == '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Переименовка -> продажа'); subMode = 3;
				break;
				case ((localStorage.getItem('sellrewRewrite') == '1') && (localStorage.getItem('sellrewSell') !== '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Только переименовка'); subMode = 1;
				break;
				case ((localStorage.getItem('sellrewRewrite') !== '1') && (localStorage.getItem('sellrewSell') == '1')):
					$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Только продажа'); subMode = 2;
				break;
			}
			$('#sellrewModeStatus p:eq(1)').text('Место запуска: Завод с лошадьми');
			mode = 2;
		}
		else {
			$('#sellrewModeStatus p:eq(0)').text('Текущий режим: Не установлен');
			$('#sellrewModeStatus p:eq(1)').text('Место запуска: Не определено');
			mode = 0;
		}
	}
function refreshAm() { //Отображение кол-ва лошадей в списке на продажу/переименовку
	if (mode == 2) {
		$('#sellrewPanelSettings').css('height', '490px');
		$('#sellrewModeStatus p:eq(2)').css('display', '');
		$('#clearListToSaleRewrite').css('display', '');
		if (localStorage.getItem('listToSaleRewrite') !== null) {
			$('#sellrewModeStatus p:eq(2)').text('Лошадей в списке: ' + localStorage.getItem('listToSaleRewrite').split(',').length);
		}
		else {
			$('#sellrewModeStatus p:eq(2)').text('Лошадей в списке: 0');
		}
	}
	else {
		$('#sellrewModeStatus p:eq(2)').css('display', 'none');
		$('#clearListToSaleRewrite').css('display', 'none');
		refreshStatus();
	}
}

try {
	/*Главное окошко*/$('html[dir*="r"]').append('<div class="leftSidedPanel" id="sellrewPanel" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:0px; width:110px; height:103px; display:block; z-index:1000; border-radius:0px 10px 10px 0px; font-family:sans-serif"></div>');
	/*Окно настроек*/$('html[dir*="r"]').append('<div class="leftSidedPanel toggleable" id="sellrewPanelSettings" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:'+ ($('#sellrewPanel').width() + 10) +'px; width:430px; height:455px; display:none; z-index:1000; border-radius:10px; font-family:sans-serif"></div>');
	//Оформление главного окошка
	$('#sellrewPanel').append('<div class="tip" data-tippy-content="Посетить нашу группу" style="font-size:14px; margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px; font-weight:bold"><a target="_blank" href="https://vk.com/botqually" style="color:#ffffff">● Bot Qually ●</a></div>');
	$('#sellrewPanel').append('<div style="font-size:9px; margin-top:3px; margin-left:auto; margin-right:auto; text-align:center; font-weight:bold; color:#ffffff">version: seller-rewriter</div>');
	$('#sellrewPanel').append('<div id="sellrewButtons" style="margin-top:10px; margin-left:auto; margin-right:auto; text-align:center"></div>');
	$('#sellrewPanel').append('<div id="sellrewButtons1" style="position:absolute; top:90px; left:20px; display:none;"></div>');
	if ($('html[dir*="r"]').attr('dir') == "ltr") {
		$('#sellrewButtons').append('<span id="sellrewPower" style="cursor:pointer;"><img data-tippy-content="Вкл/выкл" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/power-512.png" style="width:30px;"></span>');
		$('#sellrewButtons').append('<span id="sellrewSettings" style="cursor:pointer; margin-left:10px; filter:hue-rotate(100deg);"><img data-tippy-content="Настройки" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/gear-256.png" style="width:30px;"></span>');
		$('#sellrewButtons1').append('<span id="sellrewSelectAll" style="cursor:pointer; filter:hue-rotate(100deg)"><img data-tippy-content="Выделить всех" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/check-128.png" style="width:30px;"></span>');
		$('#sellrewButtons1').append('<span id="sellrewAddList" style="cursor:pointer; margin-left:10px; filter:hue-rotate(247deg) brightness(1.7) saturate(60%);"><img data-tippy-content="Добавить в список" class="hoverImage tip" src="https://cdn4.iconfinder.com/data/icons/keynote-and-powerpoint-icons/256/Plus-128.png" style="width:30px;"></span>');
	}
	else {
		$('#sellrewButtons').append('<span id="sellrewPower" style="margin-left:10px; cursor:pointer;"><img data-tippy-content="Вкл/выкл" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/power-512.png" style="width:30px;"></span>');
		$('#sellrewButtons').append('<span id="sellrewSettings" style="cursor:pointer; filter:hue-rotate(100deg);"><img data-tippy-content="Настройки" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/gear-256.png" style="width:30px;"></span>');
		$('#sellrewButtons1').append('<span id="sellrewSelectAll" style="margin-left:10px; cursor:pointer; filter:hue-rotate(100deg)"><img data-tippy-content="Выделить всех" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/check-128.png" style="width:30px;"></span>');
		$('#sellrewButtons1').append('<span id="sellrewAddList" style="cursor:pointer; filter:hue-rotate(247deg) brightness(1.7) saturate(60%);"><img data-tippy-content="Добавить в список" class="hoverImage tip" src="https://cdn4.iconfinder.com/data/icons/keynote-and-powerpoint-icons/256/Plus-128.png" style="width:30px;"></span>');
	}
	$('#sellrewPanel').append('<div id="toggleBottom" style="cursor:pointer; border-radius:0px 0px 10px 0px; background-color:rgba(255, 255, 255, 0.1); margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; color:#fff; font-size:9px; width:110px; height:15px;"></div>');
	$('#toggleBottom').append('<p style="cursor:pointer; position:relative; top:3px">▼</p>');
	//Оформление окна настроек
	$('#sellrewPanelSettings').append('<div style="font-size:14px; margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px; font-weight:bold; color:#fff">Настройки</div>');
	$('#sellrewPanelSettings').append('<div class="hoverImage" id="closeSettingsSellrew" style="position:absolute; top:5px; left:410px; cursor:pointer"><img width="15" src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Close-128.png"></div>');
	/*---------------------------------------------------------------------------------*/
	//Окошко статуса
	$('#sellrewPanelSettings').append('<div id="sellrewModeStatus" style="width:395px; margin:10px 5px 0 10px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff; text-align: center"></div>');
	$('#sellrewModeStatus').append('<p>Текущий режим: </p>');
	$('#sellrewModeStatus').append('<p>Место запуска: </p>');
	$('#sellrewModeStatus').append('<p style="display:none">Лошадей в списке: </p><a style="font-size:14px; font-weight:bold; color:#fff" id="clearListToSaleRewrite">Очистить список</a>');
	//Колонка 1: Выкуп и переименовка
	$('#sellrewPanelSettings').append('<div id="columnOneSr" style="float:left;"></div>');
	//Выкуп
	$('#columnOneSr').append('<div id="buyReserveOptions" style="width:185px; margin:10px 5px 0 10px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#buyReserveOptions').append('<div style="margin:5px 0 0 5px" id="buyReserveOptions1"></div>');
	$('#buyReserveOptions1').append('<span class="tip" data-tippy-content="Выкупать лошадей из зарезервированных продаж"><input id="sellrewBuy" type="checkbox" style="position:relative; top:1px"></span>');
	$('#buyReserveOptions1').append('<span style="color:#fff; font-weight:bold; margin-left:5px; cursor:default;">Выкуп ЗП</span>');
	$('#buyReserveOptions').append('<div style="margin:5px 0 0 5px" id="buyReserveOptions2"></div>');
	$('#buyReserveOptions2').append('<span id="equusLabel" class="radio-1" style="color:#fff; cursor:default;">За экю</span>');
	$('#buyReserveOptions2').append('<span><input id="sellrewBuyEquus" class="radio-1" type="radio" style="position:relative; margin:0 5px 0 5px; top:1px"></span>');
	$('#buyReserveOptions2').append('<span id="passesLabel" class="radio-1" style="color:#fff; cursor:default;">За пропуски</span>');
	$('#buyReserveOptions2').append('<span><input id="sellrewBuyPasses" class="radio-1" type="radio" style="margin-left:5px; position:relative; top:1px"></span>');
	$('#buyReserveOptions').append('<div style="margin:5px 0 0 5px" id="buyReserveOptions3"></div>');
	$('#buyReserveOptions3').append('<span style="color:#fff; cursor:default;">Макс. цена:</span>');
	$('#buyReserveOptions3').append('<span style="margin-left:5px;"><input id="sellrewBuyPrice" style="max-width: 65px;" type="number"></span>');
	$('#buyReserveOptions3').append('<span style="margin-left:5px;"><img id="pictureValute" src="/media/equideo/image/fonctionnels/20/equus.png"></span>');
	//Переименовка
	$('#columnOneSr').append('<div id="rewriteOptions" style="width:185px; margin:10px 5px 0 10px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#rewriteOptions').append('<div style="margin:5px 0 0 5px" id="rewriteOptions1"></div>');
	$('#rewriteOptions1').append('<span class="tip" data-tippy-content="Переименовывать лошадей"><input id="sellrewRewrite" type="checkbox" style="position:relative; top:1px"></span>');
	$('#rewriteOptions1').append('<span style="color:#fff; font-weight:bold; margin-left:5px; cursor:default;">Переименовка</span>');
	$('#rewriteOptions').append('<div style="margin:5px 0 0 5px" id="rewriteOptions2"></div>');
	$('#rewriteOptions2').append('<span style="color:#fff; cursor:default;">Завод:</span>');
	$('#rewriteOptions2').append('<span style="margin-left:5px;"><input id="sellrewFarm" style="width:103px; margin-left:22px;" type="text"></span>');
	$('#rewriteOptions2').append('<span style="color:#fff; cursor:default;">Аффикс:</span>');
	$('#rewriteOptions2').append('<span style="margin-left:5px;"><input id="sellrewAffixe" style="width:103px; margin:5px 0 0 7px;" type="text"></span>');
	$('#rewriteOptions2').append('<span style="color:#fff; cursor:default;">Имя муж.:</span>');
	$('#rewriteOptions2').append('<span style="margin-left:5px;"><input id="sellrewMale" style="width:103px; margin-top:5px;" type="text"></span>');
	$('#rewriteOptions2').append('<span style="color:#fff; cursor:default;">Имя жен.:</span>');
	$('#rewriteOptions2').append('<span style="margin-left:5px;"><input id="sellrewFemale" style="width:103px; margin:5px 0 5px 1px;" type="text"></span>');
	$('#rewriteOptions2').append('<span style="color:#fff; cursor:default;">Случайные имена</span>');
	$('#rewriteOptions2').append('<span class="tip" data-tippy-content="Называть жеребят случайными именами из списка"><input id="sellrewRandom" type="checkbox" style="position:relative; margin:0 5px 0 5px; top:1px"></span>');
	$('#rewriteOptions').append('<div style="margin:5px 0 0 5px" id="rewriteOptions3"></div>');
	$('#rewriteOptions3').append('<span style="color:#fff; cursor:default;">Добавить к имени:</span>');
	$('#rewriteOptions3').append('<select id="sellrewAddToName" style="margin-top:3px; width:175px; background-color:#fff"><option value="none">Не добавлять</option><option value="0">ГП ххххх.хх</option><option value="1">ГП хх.хх</option><option value="2">Навыки</option><option value="3">Редкая масть (1-5%)</option><option value="4">ГП ххххх.хх + Редкая масть (1-5%)</option><option value="5">ГП хх.хх + Редкая масть (1-5%)</option><option value="6">Навыки + Редкая масть (1-5%)</option></select>');
	//Продажа
	$('#sellrewPanelSettings').append('<div id="sellOptions" style="float:left;width:185px; height:264px; margin:10px 5px 0 5px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#sellOptions').append('<div style="margin:5px 0 0 5px" id="sellOptions1"></div>');
	$('#sellOptions1').append('<span class="tip" data-tippy-content="Продавать лошадей"><input id="sellrewSell" type="checkbox" style="position:relative; top:1px"></span>');
	$('#sellOptions1').append('<span style="color:#fff; font-weight:bold; margin-left:5px; cursor:default;">Продажа</span>');
	$('#sellOptions').append('<div style="margin:5px 0 0 15px" id="sellOptions2"></div>');
	$('#sellOptions2').append('<span><input id="sellrewAuction" class="radio-2" type="radio" style="position:relative; margin:0 5px 5px 0; top:1px"></span>');
	$('#sellOptions2').append('<span id="auctionLabel" class="radio-2" style="color:#fff; cursor:default;">Аукцион</span>');
	$('#sellOptions2').append('<br><span style="margin-left:5px;"><input id="sellrewAuctionEquus" min="500" max="1000000" style="min-width:80px; margin-left:13px;" type="number"></span>');
	$('#sellOptions2').append('<span style="margin-left:5px;"><img src="/media/equideo/image/fonctionnels/20/equus.png"></span>');
	$('#sellOptions').append('<div style="margin:5px 0 0 15px" id="sellOptions3"></div>');
	$('#sellOptions3').append('<span><input id="sellrewDirect" class="radio-2" type="radio" style="position:relative; margin:0 5px 5px 0; top:1px"></span>');
	$('#sellOptions3').append('<span id="directLabel" class="radio-2" style="color:#fff; cursor:default;">Прямые продажи</span>');
	$('#sellOptions3').append('<br><span style="margin-left:5px;"><input id="sellrewDirectEquus" min="500" max="1000000" style="min-width:80px; margin-left:13px;" type="number"></span>');
	$('#sellOptions3').append('<span style="margin-left:5px;"><img src="/media/equideo/image/fonctionnels/20/equus.png"></span>');
	$('#sellOptions3').append('<br><span style="margin-left:5px;"><input id="sellrewDirectPasses" min="10" max="2500" style="min-width:80px; margin:5px 0 0 13px;" type="number"></span>');
	$('#sellOptions3').append('<span style="margin-left:5px;"><img src="/media/equideo/image/fonctionnels/20/pass.png"></span>');
	$('#sellOptions').append('<div style="margin:5px 0 0 15px" id="sellOptions4"></div>');
	$('#sellOptions4').append('<span><input id="sellrewReserved" class="radio-2" type="radio" style="position:relative; margin:0 5px 5px 0; top:1px"></span>');
	$('#sellOptions4').append('<span id="reserveLabel" class="radio-2" style="color:#fff; cursor:default;">Резерв. продажи</span>');
	$('#sellOptions4').append('<br><span style="margin-left:5px;"><input id="sellrewReserveEquus" min="500" max="1000000" style="min-width:80px; margin-left:13px;" type="number"></span>');
	$('#sellOptions4').append('<span style="margin-left:5px;"><img src="/media/equideo/image/fonctionnels/20/equus.png"></span>');
	$('#sellOptions4').append('<br><span style="margin-left:5px;"><input id="sellrewReservePasses" min="10" max="2500" style="min-width:80px; margin:5px 0 0 13px;" type="number"></span>');
	$('#sellOptions4').append('<span style="margin-left:5px;"><img src="/media/equideo/image/fonctionnels/20/pass.png"></span><br>');
	$('#sellOptions4').append('<span style="margin-left:17px;color:#fff; cursor:default;">Для:</span>');
	$('#sellOptions4').append('<span style="margin-left:5px;"><input id="sellrewBreeder" placeholder="Имя игрока" style="width:90px; margin:5px 0 5px 1px;" type="text"></span><br>');
	$('#sellOptions4').append('<span style="margin-left:17px;color:#fff; cursor:default;">Для команды</span>');
	$('#sellOptions4').append('<span><input id="sellrewTeam" type="checkbox" style="margin-left:5px; position:relative; top:1px"></span>');

	$('#sellrewPanelSettings').append('<div style="clear:both;"></div>');
	//Выделять
	$('#sellrewPanelSettings').append('<div id="sellrewAmountOptions" style="width:400px; margin:10px 5px 0 10px; padding:5px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#sellrewAmountOptions').append('<div id="amountPanel" style="margin-left:60px;"></div>');
	$('#amountPanel').append('<p style="float:left;">Выделять</p>');
	$('#amountPanel').append('<span style="float:left; margin:0 5px 0 5px;"><input id="sellrewSelectAmount" min="1" max="200" style="max-width:40px; margin-left:5px;" type="number"></span>');
	$('#amountPanel').append('<p style="float:left;">шт. с лошади №</p>');
	$('#amountPanel').append('<span style="float:left; margin-left:5px;"><input id="sellrewHorseNumber" min="1" max="200" style="max-width:40px; margin-left:5px;" type="number"></span>');
	$('#sellrewAmountOptions').append('<div style="clear:both;"></div>');
	//Сбросить настройки
	$('#sellrewPanelSettings').append('<div style="margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px;"><a id="sellrewResetSettings" style="font-size:14px; font-weight:bold; color:#fff">Сбросить настройки</a></div>');
	/*------------------------------------------------------------------------------------*/
	var makeInputs = setInterval(function() {
		if (location.href.indexOf('elevage/chevaux/?elevage=') !== -1) {
			if (($('.chooseHorse').length == 0) || ($('.sellNumber').length == 0)) {
				var cells = $('li[class^="nowrap"]');
				for (var i = 0; i < cells.length; i++) {
					$('li[class^="nowrap"]').eq(i).parent().append('<p class="sellNumber" style="float:left; margin:5px 0 0 0">№' + (i+1) + '</p>');
					if (($('.header-logo').html().indexOf('vip') == -1) && ($('.header-logo').html().indexOf('pegase') == -1)) {
						var chooseId = $('li[class^="nowrap"] .horsename:eq('+i+')').attr('href').replace(/\D+/g,"");
						$('li[class^="nowrap"]').eq(i).parent().append('<span class="chooseHorse"><input id="'+chooseId+'" class="checkbox" name="chooseHorse[]" type="checkbox"></span>');
					}
				}
			}
		}
	}, 500);

	//radio
	$('.radio-1').click(function() {
		if (($(this).attr('id') == "sellrewBuyEquus") || ($(this).attr('id') == "equusLabel")) {
			$('#sellrewBuyEquus').prop('checked', true); localStorage.setItem('sellrewBuyEquus', '1');
			$('#sellrewBuyPasses').prop('checked', false); localStorage.setItem('sellrewBuyPasses', '2');
			$('#sellrewBuyPrice').val(''); localStorage.setItem('sellrewBuyPrice', '');
			$('#sellrewBuyPrice').attr('min', '500').change();
			$('#sellrewBuyPrice').attr('max', '1500000').change();
			$('#pictureValute').attr('src', '/media/equideo/image/fonctionnels/20/equus.png');
		}
		else {
			$('#sellrewBuyPasses').prop('checked', true); localStorage.setItem('sellrewBuyPasses', '1');
			$('#sellrewBuyEquus').prop('checked', false); localStorage.setItem('sellrewBuyEquus', '2');
			$('#sellrewBuyPrice').val(''); localStorage.setItem('sellrewBuyPrice', '');
			$('#sellrewBuyPrice').attr('min', '10').change();
			$('#sellrewBuyPrice').attr('max', '2500').change();
			$('#pictureValute').attr('src', '/media/equideo/image/fonctionnels/20/pass.png');
		}
	});

	$('.radio-2').click(function() {
		if (($(this).attr('id') == "sellrewAuction") || ($(this).attr('id') == "auctionLabel")) {
			$('#sellrewAuction').prop('checked', true); localStorage.setItem('sellrewAuction', '1');
			$('#sellrewDirect').prop('checked', false); localStorage.setItem('sellrewDirect', '2');
			$('#sellrewReserved').prop('checked', false); localStorage.setItem('sellrewReserved', '2');
		}
		else if (($(this).attr('id') == "sellrewDirect") || ($(this).attr('id') == "directLabel")) {
			$('#sellrewDirect').prop('checked', true); localStorage.setItem('sellrewDirect', '1');
			$('#sellrewAuction').prop('checked', false); localStorage.setItem('sellrewAuction', '2');
			$('#sellrewReserved').prop('checked', false); localStorage.setItem('sellrewReserved', '2');
		}
		else {
			$('#sellrewReserved').prop('checked', true); localStorage.setItem('sellrewReserved', '1');
			$('#sellrewAuction').prop('checked', false); localStorage.setItem('sellrewAuction', '2');
			$('#sellrewDirect').prop('checked', false); localStorage.setItem('sellrewDirect', '2');
		}
	});

	//Подсветка кнопок при наведении курсора
	var bLevel = 1;
	$('.hoverImage').on('mouseover', function() {
		bLevel += .1;
		$(this).css({"-webkit-filter" : "brightness("+bLevel+")"})
	});

	$('.hoverImage').on('mouseout', function() {
		bLevel -= .1;
		$(this).css({"-webkit-filter" : "brightness("+bLevel+")"})
	});

	$('div#toggleBottom').on('mouseover', function() {
		$(this).css('background-color', 'rgba(255, 255, 255, 0.2)');
	});

	$('div#toggleBottom').on('mouseout', function() {
		$(this).css('background-color', 'rgba(255, 255, 255, 0.1)');
	});

	j = 2;
	var toggled = false;
	$('#toggleBottom').click(function() {
		$('#sellrewButtons1').slideToggle({duration:250, easing:'swing'});
		if (($('.leftSidedPanel').length == 2) || ($('.leftSidedPanel').last().prev().attr('id') == "sellrewPanel")) {
			if (toggled) {
				var animationCounter = 0;
				var timing = 1;
				$('#toggleBottom p').text('▼');
				var tim1 = setTimeout(function f1() {
					if (animationCounter < 41) {
						$('#sellrewPanel').height($('#sellrewPanel').height()-1);
						$('#toggleBottom').css('margin-top', Number($('#toggleBottom').css('margin-top').replace('px', ''))-1);
						$('#sellrewButtons1').css('opacity', Number($('#sellrewButtons1').css('opacity')) - 0.025);
						animationCounter++;
						if (animationCounter < 14) {timing-=0.7;} else if ((animationCounter >= 14) && (animationCounter < 28)) {timing+=0.7;} else {timing-=0.7;}
						setTimeout(f1, timing);
					}
					else {clearTimeout(tim1);}
				}, timing);
				toggled = false;
			}
			else {
				var animationCounter = 0;
				var timing = 1;
				$('#toggleBottom p').text('▲');
				var tim1 = setTimeout(function f1() {
					if (animationCounter < 41) {
						$('#sellrewPanel').height($('#sellrewPanel').height()+1);
						$('#toggleBottom').css('margin-top', Number($('#toggleBottom').css('margin-top').replace('px', ''))+1);
						$('#sellrewButtons1').css('opacity', Number($('#sellrewButtons1').css('opacity')) + 0.025);
						animationCounter++;
						if (animationCounter < 14) {timing-=0.7;} else if ((animationCounter >= 14) && (animationCounter < 28)) {timing+=0.7;} else {timing-=0.7;}
						setTimeout(f1, timing);
					}
					else {clearTimeout(tim1);}
				}, timing);
				toggled = true;
			}
		}
		else {
			if ($('.leftSidedPanel').eq(0).attr('id') == "sellrewPanel") {
				moveOtherWindows(j);
			}
		}
		localStorage.setItem('sellrewToggled', toggled);
	});

	function moveOtherWindows(j) {
		if (toggled) {
			var animationCounter = 0;
			var timing = 1;
			$('#toggleBottom p').text('▼');
			var tim1 = setTimeout(function f1() {
				if (animationCounter < 41) {
					$('#sellrewPanel').height($('#sellrewPanel').height()-1);
					$('.leftSidedPanel').eq(j).css('top', Number($('.leftSidedPanel').eq(j).css('top').replace('px', ''))-1);
					$('#toggleBottom').css('margin-top', Number($('#toggleBottom').css('margin-top').replace('px', ''))-1);
					$('#sellrewButtons1').css('opacity', Number($('#sellrewButtons1').css('opacity')) - 0.025);
					animationCounter++;
					if (animationCounter < 14) {timing-=0.7;} else if ((animationCounter >= 14) && (animationCounter < 28)) {timing+=0.7;} else {timing-=0.7;}
					setTimeout(f1, timing);
				}
				else {
					j+=2;
					if (j < $('.leftSidedPanel').length) {moveOtherWindows(j);}
					clearTimeout(tim1);
				}
			}, timing);
			toggled = false;
		}
		else {
			var animationCounter = 0;
			var timing = 1;
			$('#toggleBottom p').text('▲');
			var tim1 = setTimeout(function f1() {
				if (animationCounter < 41) {
					$('#sellrewPanel').height($('#sellrewPanel').height()+1);
					$('.leftSidedPanel').eq(j).css('top', Number($('.leftSidedPanel').eq(j).css('top').replace('px', ''))+1);
					$('#toggleBottom').css('margin-top', Number($('#toggleBottom').css('margin-top').replace('px', ''))+1);
					$('#sellrewButtons1').css('opacity', Number($('#sellrewButtons1').css('opacity')) + 0.025);
					animationCounter++;
					if (animationCounter < 14) {timing-=0.7;} else if ((animationCounter >= 14) && (animationCounter < 28)) {timing+=0.7;} else {timing-=0.7;}
					setTimeout(f1, timing);
				}
				else {
					j+=2;
					if (j < $('.leftSidedPanel').length) {moveOtherWindows(j);}
					clearTimeout(tim1);
				}
			}, timing);
			toggled = true;
		}
	}

	if (sellrewStartup == 0) {$('#sellrewPower').css({"-webkit-filter" : "hue-rotate(280deg)"});}
	else {$('#sellrewPower').css({"-webkit-filter" : "hue-rotate(0deg)"});}

	$('#sellrewSettings').click(function() {
		$('#sellrewPanelSettings').toggle(0);
	});

	$('.hoverImage').focus(
		function(){this.blur();}
	);

	//Закрытие окна настроек нажатием на любое место документа
	$(document).click(function(evt) {
		if ((evt.target.id == "sellrewPanel") || (evt.target.id == "sellrewPanelSettings"))
			return;
		if (($(evt.target).closest('#sellrewPanel').length) || ($(evt.target).closest('#sellrewPanelSettings').length))
			return;
		$('#sellrewPanelSettings').hide(0);
	});

	function startUp() { //функция запуска работы скрита по нажатию на кнопку
		$('#sellrewPanelSettings').hide(0);
		if (sellrewStartup == 0) {
			$(this).css({"-webkit-filter" : "hue-rotate(0deg)"});
			sellrewStartup = 1;
			localStorage.setItem('sellrewWorkPlace', location.href);
		}
		else {
			$(this).css({"-webkit-filter" : "hue-rotate(280deg)"});
			sellrewStartup = 0;
			localStorage.removeItem('sellrewWorkPlace');
			localStorage.removeItem('affixesList');
			localStorage.removeItem('farmsList');
			localStorage.removeItem('listToSaleRewrite');
		}
		localStorage.setItem('sellrewStartup', sellrewStartup);
		location.reload();
	}
	//Нажатие на кнопку "Вкл/выкл"
	$('#sellrewPower').click(function() {
		if (mode == 1) {
			if ((location.href.indexOf('elevage/bureau/') !== -1) || (location.href.indexOf('/marche/vente/?type=prive&typeSave=1') !== -1) || (sellrewStartup == 1)) {
				startUp();
			}
			else {
				alert('Запуск скрипта по текущим настройкам производится со страницы офиса (вкладка "Коневодство" -> "Офис") или зарезервированных продаж (вкладка "Торговля" -> "Продажа лошадей" -> "Зарезервированные продажи").');
			}
		}
		else if (mode == 2) {
			if ((location.href.indexOf('/elevage/chevaux/?elevage') !== -1) || (sellrewStartup == 1)) {
				if ((localStorage.getItem('listToSaleRewrite') !== null) && (localStorage.getItem('listToSaleRewrite').length > 1)) {startUp();}
				else {$('#sellrewAddList').click(); startUp();}
			}
			else {
				alert('Запуск скрипта по текущим настройкам производится со страницы заводов (вкладка "Коневодство" -> "Лошади").');
			}
		}
		else {
			alert('Вы не настроили режим работы!');
		}
	});

	//Нажатие на "Выделить всех"
	$('#sellrewSelectAll').click(function() {
		if ($('.chooseHorse input:checked').length > 0) {
			for (i = 0; i < $('.chooseHorse').length; i++) {$('.chooseHorse input').eq(i).prop('checked', false);}
		}
		else {
			if (($('#sellrewSelectAmount').val() == '') || ($('#sellrewHorseNumber').val() == '')) {
				for (i = 0; i < $('.chooseHorse').length; i++) {$('.chooseHorse input').eq(i).prop('checked', true);}
			}
			else {
				for (i = Number($('#sellrewHorseNumber').val()) - 1; i < (Number($('#sellrewHorseNumber').val()) + Number($('#sellrewSelectAmount').val()) - 1); i++) {$('.chooseHorse input').eq(i).prop('checked', true);}
			}
		}
	});

	//Нажатие на "Добавить в список"
	$('#sellrewAddList').click(function() {
		if ($('.chooseHorse input:checked').length > 0) {
			var arr1 = $('.chooseHorse input:checked').toArray();
			for (i = 0; i < arr1.length; i++) {
				if ($(arr1[i]).attr('value') !== 'on') {
					arr1[i] = $(arr1[i]).attr('value');
				}
				else {
					arr1[i] = $(arr1[i]).attr('id');
				}
			}
			listToSaleRewrite = [...new Set(listToSaleRewrite.concat(arr1))];
			localStorage.setItem('listToSaleRewrite', listToSaleRewrite);
			refreshAm();
		}
		else {
			alert('Вы не выбрали ни одной лошади!');
		}
	});

	$('#clearListToSaleRewrite').click(function() {
		localStorage.removeItem('listToSaleRewrite');
		refreshAm();
		location.reload();
	});

	$('#sellrewResetSettings').click(function() {
		for (i = 0; i < arr.length; i++) {
			localStorage.removeItem(arr[i]);
			location.reload();
		}
	});

	$('#closeSettingsSellrew').click(function() {
		$('#sellrewPanelSettings').hide(0);
	});

	//Нажатие на Сбросить настройки
	$('#sellrewResetSettings').click(function() {
		for (i = 0; i < arr.length; i++) {
			localStorage.removeItem(arr[i]);
			localStorage.removeItem('race-ane');
			localStorage.removeItem('sellrewWorkPlace');
			localStorage.removeItem('affixesList');
			localStorage.removeItem('farmsList');
			location.reload();
		}
	});
	$('#sellrewResetSettings, #clearListToSaleRewrite').on('mouseover', function() {
		$(this).css('color', 'red').change();
	});
	$('#sellrewResetSettings, #clearListToSaleRewrite').on('mouseout', function() {
		$(this).css('color', '#fff').change();
	});

	//Тултип
	tippy('.tip', {
		placement: 'bottom',
		duration: 0,
		animation: 'fade'
	});

	//Стили полей ввода и селектов
	$('#sellrewPanelSettings input').css({
		'background-color': '#555555',
		'border': '1px solid #a9a9a9',
		'color': '#ffffff'
	});
	$('#sellrewPanelSettings select').css({
		'background-color': '#555555',
		'color': '#ffffff'
	});
	//Запрет выделения текста
	$('#sellrewPanelSettings').find('p, span').css({
		'-webkit-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'user-select': 'none'
	});

	//Загрузка настроек
	for (i = 0; i < inputs.length; i++) {
		if ((localStorage.getItem(inputs[i]) == null) || (localStorage.getItem(inputs[i]) == undefined)) {
			localStorage.setItem(inputs[i], "");
		}
		$('#'+inputs[i]).val(localStorage.getItem(inputs[i]));
	}

	for (i = 0; i < selects.length; i++) {
		if ((localStorage.getItem(selects[i]) == null) || (localStorage.getItem(selects[i]) == undefined)) {
			localStorage.setItem(selects[i], $('#'+selects[i]+' option:eq(0)').val());
		}
		$('#'+selects[i]).val(localStorage.getItem(selects[i])).change();
	}

	for (i = 0; i < checkboxes.length; i++) {
		if ((localStorage.getItem(checkboxes[i]) == null) || (localStorage.getItem(checkboxes[i]) == undefined)) {
			localStorage.setItem(checkboxes[i], '2');
		}
		if (localStorage.getItem(checkboxes[i]) == '1') {$('#'+checkboxes[i]).prop('checked', true);}
		else {$('#'+checkboxes[i]).prop('checked', false);}
	}

	//Установка настроек
	$('#sellrewPanelSettings input').on('keyup', function() {
		if ($(this).attr('type') !== 'checkbox') {
			localStorage.setItem($(this).attr('id'), $(this).val());
		}
	});

	$('#sellrewPanelSettings select').click(function() {
		localStorage.setItem($(this).attr('id'), $(this).val());
	});

	$('#sellrewPanelSettings input').click(function() {
		if ($(this).attr('type') == 'checkbox') {
			if ($(this).prop('checked') == true) {
				localStorage.setItem($(this).attr('id'), 1);
			}
			else {
				localStorage.setItem($(this).attr('id'), 2);
			}
			refreshStatus();
			refreshAm();
		}
	});

	$('.damier-cell').live('click', function(e) {
		if (($('.header-logo').html().indexOf('vip') == -1) && ($('.header-logo').html().indexOf('pegase') == -1)) {
			if (e.target !== $(this).find('.checkbox')[0]) {($(this).find('.checkbox'))[0].click();
		}
	}});

	//Смещение относительно других qually-скриптов, значок валюты в скрипте
	$(document).ready(function() {
		if (($('html[dir*="r"]').has($('.leftSidedPanel'))) && ($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).attr('id') !== 'sellrewPanel')) {
			var top1 = $('.leftSidedPanel').last().css('top');
			if (top1 !== undefined) {top1 = Number(top1.replace('px', ''));}
			var height1 = Number($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).height());
			var a = top1 + height1 + 20;
			$('#sellrewPanel').css('top', a + 'px');
			$('#sellrewPanelSettings').css('top', a + 'px');
		}
		if (set.sellrewBuyPasses == 1) {
			$('#pictureValute').attr('src', '/media/equideo/image/fonctionnels/20/pass.png');
		}
		if (localStorage.getItem('listToSaleRewrite') !== null) {listToSaleRewrite = localStorage.getItem('listToSaleRewrite').split(',');}
		if (localStorage.getItem('sellrewToggled') == 'true') {setTimeout(function() {$('#toggleBottom').click();}, 200);}
		refreshStatus();
		refreshAm();
	});
}
catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки: Interface Error\n' + e);}
