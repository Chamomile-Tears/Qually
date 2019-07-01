// ==UserScript==
// @name         Qually Sell-Rewrite
// @version      2.0
// @namespace    http://tampermonkey.net/
// @description  Выкуп ЗП, продажа и переименовка
// @author       https://vk.com/botqually
// @match        www.howrse.com/*
// @match        us.howrse.com/*
// @match        www.howrse.co.uk/*
// @match        au.howrse.com/*
// @match        ca.howrse.com/*
// @match        www.howrse.de/*
// @match        ouranos.equideow.com/*
// @match        gaia.equideow.com/*
// @match        www.caballow.com/*
// @match        www.howrse.com.pt/*
// @match        br.howrse.com/*
// @match        www.howrse.co.il/*
// @match        www.lowadi.com/*
// @match        www.howrse.it/*
// @match        nl.howrse.com/*
// @match        www.howrse.se/*
// @match        www.howrse.pl/*
// @match        www.howrse.cz/*
// @match        www.howrse.dk/*
// @match        www.howrse.fi/*
// @match        www.howrse.no/*
// @match        ar.howrse.com/*
// @match        www.howrse.hu/*
// @match        www.howrse.ro/*
// @match        www.howrse.bg/*
// @match        www.howrse.si/*
// @match        www.howrse.sk/*
// @require      https://unpkg.com/popper.js@1/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@4
// ==/UserScript==

//Глобальные переменные
var i;
var j;
var html = document.createElement('html');
var post;
var get;
var horsesId = [];
var salesList = [];
var listToSaleRewrite = [];
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

function getSales() {
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
						horsesId[horsesId.length] = $('#table-0 tr.highlight:eq('+ i +') a.horsename', html).attr('href').split('=')[1] + ',' + $('#table-0 tr.highlight:eq('+ 0 +') img:eq(1)', html).attr('src').split('/')[6];
						var firstPrix = Number($('#table-0 tr.highlight:eq('+ i +') td div[id*="prix"]', html).text().replace(/[ ,NEGOTIABLE]/gim, ''));
						var scr = $('#table-0 tr.highlight:eq('+ i +') td div[id*="acheter"] script', html).html();
						var i1 = scr.indexOf('params') + 10;
						var i2 = scr.indexOf(' return false') - 7;
						scr = scr.substring(i1, i2).toLowerCase();
						salesList[salesList.length] = scr;
					}
					buyHorse();
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
					else {
						console.log('Готово!');
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
						horsesId[horsesId.length] = $('#table-0 tr.highlight:eq('+ i +') a.horsename', html).attr('href').split('=')[1];
						var firstPrix = Number($('#table-0 tr.highlight:eq('+ i +') td div[id*="prix"]', html).text().replace(/[ ,NEGOTIABLE]/gim, ''));
						var scr = $('#table-0 tr.highlight:eq('+ i +') td div[id*="acheter"] script', html).html();
						var i1 = scr.indexOf('params') + 10;
						var i2 = scr.indexOf(' return false') - 7;
						scr = scr.substring(i1, i2).toLowerCase();
						salesList[salesList.length] = scr;
					}
					buyHorse();
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
					else {
						console.log('Готово!');
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
function buyHorse() {
	post = $.ajax({
		type: "POST",
		url : window.location.origin + '/marche/vente/prive/doAcheter',
		data: salesList[buyCounter]
	})
	.then(function(result) {
		buyCounter++;
		if (salesList[buyCounter] == undefined) {getSales(); buyCounter = 0;}
		else {buyHorse();}
	});
}

function getAffixes() {
	affixesList = [];
	if (localStorage.getItem('affixesList') == null) {
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
			localStorage.setItem('affixesList', affixesList);
		});
	}
}

function getFarms() {
	farmsList = [];
	if (localStorage.getItem('farmsList') == null) {
		get = $.ajax({
			type: "GET",
			url: window.location.origin + '/elevage/chevaux/?elevage=all-horses'
		})
		.then(function(result) {
			parse(result);
			var affs = $('.tab-action-select', html);
			for (i = 0; i < affs.length; i++) {
				farmsList[farmsList.length] = $('.tab-action-select', html).eq(i).text().replace(/ /gim, '').toLowerCase() + 'SELLREW' + $('.tab-action-select', html).eq(i).attr('href').split('tab-')[1];
			}
			localStorage.setItem('farmsList', farmsList);
		});
	}
}

var mode;
var subMode;
function main() {
	refreshStatus();
	if (mode == 0) {
		alert('Режим: нет ');
	}
	else if (mode == 1) {
		alert('Режим: 1.' + subMode);
	}
	else if (mode == 2) {
		alert('Режим: 2.' + subMode);
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
	$('#rewriteOptions3').append('<select id="sellrewAddToName" style="margin-top:3px; width:175px; background-color:#fff"><option value="0">ГП ххххх.хх</option><option value="1">ГП хх.хх</option><option value="2">Навыки</option><option value="4">Редкая масть (1-5%)</option></select>');
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
		refreshStatus();
		refreshAm();
	});

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
			if ((location.href.indexOf('elevage/bureau/') !== -1) || (location.href.indexOf('/marche/vente/?type=prive&typeSave=1') !== -1)) {
				startUp();
			}
			else {
				alert('Запуск скрипта по текущим настройкам производится со страницы офиса (вкладка "Коневодство" -> "Офис") или зарезервированных продаж (вкладка "Торговля" -> "Продажа лошадей" -> "Зарезервированные продажи").');
			}
		}
		else if (mode == 2) {
			if (location.href.indexOf('/elevage/chevaux/?elevage') !== -1) {
				startUp();
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
}
catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки: Interface Error\n' + e);}
