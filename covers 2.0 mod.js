//Глобальные переменные
var i;
var html = document.createElement('html');
var post;
var get;
var centreNotFound = 0;
var coverNotFound = 0;
var skipMission = 0;
var coverEnergy = 25;
var maleEnergy = 0;
//Загрузка настроек
var inputs = ['coversMaleName', 'coversFemaleName', 'coversAffix', 'coversFarm', 'coversDirector', 'coversGP', 'coversBreeder'];
var selects = ['coversMaxAge', 'coversEcDuration', 'coversEcPrice', 'coversMalePrice', 'coversFemPrice', 'coversSort', 'coversSellSomething'];
var checkboxes = ['coversMission', 'coversWater', 'coversMilk', 'coversEcFourrage', 'coversEcAvoine', 'coversEcCarotte', 'coversDoMale', 'coversMaleCarrot', 'coversMaleMash', 'coversDoFem', 'coversPurebred', 'coversSelfMale', 'coversLicorneModOn', 'coversLicorneGrowOn'];
var arr = [];
arr = arr.concat(inputs).concat(selects).concat(checkboxes);
var set = {};
for (i = 0; i < arr.length; i++) {
	set[arr[i]] = localStorage.getItem(arr[i]);
}
var coversStartup = localStorage.getItem('coversStartup');
if ((coversStartup == null) || (coversStartup == undefined)) {coversStartup = 0;}

function randomInteger(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
}

function parse(result) {
	html.innerHTML = result;
}

function refresh() {
	$('#content').html($('#content', html).html()).change();
	$('#reserve').html($('#reserve', html).html()).change();
	$('#pass').html($('#pass', html).html()).change();
}

function stats(result) {
	try {
		$('#energie').text(result['chevalEnergie'].toFixed(0)).change();
		$('.gauge-container.gauge-style-3-gauge.float-left').eq(0).attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalEnergie'].toFixed(0)).change();
		$('#sante').text(result['chevalSante'].toFixed(0)).change();
		$('.gauge-container.gauge-style-3-gauge.float-left').eq(1).attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalSante'].toFixed(0)).change();
		$('#moral').text(result['chevalMoral'].toFixed(0)).change();
		$('.gauge-container.gauge-style-3-gauge.float-left').eq(2).attr('class', 'gauge-container gauge-style-3-gauge float-left width-' + result['chevalMoral'].toFixed(0)).change();
	}
	catch {}
}

function checkMoney() {
	get = $.ajax({
		type: "GET",
		url: projectUrl + "/marche/boutiqueVendre",
	})
	.then(function(result) {
		parse(result);
		var itemId = '';
		var amount = 0;
		switch(set.coversSellSomething) {
			case '0':
				if ($('tr.highlight', html).has($('img[src*="avoine"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="avoine"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 9000;
				}
			break;
			case '1':
				if ($('tr.highlight').has($('img[src*="fourrage"]', html)).length !== 0) {
					itemId = $('tr.highlight').has($('img[src*="fourrage"]')).attr('id').replace(/[^0-9]/gim, '');
					amount = 9000;
				}
			break;
			case '2':
				if ($('tr.highlight', html).has($('img[src*="pomme"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="pomme"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 3000;
				}
			break;
			case '3':
				if ($('tr.highlight', html).has($('img[src*="carotte"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="carotte"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 900;
				}
			break;
			case '4':
				if ($('tr.highlight', html).has($('img[src*="ressource-bois"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-bois"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 2000;
				}
			break;
			case '5':
				if ($('tr.highlight', html).has($('img[src*="ressource-fer"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-fer"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 2000;
				}
			break;
			case '6':
				if ($('tr.highlight', html).has($('img[src*="ressource-sable"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-sable"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 2000;
				}
			break;
			case '7':
				if ($('tr.highlight', html).has($('img[src*="ressource-cuir"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-cuir"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 2000;
				}
			break;
			case '8':
				if ($('tr.highlight', html).has($('img[src*="ressource-paille"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-paille"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 900;
				}
			break;
			case '9':
				if ($('tr.highlight', html).has($('img[src*="ressource-lin"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="ressource-lin"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 400;
				}
			break;
			case '10':
				if ($('tr.highlight', html).has($('img[src*="son-ble"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="son-ble"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 9000;
				}
			break;
			case '11':
				if ($('tr.highlight', html).has($('img[src*="crottin"]', html)).length !== 0) {
					itemId = $('tr.highlight', html).has($('img[src*="crottin"]', html)).find('button[id*="vendre"]').attr('id').replace(/[^0-9]/gim, '');
					amount = 3000;
				}
			break;
		}
		if (amount > 0) {
			post = $.ajax({
				type: "POST",
				url: projectUrl + "/marche/vente",
				data: "id=" + itemId + "&nombre=" + amount + "&mode=eleveur"
			})
			.then(function(result) {
				if (result['errors'][0] == "venteInsuffisante") {alert('В вашем инвентаре закончились предметы для продажи!');}
				else {
					get = $.ajax({
						type: "GET",
						url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
					})
					.then(function(result) {
						parse(result);
						refresh();
						main();
					});
				}
			});
		}
	});
}

function buyFood(type) {
	post = $.ajax({
		type: "POST",
		url: projectUrl + "/marche/produits",
		data: "id=alimentation&mode=eleveur&visibilite=marche-eleveur"
	})
	.then(function(result) {
		parse(result['content']);
		var itemId = $('tr[height^="40"]', html).has($('a[href*="'+ type +'"]', html)).find('button[name*="submit"]').attr('data-produit-id');
		post = $.ajax({
			type: "POST",
			url: projectUrl + "/marche/achat",
			data: "id=" + itemId + "&mode=eleveur&nombre=500&typeRedirection=&idElement="
		})
		.then(function(result) {
			$('#care-wrapper').html(result['blocks']['care-body-content']).change();
			$('#center-wrapper').html(result['blocks']['center-body-content']).change();
			$('#history-content').html(result['blocks']['history-body-content']).change();
			$('#reproduction-wrapper').html(result['blocks']['reproduction-body-content']).change();
			get = $.ajax({
				type: "GET",
				url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
			})
			.then(function(result) {
				parse(result);
				refresh();
				main();
			});
		});
	});
}

function heaven() {
	get = $.ajax({
		type: "GET",
		url: projectUrl + $('a[href*="paradis"]').attr('href')
	})
	.then(function(result) {
		history.go(-1);
	});
}

var kskErrCount = 0;
function ksk() {
	$('#loading').css('display', 'block');
	post = $.ajax({
		type: "POST",
		url : projectUrl + '/elevage/chevaux/centreSelection',
		data: {"cheval": chevalId, "elevage": "", "cheval": chevalId, "competence": "0", "tri": set.coversEcDuration.split(',')[0], "sens": "ASC", "tarif": set.coversEcPrice, "leconsPrix": "", "foret": "2", "montagne": "2", "plage": "2", "classique": "2", "western": "2", "fourrage": set.coversEcFourrage, "avoine": set.coversEcAvoine, "carotte": set.coversEcCarotte, "mash": "2", "hasSelles": "2", "hasBrides": "2", "hasTapis": "2", "hasBonnets": "2", "hasBandes": "2", "abreuvoir": "2", "douche": "2", "centre": "", "centreBox": "0", "directeur": set.coversDirector, "prestige": "", "bonus": "", "boxType": "", "boxLitiere": "", "prePrestige": "", "prodSelles": "", "prodBrides": "", "prodTapis": "", "prodBonnets": "", "prodBandes": ""}
	})
	.then(function(result) {
		html.innerHTML = JSON.stringify(result).replace(/\u005c"/g, '');
		if ($('img[src*="picto-alert"]', html).length !== 0) {
			centreNotFound++; main(); $('#loading').css('display', 'none');
		}
		else {
			if ($('td[style^="width:70px;height:40px;"]:eq(' + (Number(set.coversEcDuration.split(',')[0].replace('tarif', '')) - 1) + ') button', html).hasClass('disabled') == false) {
				var hash = $('td[style^="width:70px;height:40px;"]:eq(' + (Number(set.coversEcDuration.split(',')[0].replace('tarif', '')) - 1) + ') script:contains("hash")', html).eq(0).html();
				hash = hash.substr(hash.indexOf('hash=')+5).replace(/[^a-zA-Z0-9]/gim, '').toLowerCase();
				var kskId = $('#table-0 a.centerLocalisation', html).eq(kskErrCount).attr('href').replace(/[^0-9]/gim, '');
				post = $.ajax({
					type: "POST",
					url : projectUrl + '/elevage/chevaux/doCentreInscription',
					data: {"id": chevalId, "centre": kskId, "duree": set.coversEcDuration.split(',')[1], "elevage": "", "hash": hash},
				})
				.then(function(result) {
					if (result['redirection'] !== undefined) {
						if (result['redirection'].indexOf('message=centreOk') == -1) {
							if (kskErrCount > 3) {location.reload();}
							else {kskErrCount++; ksk(); $('#loading').css('display', 'none');}
						}
						else {
							get = $.ajax({
								type: "GET",
								url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
							})
							.then(function(result) {
								parse(result);
								refresh();
								main();
								$('#loading').css('display', 'none');
							});
						}
					}
					else {
						if (kskErrCount > 3) {location.reload(); $('#loading').css('display', 'none');}
						else {kskErrCount++; ksk(); $('#loading').css('display', 'none');}
					}
				});
			}
			else {
				centreNotFound++; main(); $('#loading').css('display', 'none');
			}	
		}
	});
}

function getBaby(id) {
	$.ajax({
		type: "GET",
		url : projectUrl + '/elevage/chevaux/mettreBas?jument=' + chevalId,
		data: {"jument": chevalId},
	})
	.then(function(result) {
		get = $.ajax({
			type: "GET",
			url : projectUrl + '/elevage/chevaux/choisirNoms?jument=' + chevalId,
			data: {"jument": chevalId},
		})
		.then(function(result) {
			parse(result);
			if ($('.module-style-31 .align-top.spacer-small-top.spacer-right img', html).attr('src').indexOf('femelle') !== -1) {
				var horseNameBaby = set.coversFemaleName;
			}
			else {var horseNameBaby = set.coversMaleName;}
			if (set.coversAffix !== '') {
				var affixeInput = $('#affixe-1 option', html);
				var affixeId;
				for (var k = 0; k < affixeInput.length; k++) {
					if ($('#affixe-1 option', html).eq(k).text().replace(/\u00A0/gim, '').replace(/ /gim, '') == set.coversAffix.replace(/ /gim, '')) {
						affixeId = +($('#affixe-1 option', html).eq(k).attr('value'));
					}
				}
			}
			else {affixeId = '';}
			if (set.coversFarm !== '') {
				var elevageInput = $('#elevage-1 option', html);
				var elevageId;
				for (var k = 0; k < elevageInput.length; k++) {
					if (($('#elevage-1 option', html).eq(k).text().replace(/\u00A0/gim, '').replace(/ /gim, '')) == set.coversFarm.replace(/ /gim, '')) {
						elevageId = +($('#elevage-1 option', html).eq(k).attr('value'));
					}
				}
			}
			else {elevageId = '';}
			post = $.ajax({
				type: "POST",
				url : projectUrl + '/elevage/chevaux/choisirNoms?jument=' + chevalId,
				data: {"valider": "ok", "poulain-1": horseNameBaby, "affixe-1": affixeId, "elevage-1": elevageId},
			})
			.then(function(result) {
				get = $.ajax({
					type: "GET",
					url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
				})
				.then(function(result) {
					parse(result);
					refresh();
					main();
				});
			});
		});
	});
}

function groom() {
	var a1 = $('#form-do-groom input').eq(0).attr('name'); var a2 = $('#form-do-groom input').eq(0).attr('value');
	var b1 = $('#form-do-groom input').eq(1).attr('id').substr(13); var b2 = $('#form-do-groom input').eq(1).attr('value');
	var c1 = $('#form-do-groom input').eq(2).attr('id').substr(13); var c2 = randomInteger(10, 80);
	var d1 = $('#form-do-groom input').eq(3).attr('id').substr(13); var d2 = randomInteger(10, 80);
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2).toLowerCase();
	post = $.ajax({
		type: "POST",
		url: projectUrl + '/elevage/chevaux/doGroom',
		data: postData,
	})
	.then(function(result) {
		maleEnergy = result['chevalEnergie'];
		$('#care-wrapper').html(result['blocks']['care-body-content']).change();
		$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
		$('#history-content').html(result['blocks']['history-body-content']).change();
		$('#night-wrapper').html(result['blocks']['night-body-content']).change();
		stats(result);
		main();
	});
}

function mission() {
	post = $.ajax({
		type: "POST",
		url: projectUrl + '/elevage/chevaux/doCentreMission',
		data: 'id=' + chevalId
	})
	.then(function(result) {
		if (result['errors'].length > 0) {
			skipMission++; main();
		}
		else {
			maleEnergy = result['chevalEnergie'];
			$('#care-wrapper').html(result['blocks']['care-body-content']).change();
			$('#center-wrapper').html(result['blocks']['center-body-content']).change();
			$('#history-content').html(result['blocks']['history-body-content']).change();
			$('#mission-wrapper').html(result['blocks']['mission-body-content']).change();
			$('#training-wrapper').html(result['blocks']['training-body-content']).change();
			stats(result);
			main();
		}	
	});
}

function maleCovers() {
	if (maleEnergy - coverEnergy >= 20) {
		post = $.ajax({
			type: "POST",
			url: projectUrl + "/elevage/chevaux/reserverJument",
			data: "id=" + chevalId + "&action=save&type=public&price=" + set.coversMalePrice + "&owner=&nom="
		})
		.then(function(result) {
			maleEnergy-= coverEnergy;
			maleCovers();
		});
	}
	else {
		if (!($('#boutonCaresser').hasClass('action-disabled'))) {care();}
		else {
			get = $.ajax({
				type: "GET",
				url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
			})
			.then(function(result) {
				parse(result);
				refresh();
				main(1);
			});
		}
	}
}

function checkLicorneCovers() {
	if ((localStorage.getItem('coversLicorne') == '1') && (($('meta[content*="licorne"]').length > 0) || ($('a[href*="licorne"]').length > 0))) {
		coverNotFound++;
	}
}

function femaleCovers() {
	$('#loading').css('display', 'block');
	var mares = document.createElement('html');
	if (localStorage.getItem('maresBreedId') == null) {
		get = $.ajax({
			type: "GET",
			url: projectUrl + "/elevage/chevaux/rechercherMale?jument=" + chevalId
		})
		.then(function(result) {
			parse(result);
			localStorage.setItem('maresBreedId', $('#race', html).html());
			femaleCovers();
		});
	}
	else {
		var breedId = "";
		if (set.coversPurebred == '1') {
			mares.innerHTML = localStorage.getItem('maresBreedId');
			for (i = 0; i < $('option', mares).length; i++) {
				if ($('option', mares).eq(i).text() == $('#characteristics-body-content .first a:eq(0)').text()) {breedId = $('option', mares).eq(i).val();}
			}
		}
		var tri; var sens;
		switch(set.coversSort) {
			case '0': tri = 'prix'; sens = 'ASC'; break;
			case '1': tri = 'cTotal'; sens = 'DESC'; break;
			case '2': tri = 'blup'; sens = 'DESC'; break;
		}
		var myName;
		if (set.coversSelfMale == '1') {myName = $('a.level-2.level-extended').text();}
		else if (set.coversBreeder !== '') {myName = set.coversBreeder;}
		else {myName = "";}
		var getData = "tri=" + tri + "&page=0&sens=" + sens + "&rechercher=1&breeder=" + myName + "&potentielTotal=" + set.coversGP + "&prix=" + set.coversFemPrice + "&blup=-100&race=" + breedId + "&purete=" + set.coversPurebred + "&cE=0&cV=0&cD=0&cG=0&cT=0&cS=0&cheval=1&poney=1&pegase=1&=1&prixC=l&jument=" + chevalId + "&type=public";
		var offer;
		get = $.ajax({
			type: "GET",
			url: projectUrl + "/elevage/chevaux/rechercherMale?" + getData
		})
		.then(function(result) {
			parse(result);
			if ($('#resultatsRecherche img[src*="picto-alert"]', html).length !== 0) {
				coverNotFound++;
				main();
				$('#loading').css('display', 'none');
			}
			else {
				get = $.ajax({
					type: "GET",
					url: projectUrl + $('td.align-center.action:eq(0) a', html).attr('href')
				})
				.then(function(result) {
					parse(result);
					if (Number($('#reserve', html).text().replace(/[ ]/gim, '')) < (Number($('#label-saillie-prix strong', html).text().replace(/[ ]/gim, '')))) {
						checkMoney();
					}
					else {
						var offre = $('nav.content__breadcrumb.js-content__breadcrumb a[href*="jument"]', html).attr('href').split('offre=')[1].split('&')[0];
						if ($('img[src*="licorne"]', html).length !== 0) {
							if ($('#boutonDoReproduction', html).hasClass('disabled')) {
								localStorage.setItem('coversLicorne', 1);
								localStorage.getItem('coversLicorne') == '1';
								coverNotFound++;
								main();
								$('#loading').css('display', 'none');
							}
							else {
								postData = "id=" + chevalId + "&offer=" + offre + "&action=accept&search=tri=" + tri + "&page=0&sens=" + sens + "&rechercher=1&breeder=" + myName + "&potentielTotal=" + set.coversGP + "&prix=" + set.coversFemPrice + "&blup=-100&race=" + breedId + "&purete=" + set.coversPurebred + "&cE=0&cV=0&cD=0&cG=0&cT=0&cS=0&licorne=1&licorne-ailee=1&jument=" + chevalId + "&type=public#resultatsRecherche";
								post = $.ajax({
									type: "POST",
									url: projectUrl + "/elevage/chevaux/doVerifierSessionLicorne",
									data: postData
								})
								.then(function(result) {
									postData = "id=" + chevalId + "&startSession=1&offer=" + offre + "&action=accept&search=tri="+ tri;
									post = $.ajax({
										type: "POST",
										url: projectUrl + "/elevage/chevaux/doReproduction",
										data: postData

									})
									.then(function(result) {
										parse(result);
										get = $.ajax({
											type: "GET",
											url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
										})
										.then(function(result) {
											parse(result);
											refresh();
											main();
											$('#loading').css('display', 'none');
										});
									});
								});
							}		
						}
						else {
							postData = "id=" + chevalId + "&offer=" + offre + "&action=accept&search=tri=" + tri + "&page=0&sens=" + sens + "&rechercher=1&breeder=" + myName + "&potentielTotal=" + set.coversGP + "&prix=" + set.coversFemPrice + "&blup=-100&race=" + breedId + "&purete=" + set.coversPurebred + "&cE=0&cV=0&cD=0&cG=0&cT=0&cS=0&cheval=1&poney=1&pegase=1&prixC=l&jument=" + chevalId + "&type=public#resultatsRecherche";
							post = $.ajax({
								type: "POST",
								url: projectUrl + "/elevage/chevaux/doReproduction",
								data: postData

							})
							.then(function(result) {
								parse(result);
								get = $.ajax({
									type: "GET",
									url: projectUrl + "/elevage/chevaux/cheval?id=" + chevalId
								})
								.then(function(result) {
									parse(result);
									refresh();
									main();
									$('#loading').css('display', 'none');
								});
							});
						}
					}
				});
			}
		}); 
	}
}

function milk() {
		var a1 = $('#form-do-suckle input').eq(0).attr('name'); var a2 = $('#form-do-suckle input').eq(0).attr('value');
		var b1 = $('#form-do-suckle input').eq(1).attr('id').substr(14); var b2 = $('#form-do-suckle input').eq(1).attr('value');
		var postData = (a1+'='+a2+'&'+b1+'='+b2).toLowerCase();
		post = $.ajax({
			type: "POST",
			url: projectUrl + '/elevage/chevaux/doSuckle',
			data: postData,
		})
		.then(function(result) {
			$('#care-wrapper').html(result['blocks']['care-body-content']).change();
			$('#history-content').html(result['blocks']['history-body-content']).change();
			stats(result);
			main();
		});
}

function feed() {
	var a1; var a2; var b1; var b2; var c1; var c2; var d1; var d2; var e1; var e2; var f1; var f2; var postData;
		a1 = $('#feeding input').eq(0).attr('name'); a2 = $('#feeding input').eq(0).attr('value');
		b1 = $('#feeding input').eq(1).attr('id').substr(7); b2 = $('#feeding input').eq(1).attr('value');
		c1 = $('#feeding input').eq(2).attr('id').substr(7); c2 = randomInteger(10, 80);
		d1 = $('#feeding input').eq(3).attr('id').substr(7); d2 = randomInteger(10, 80);
		e1 = $('#haySlider-sliderHidden').eq(0).attr('name').substr(7);
		var arr = $('.float-right.section-fourrage.section-fourrage-quantity').text().trim().split(' / ');
		e2 = arr[1] - arr[0];
		if ($('#feeding .message').length !== 0) {
			if ($('#feeding .message').text().indexOf('20') !== -1) {
				e2 = 20 - arr[0];
			}
		}
		if (chevalAge > 17) {
			f1 = $('#oatsSlider-sliderHidden').eq(0).attr('name').substr(7);
			var arr = $('.float-right.section-avoine.section-avoine-quantity').text().trim().split(' / ');
			f2 = arr[1] - arr[0];
			postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2+'&'+e1+'='+e2+'&'+f1+'='+f2).toLowerCase();
		}
		else {
			postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2+'&'+e1+'='+e2).toLowerCase();
		}
		post = $.ajax({
			type: "POST",
			url: projectUrl + '/elevage/chevaux/doEat',
			data: postData,
		})
		.then(function(result) {
			if (result['errors'].length == 0) {
				maleEnergy = result['chevalEnergie'];
				$('#care-wrapper').html(result['blocks']['care-body-content']).change();
				$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
				$('#history-content').html(result['blocks']['history-body-content']).change();
				$('#training-wrapper').html(result['blocks']['training-body-content']).change();
				$('#walk-wrapper').html(result['blocks']['walk-body-content']).change();
				stats(result);
				main();
			}
			else { 
				if (result['errors'][0] == "eat-fourrage-inventaire") {
					buyFood('fourrage');
				}
				else if (result['errors'][0] == "eat-avoine-inventaire") {
					buyFood('avoine');
				}
			}
		});
}

function drink(bool) {
	var a1 = $('#form-do-drink input').eq(0).attr('name'); var a2 = $('#form-do-drink input').eq(0).attr('value');
	var b1 = $('#form-do-drink input').eq(1).attr('id').substr(13); var b2 = $('#form-do-drink input').eq(1).attr('value');
	var c1 = $('#form-do-drink input').eq(2).attr('id').substr(13); var c2 = randomInteger(10, 80);
	var d1 = $('#form-do-drink input').eq(3).attr('id').substr(13); var d2 = randomInteger(10, 80);
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2).toLowerCase();
	post = $.ajax({
	  type: "POST",
	  url: projectUrl + '/elevage/chevaux/doDrink',
	  data: postData,
	})
	.then(function(result) {
		maleEnergy = result['chevalEnergie'];
		$('#care-wrapper').html(result['blocks']['care-body-content']).change();
		$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
		$('#history-content').html(result['blocks']['history-body-content']).change();
		$('#training-tab-main').html(result['blocks']['training-body-content']).change();
		$('#messageBoxInline').html(result['blocks']['walk-body-content']).change();
		stats(result);
		if (bool == true) {
			if (set.coversMaleCarrot == '1') {carrot();}
			else if (set.coversMaleMash == '1') {mash();}
			else {
				maleCovers();
			}
		}
		else {main();}
	});
}

function care() {
	var a1 = $('#form-do-stroke input').eq(0).attr('name'); var a2 = $('#form-do-stroke input').eq(0).attr('value');
	var b1 = $('#form-do-stroke input').eq(1).attr('id').substr(14); var b2 = $('#form-do-stroke input').eq(1).attr('value');
	var c1 = $('#form-do-stroke input').eq(2).attr('id').substr(14); var c2 = randomInteger(10, 80);
	var d1 = $('#form-do-stroke input').eq(3).attr('id').substr(14); var d2 = randomInteger(10, 80);
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2).toLowerCase();
	post = $.ajax({
	  type: "POST",
	  url: projectUrl + '/elevage/chevaux/doStroke',
	  data: postData,
	})
	.then(function(result) {
		$('#care-wrapper').html(result['blocks']['care-body-content']).change();
		$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
		$('#history-content').html(result['blocks']['history-body-content']).change();
		$('#training-wrapper').html(result['blocks']['training-body-content']).change();
		$('#walk-wrapper').html(result['blocks']['walk-body-content']).change();
		stats(result);
		drink(true);
	});
}

function carrot() {
	var a1 = $('#form-do-eat-treat-carotte input').eq(0).attr('name'); var a2 = $('#form-do-eat-treat-carotte input').eq(0).attr('value');
	var b1 = $('#form-do-eat-treat-carotte input').eq(1).attr('id').substr(25); var b2 = $('#form-do-eat-treat-carotte input').eq(1).attr('value');
	var c1 = "friandise"; var c2 = "carotte";
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2).toLowerCase();
	post = $.ajax({
	  type: "POST",
	  url: projectUrl + '/elevage/chevaux/doEatTreat',
	  data: postData,
	})
	.then(function(result) {
		maleEnergy = result['chevalEnergie'];
		$('#care-wrapper').html(result['blocks']['care-body-content']).change();
		$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
		$('#history-content').html(result['blocks']['history-body-content']).change();
		$('#training-wrapper').html(result['blocks']['training-body-content']).change();
		$('#walk-wrapper').html(result['blocks']['walk-body-content']).change();
		stats(result);
		if (set.coversMaleMash == '1') {mash();}
		else {
			maleCovers();
		}
	});
}

function mash() {
	var a1 = $('#form-do-eat-treat-mash input').eq(0).attr('name'); var a2 = $('#form-do-eat-treat-mash input').eq(0).attr('value');
	var b1 = $('#form-do-eat-treat-mash input').eq(1).attr('id').substr(22); var b2 = $('#form-do-eat-treat-mash input').eq(1).attr('value');
	var c1 = "friandise"; var c2 = "mash";
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2).toLowerCase();
	post = $.ajax({
	  type: "POST",
	  url: projectUrl + '/elevage/chevaux/doEatTreat',
	  data: postData,
	})
	.then(function(result) {
		maleEnergy = result['chevalEnergie'];
		$('#care-wrapper').html(result['blocks']['care-body-content']).change();
		$('#competition-body-content').html(result['blocks']['competition-body-content']).change();
		$('#history-content').html(result['blocks']['history-body-content']).change();
		$('#training-wrapper').html(result['blocks']['training-body-content']).change();
		$('#walk-wrapper').html(result['blocks']['walk-body-content']).change();
		stats(result);
		maleCovers();
	});
}

function sleep() {
	var a1 = $('#form-do-night input').eq(0).attr('name'); var a2 = $('#form-do-night input').eq(0).attr('value');
	var b1 = $('#form-do-night input').eq(1).attr('id').substr(13); var b2 = $('#form-do-night input').eq(1).attr('value');
	var c1 = $('#form-do-night input').eq(2).attr('id').substr(13); var c2 = randomInteger(10, 80);
	var d1 = $('#form-do-night input').eq(3).attr('id').substr(13); var d2 = randomInteger(10, 80);
	var postData = (a1+'='+a2+'&'+b1+'='+b2+'&'+c1+'='+c2+'&'+d1+'='+d2).toLowerCase();
	post = $.ajax({
	  type: "POST",
	  url: projectUrl + '/elevage/chevaux/doNight',
	  data: postData,
	})
	.then(function(result) {
		$('#night-wrapper').html(result['blocks']['night-body-content']).change();
		main();
	});
}

function main(num) {
	checkLicorneCovers();
	if (Number($('#reserve').text().replace(/[ ]/gim, '')) < 1200) {
		checkMoney();
	}
	else if (($('div[widget^="7"] #cheval-inscription').length !== 0) && (set.coversEcDuration !== '0') && (centreNotFound < 1)) {
		ksk();
	}
	else if ((($('#reproduction #messageBoxInline', html).length !== 0) || ($('#reproduction #messageBoxInline').length !== 0)) && (chevalSexe == 'feminin') && (chevalAge > 29) && ($('div[widget^="7"] #cheval-inscription').length == 0)) {
		getBaby();
	}
	else if ((!($('#boutonPanser').hasClass('action-disabled'))) && (!($('#boutonPanser', html).hasClass('action-disabled')))) {
		groom();
		maleEnergy = Number($('#energie').text());
		checkLicorneCovers();
	}
	else if ((!($('#boutonAllaiter').hasClass('action-disabled'))) && (!($('#boutonAllaiter').hasClass('action-disabled'))) && (chevalAge < 5) && (set.coversMilk == '1')) {
		milk();
	}
	else if (((!($('#mission-wrapper a').hasClass('action-disabled'))) && (!($('#mission-wrapper a', html).hasClass('action-disabled')))) && (chevalAge > 23) && (set.coversMission == '1') && ($('div[widget^="7"] #cheval-inscription').length == 0) && (skipMission < 1)) {
		mission();
		maleEnergy = Number($('#energie').text());
	}
	else if ((chevalSexe == 'masculin') && (chevalAge > 29) && ((maleEnergy - coverEnergy) >= 20) && (set.coversDoMale == '1') && (!($('a.tab-action.tab-action-select.action.action-style-4.saillir').hasClass('action-disabled')))) {
		maleCovers();
	}
	else if ((chevalSexe == 'feminin') && (chevalAge > 29) && (set.coversDoFem == '1') && (!($('.action.action-style-4.saillir').hasClass('action-disabled'))) && ($('#boutonEchographie').length == 0) && (coverNotFound < 1) && (set.coversLicorneModOn !== '1')) {
		femaleCovers();
	}
	else if (((((($('.float-right.section-fourrage.section-fourrage-quantity').text().trim().split(' / ')[1] - $('.float-right.section-fourrage.section-fourrage-quantity').text().trim().split(' / ')[0]) > 0) || (($('.float-right.section-avoine.section-avoine-quantity').text().trim().split(' / ')[1] - $('.float-right.section-avoine.section-avoine-quantity').text().trim().split(' / ')[0]) > 0)) && ($('#feeding .message').length == 0)) || (((($('.float-right.section-fourrage.section-fourrage-quantity').text().trim().split(' / ')[1] - $('.float-right.section-fourrage.section-fourrage-quantity').text().trim().split(' / ')[0]) > 0) || (($('.float-right.section-avoine.section-avoine-quantity').text().trim().split(' / ')[1] - $('.float-right.section-avoine.section-avoine-quantity').text().trim().split(' / ')[0]) > 0)) && ($('#feeding .message').length !== 0) && ($('#feeding .message').text().indexOf('20') !== -1))) && (num !== 1))  {
		feed();
	}
	else if ((chevalSexe == 'masculin') && (chevalAge > 29) && ((maleEnergy - coverEnergy) >= 20) && (set.coversDoMale == '1') && (!($('a.tab-action.tab-action-select.action.action-style-4.saillir').hasClass('action-disabled')))) {
		maleCovers();
	}
	else if ((!($('#boutonBoire').hasClass('action-disabled'))) && (!($('#boutonBoire', html).hasClass('action-disabled'))) && (set.coversWater == '1')) {
		drink();
	}
	else if ((!($('#boutonCoucher').hasClass('action-disabled'))) && (!($('#boutonCoucher', html).hasClass('action-disabled')))) {
        if ((set.coversLicorneModOn == '1') && (set.coversLicorneGrowOn !== '1') && (chevalSexe == 'feminin') && (chevalAge > 29) && (!($('.action.action-style-4.saillir').hasClass('action-disabled'))) && ($('#boutonEchographie').length == 0)) {
            $('#nav-next')[0].click();
		    if (localStorage.getItem('startHorseCount') == 0) {localStorage.setItem('startHorseCount', 1);}
        }
        else {
            sleep();
        }
	}
	else if ((chevalId == localStorage.getItem('startHorse')) && (localStorage.getItem('startHorseCount') == 1)) {
		localStorage.setItem('coversStartup', 0);
		localStorage.removeItem('startHorse');
		localStorage.removeItem('startHorseCount');
		localStorage.removeItem('maresBreedId');
		localStorage.removeItem('coversWorkPlace');
		localStorage.removeItem('coversLicorne');
		location.reload();
	}
	else {
        if ((set.coversLicorneModOn == '1') && (set.coversLicorneGrowOn == '1')) {
            if ( (chevalSexe == 'feminin') && ( !(($('.action.action-style-4.saillir').length !== 0) && (!($('.action.action-style-4.saillir').hasClass('action-disabled')))) ) ) {
                setInterval(() => {
                    $('#age button .button-inner-0').click();
                }, 500);
            }
            else if (chevalSexe == 'masculin') {
                $('#nav-next')[0].click();
		        if (localStorage.getItem('startHorseCount') == 0) {localStorage.setItem('startHorseCount', 1);}
            }
        }
        else {
            $('#nav-next')[0].click();
		    if (localStorage.getItem('startHorseCount') == 0) {localStorage.setItem('startHorseCount', 1);}
        }
	}
}

$(document).ready(function() {
	try {
		$('#Ufo_0').click();
		if ((coversStartup == 1) && (localStorage.getItem('coversWorkPlace') == $('.horse-name').prev().find('a').attr('href')) && (location.href.indexOf('/') !== -1)) {
			if ($('a[href*="paradis"]').length !== 0) {
				heaven();
			}
			else if ((Number(set.coversMaxAge) == 0) || (chevalAge < set.coversMaxAge)) {
				maleEnergy = Number($('#energie').text());
				main();
			}
			else if (chevalAge >= set.coversMaxAge) {
				$('#nav-next')[0].click();
			}
		}
	}
	catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки:\n' + e);}
});

/***************************************ИНТЕРФЕЙС***************************************/
try {
	/*Главное окошко*/$('html[dir*="r"]').append('<div class="leftSidedPanel" id="coversPanel" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:0px; width:110px; height:90px; display:block; z-index:1000; border-radius:0px 10px 10px 0px; font-family:sans-serif"></div>');
	/*Окно настроек*/$('html[dir*="r"]').append('<div class="leftSidedPanel toggleable" id="coversPanelSettings" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:'+ ($('#coversPanel').width() + 10) +'px; width:640px; height:345px; display:none; z-index:1000; border-radius:10px; font-family:sans-serif"></div>');
	//Оформление главного окошка
	$('#coversPanel').append('<div class="tip" data-tippy-content="Посетить нашу группу" style="font-size:14px; margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px; font-weight:bold"><a target="_blank" href="https://vk.com/botqually" style="color:#ffffff">● Bot Qually ●</a></div>');
	$('#coversPanel').append('<div style="font-size:9px; margin-top:3px; margin-left:auto; margin-right:auto; text-align:center; font-weight:bold; color:#ffffff">version: covers 2.0 mod</div>');
	$('#coversPanel').append('<div id="coversButtons" style="margin-top:10px; margin-left:auto; margin-right:auto; text-align:center"></div>');
	if ($('html[dir*="r"]').attr('dir') == "ltr") {
		$('#coversButtons').append('<span id="coversPower" style="cursor:pointer;"><img data-tippy-content="Вкл/выкл" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/power-512.png" style="width:30px;"></span>');
		$('#coversButtons').append('<span id="coversSettings" style="cursor:pointer; margin-left:10px;"><img data-tippy-content="Настройки" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/gear-256.png" style="width:30px;"></span>');
	}
	else {
		$('#coversButtons').append('<span id="coversPower" style="margin-left:10px; cursor:pointer;"><img data-tippy-content="Вкл/выкл" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/power-512.png" style="width:30px;"></span>');
		$('#coversButtons').append('<span id="coversSettings" style="cursor:pointer;"><img data-tippy-content="Настройки" class="hoverImage tip" src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/gear-256.png" style="width:30px;"></span>');
	}
	//Оформление окна настроек
	$('#coversPanelSettings').append('<div style="font-size:14px; margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px; font-weight:bold; color:#fff">Настройки</div>');
	$('#coversPanelSettings').append('<div class="hoverImage" id="closeSettings" style="position:absolute; top:5px; left:619px; cursor:pointer"><img width="15" src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Close-128.png"></div>');
	/*-----------------------------------------Основные настройки-------------------------------------------*/
    $('#coversPanelSettings').append('<div id="defaultOptions" style="height:256px; float:left; width:185px; margin:10px 5px 0 10px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
    $('#defaultOptions').append('<div id="coversLicorneMod" style="margin-bottom:8px; font-size:14px; color:#fff"></div>');
    $('#coversLicorneMod').append('<span>Вкл. мод:</span>');
    $('#coversLicorneMod').append('<span style="margin-left:5px; margin-right: 5px;"><input id="coversLicorneModOn" type="checkbox" style="position:relative; top:3px;"></span>');
    $('#coversLicorneMod').append('<span>Рост:</span>');
	$('#coversLicorneMod').append('<span style="margin-left:5px"><input id="coversLicorneGrowOn" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#defaultOptions').append('<span>Макс. возраст:</span>');
	$('#defaultOptions').append('<select id="coversMaxAge" style="margin-left:5px; background-color:#fff"><option value="0">Не важно</option><option value="300">25 лет</option><option value="360">30 лет</option></select>');
	$('#defaultOptions').append('<div id="defaultOptions1" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#defaultOptions1').append('<span><img src="/media/equideo/image/fonctionnels/20/lecon.png"></span>');
	$('#defaultOptions1').append('<span class="tip" data-tippy-content="Делать миссию" style="cursor:default; margin-left:5px"><input id="coversMission" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#defaultOptions1').append('<span style="margin-left:10px"><img src="/media/equideo/image/fonctionnels/20/abreuvoir.png"></span>');
	$('#defaultOptions1').append('<span class="tip" data-tippy-content="Давать воду" style="cursor:default; margin-left:2px"><input id="coversWater" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#defaultOptions1').append('<span style="margin-left:10px;"><img src="/media/equideo/image/produits/20/biberon.png"></span>');
	$('#defaultOptions1').append('<span class="tip" data-tippy-content="Давать молоко жеребятам" style="cursor:default; margin-left:2px"><input id="coversMilk" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#defaultOptions').append('<div id="defaultOptions2" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#defaultOptions2').append('<span>Имена жеребят:</span>');
	$('#defaultOptions2').append('<input id="coversMaleName" maxlength="20" placeholder="Мужское" style="margin-top:5px; width:' + ($('#defaultOptions').width() - 5) + 'px" type="text">');
	$('#defaultOptions2').append('<input id="coversFemaleName" maxlength="20" placeholder="Женское" style="margin:5px 0 5px 0; width:' + ($('#defaultOptions').width() - 5) + 'px" type="text">');
	$('#defaultOptions2').append('<span>Аффикс для жеребят:</span>');
	$('#defaultOptions2').append('<input id="coversAffix" style="margin:5px 0 5px 0; width:' + ($('#defaultOptions').width() - 5) + 'px" type="text">');
	$('#defaultOptions2').append('<span>Завод для жеребят:</span>');
	$('#defaultOptions2').append('<input id="coversFarm" style="margin:5px 0 5px 0; width:' + ($('#defaultOptions').width() - 5) + 'px" type="text">');
	$('#defaultOptions2').append('<span>Продавать:</span>');
	$('#defaultOptions2').append('<select id="coversSellSomething" class="tip" data-tippy-content="Продать, если закончились экю" style="margin-top:5px; background-color:#fff; width:' + ($('#defaultOptions').width() - 3) + 'px"><option value="0">Овёс</option><option value="1">Фураж</option><option value="2">Яблоко</option><option value="3">Морковь</option><option value="4">Древесина</option><option value="5">Железо</option><option value="6">Песок</option><option value="7">Кожа</option><option value="8">Солома</option><option value="9">Лён</option><option value="10">Пшеница</option><option value="11">Экскременты</option></select>');
	/*------------------------------------------Запись в КСК------------------------------------------*/
	$('#coversPanelSettings').append('<div id="columnOne" style="float:left;"></div>');
	$('#columnOne').append('<div id="centreOptions" style="width:185px; margin:10px 5px 0 5px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#centreOptions').append('<span>Запись в КСК на:</span>');
	$('#centreOptions').append('<select id="coversEcDuration" style="margin-left:5px; background-color:#fff"><option value="0">выкл.</option><option value="tarif2,3">3 дня</option><option value="tarif3,10">10 дней</option><option value="tarif4,30">30 дней</option><option value="tarif5,60">60 дней</option></select>');
	$('#centreOptions').append('<div id="centreOptions1" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#centreOptions1').append('<span style="margin-left:5px"><img src="/media/equideo/image/produits/20/fourrage.png"></span>');
	$('#centreOptions1').append('<span class="tip" data-tippy-content="КСК с фуражом" style="margin-left:5px"><input id="coversEcFourrage" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#centreOptions1').append('<span style="margin-left:10px"><img src="/media/equideo/image/produits/20/avoine.png"></span>');
	$('#centreOptions1').append('<span class="tip" data-tippy-content="КСК с овсом" style="margin-left:2px"><input id="coversEcAvoine" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#centreOptions1').append('<span style="margin-left:10px;"><img src="/media/equideo/image/produits/20/carotte.png"></span>');
	$('#centreOptions1').append('<span class="tip" data-tippy-content="КСК с морковью" style="margin-left:2px"><input id="coversEcCarotte" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#centreOptions').append('<div id="centreOptions2" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#centreOptions2').append('<span">Директор:</span>');
	$('#centreOptions2').append('<input id="coversDirector" style="margin-top:5px; width:' + ($('#centreOptions').width() - 5) + 'px" type="text">');
	$('#centreOptions').append('<div id="centreOptions3" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#centreOptions3').append('<span">Ограничить цену до:</span>');
	var k = '';
	for (i = 20; i < 201; i++) {k = k + '<option value="'+i+'">'+i+' экю/день</option>';}
	$('#centreOptions3').append('<select id="coversEcPrice" class="tip" data-tippy-content="Если по заданной цене ничего не найдено, лошадь не будет записана в КСК" style="margin-top:5px; background-color:#fff; width:' + ($('#centreOptions').width() - 3) + 'px"><option value="">Не ограничивать</option>' + k + '</select>');
	/*--------------------------------------------Случки жен.----------------------------------------*/
	$('#coversPanelSettings').append('<div id="femaleCoverOptions" style="height:238px; float:left;width:185px; margin:10px 5px 0 5px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions').append('<span>Случки кобыл:</span>');
	$('#femaleCoverOptions').append('<span style="margin-left:5px"><input id="coversDoFem" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#femaleCoverOptions').append('<div id="femaleCoverOptions1" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions1').append('<span">Максимальная цена:</span>');
	k = '';
	for (i = 500; i < 7501; i+=500) {k = k + '<option value="'+i+'">'+i+'</option>';}
	$('#femaleCoverOptions1').append('<select id="coversFemPrice" style="margin-top:5px; background-color:#fff; width:' + ($('#femaleCoverOptions').width() - 3) + 'px">' + k + '</select>');
	$('#femaleCoverOptions1').append('<div id="femaleCoverOptions2" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions2').append('<span">Минимум ГП:</span>');
	$('#femaleCoverOptions2').append('<input id="coversGP" style="margin-top:5px; width:' + ($('#centreOptions').width() - 5) + 'px" type="text">');
	$('#femaleCoverOptions').append('<div id="femaleCoverOptions3" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions3').append('<span">Заводчик:</span>');
	$('#femaleCoverOptions3').append('<input id="coversBreeder" style="margin-top:5px; width:' + ($('#centreOptions').width() - 5) + 'px" type="text">');
	$('#femaleCoverOptions').append('<div id="femaleCoverOptions4" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions4').append('<span>ЧК:</span>');
	$('#femaleCoverOptions4').append('<span class="tip" data-tippy-content="Случать кобылу с ЧК жеребцами своей породы" style="margin-left:5px"><input id="coversPurebred" type="checkbox" style="position:relative; top:2px"></span>');
	$('#femaleCoverOptions4').append('<span style="margin-left:5px;">Свои жеребцы:</span>');
	$('#femaleCoverOptions4').append('<span class="tip" data-tippy-content="Искать на общ. случках только своих жеребцов" style="margin-left:5px"><input id="coversSelfMale" type="checkbox" style="position:relative; top:2px"></span>');
	$('#femaleCoverOptions').append('<div id="femaleCoverOptions5" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#femaleCoverOptions5').append('<span">Сортировка случек:</span>');
	$('#femaleCoverOptions5').append('<select id="coversSort" style="margin-top:5px; background-color:#fff; width:' + ($('#femaleCoverOptions').width() - 3) + 'px"><option value="0">По цене</option><option value="1">По ГП</option><option value="2">По НЛНП</option></select>');
	/*--------------------------------------------Случки муж.----------------------------------------*/
	$('#columnOne').append('<div id="maleCoverOptions" style=";width:185px; margin:5px 5px 0 5px; padding:5px 5px 8px 8px; border:1px solid white; border-radius: 5px; font-size:14px; color:#fff"></div>');
	$('#maleCoverOptions').append('<span>Случки от жеребцов:</span>');
	$('#maleCoverOptions').append('<span style="margin-left:5px"><input id="coversDoMale" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#maleCoverOptions').append('<div id="maleCoverOptions4" style="margin-top:5px; font-size:14px; color:#fff"></div>');
	$('#maleCoverOptions4').append('<span">Цена:</span>');
	k = '';
	for (i = 500; i < 7501; i+=500) {k = k + '<option value="'+i+'">'+i+'</option>';}
	$('#maleCoverOptions4').append('<select id="coversMalePrice" style="margin-top:5px; background-color:#fff; width:' + ($('#maleCoverOptions').width() - 3) + 'px">' + k + '</select>');
	$('#maleCoverOptions').append('<div id="maleCoverOptions5" style="margin-top:7px; font-size:14px; color:#fff"></div>');
	$('#maleCoverOptions5').append('<span><img src="/media/equideo/image/produits/20/carotte.png"></span>');
	$('#maleCoverOptions5').append('<span class="tip" data-tippy-content="Давать жеребцам морковь" style="margin-left:5px"><input id="coversMaleCarrot" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#maleCoverOptions5').append('<span style="margin-left:10px"><img src="/media/equideo/image/produits/20/mash.png"></span>');
	$('#maleCoverOptions5').append('<span class="tip" data-tippy-content="Давать жеребцам смесь" style="margin-left:2px"><input id="coversMaleMash" type="checkbox" style="position:relative; top:3px;"></span>');
	$('#coversPanelSettings').append('<div style="clear:both;"></div>');
	$('#coversPanelSettings').append('<div style="margin-top:10px; margin-left:auto; margin-right:auto; text-align:center; widtn:150px; height:15px;"><a  id="coversResetSettings" style="font-size:14px; font-weight:bold; color:#fff">Сбросить настройки</a></div>');
	/*------------------------------------------------------------------------------------*/
	//Смещение относительно других qually-скриптов
	$(document).ready(function() {
		if (($('html[dir*="r"]').has($('.leftSidedPanel'))) && ($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).attr('id') !== 'coversPanel')) {
			var top1 = $('.leftSidedPanel').last().css('top');
			if (top1 !== undefined) {top1 = Number(top1.replace('px', ''));}
			var height1 = Number($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).height());
			var a = top1 + height1 + 20;
			$('#coversPanel').css('top', a + 'px');
			$('#coversPanelSettings').css('top', a + 'px');
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

	if (coversStartup == 0) {$('#coversPower').css({"-webkit-filter" : "hue-rotate(180deg)"});}
	else {$('#coversPower').css({"-webkit-filter" : "hue-rotate(0deg)"});} 

	$('#coversSettings').click(function() {
		$('#coversPanelSettings').toggle(0);
	});

	$('.hoverImage').focus(
		function(){this.blur();}
	);

	//Закрытие окна настроек нажатием на любое место документа
	$(document).click(function(evt){    
		if ((evt.target.id == "coversPanel") || (evt.target.id == "coversPanelSettings"))
			return;
		if (($(evt.target).closest('#coversPanel').length) || ($(evt.target).closest('#coversPanelSettings').length))
			return;             
		$('#coversPanelSettings').hide(0);
	});

	//Нажатие на кнопку "Вкл/выкл"
	$('#coversPower').click(function() {
		if (location.href.indexOf('/chevaux/cheval?id=') !== -1) {
			$('#coversPanelSettings').hide(0);
			if (coversStartup == 0) {
				try {localStorage.setItem('startHorse', chevalId);} catch {}
				localStorage.setItem('startHorseCount', 0);
				localStorage.setItem('coversWorkPlace', $('.horse-name').prev().find('a').attr('href'));
				for (i = 0; i < inputs.length; i++) {
					localStorage.setItem(inputs[i], $('#'+inputs[i]).val());
				}
				$(this).css({"-webkit-filter" : "hue-rotate(0deg)"});
				coversStartup = 1;
			}
			else {
				$(this).css({"-webkit-filter" : "hue-rotate(180deg)"});
				coversStartup = 0;
				localStorage.removeItem('maresBreedId');
				localStorage.removeItem('coversWorkPlace');
				localStorage.removeItem('coversLicorne');
			}
			localStorage.setItem('coversStartup', coversStartup);
			location.reload();
		}
		else {
			alert('Запуск скрипта Qually Covers 2.0 должен производиться со страницы лошади.');
		}
	});

	//Нажатие на Сбросить настройки
	$('#coversResetSettings').click(function() {
		for (i = 0; i < arr.length; i++) {
			localStorage.removeItem(arr[i]);
			location.reload();
		}
	});
	$('#coversResetSettings').on('mouseover', function() {
		$(this).css('color', 'red').change();
	});
	$('#coversResetSettings').on('mouseout', function() {
		$(this).css('color', '#fff').change();
	});

	$('#closeSettings').click(function() {
		$('#coversPanelSettings').hide(0);
	});

	//Тултип
	tippy('.tip', {
		placement: 'bottom',
		duration: 0,
		animation: 'fade'
	});

	//Стили полей ввода и селектов
	$('#coversPanelSettings input').css({
		'background-color': '#555555',
		'border': '1px solid #a9a9a9',
		'color': '#ffffff'
	});
	$('#coversPanelSettings select').css({
		'background-color': '#555555',
		'color': '#ffffff'
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
	$('#coversPanelSettings input').on('keyup', function() {
		if ($(this).attr('type') !== 'checkbox') {
			if ($(this).attr('id') == 'coversGP') {
				$(this).val(($(this).val()).replace(/[^0-9]/gim, ''));
			}
			localStorage.setItem($(this).attr('id'), $(this).val());
		}
	});

	$('#coversPanelSettings select').click(function() {
		localStorage.setItem($(this).attr('id'), $(this).val());
	});

	$('#coversPanelSettings input').click(function() {
		if ($(this).attr('type') == 'checkbox') {
			if ($(this).prop('checked') == true) {
				localStorage.setItem($(this).attr('id'), 1);
			}
			else {
				localStorage.setItem($(this).attr('id'), 2);
			}
		}
	});

	$('#coversGP').on('keyup', function() {
		var val1 = $(this).val();
		$(this).val(val1.replace(/[^0-9]/gim, ''));
	});

}
catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки: Interface Error\n' + e);}
