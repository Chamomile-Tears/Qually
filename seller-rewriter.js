//Глобальные переменные
var i;
var j;
var html = document.createElement('html');
var post;
var get;
//Загрузка настроек
var inputs = [];
var selects = [];
var checkboxes = [];
var arr = [];
arr = arr.concat(inputs).concat(selects).concat(checkboxes);
var set = {};
for (i = 0; i < arr.length; i++) {
	set[arr[i]] = localStorage.getItem(arr[i]);
}
var sellrewStartup = localStorage.getItem('sellrewStartup');
if ((sellrewStartup == null) || (sellrewStartup == undefined)) {sellrewStartup = 0;}

function parse(result) {
	html.innerHTML = result;
}

try {
	/*Главное окошко*/$('html[dir*="r"]').append('<div class="leftSidedPanel" id="sellrewPanel" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:0px; width:110px; height:103px; display:block; z-index:1000; border-radius:0px 10px 10px 0px; font-family:sans-serif"></div>');
	/*Окно настроек*/$('html[dir*="r"]').append('<div class="leftSidedPanel toggleable" id="sellrewPanelSettings" style="background-color:rgba(60, 60, 60, 0.95); position:fixed; top:20px; left:'+ ($('#sellrewPanel').width() + 10) +'px; width:430px; height:390px; display:none; z-index:1000; border-radius:10px; font-family:sans-serif"></div>');
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
		//$('#pictureValute').attr('src', '');
		if (($('html[dir*="r"]').has($('.leftSidedPanel'))) && ($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).attr('id') !== 'sellrewPanel')) {
			var top1 = $('.leftSidedPanel').last().css('top');
			if (top1 !== undefined) {top1 = Number(top1.replace('px', ''));}
			var height1 = Number($('.leftSidedPanel').eq($('.leftSidedPanel').length-4).height());
			var a = top1 + height1 + 20;
			$('#sellrewPanel').css('top', a + 'px');
			$('#sellrewPanelSettings').css('top', a + 'px');
		}
	});

	//radio
	$('.radio-1').click(function() {
		if (($(this).attr('id') == "sellrewBuyEquus") || ($(this).attr('id') == "equusLabel")) {
			$('#sellrewBuyEquus').prop('checked', true);
			$('#sellrewBuyPasses').prop('checked', false);
			$('#sellrewBuyPrice').val('');
			$('#sellrewBuyPrice').attr('min', '500').change();
			$('#pictureValute').attr('src', '/media/equideo/image/fonctionnels/20/equus.png');
		}
		else {
			$('#sellrewBuyPasses').prop('checked', true);
			$('#sellrewBuyEquus').prop('checked', false);
			$('#sellrewBuyPrice').val('');
			$('#sellrewBuyPrice').attr('min', '10').change();
			$('#pictureValute').attr('src', '/media/equideo/image/fonctionnels/20/pass.png');
		}
	});

	$('.radio-2').click(function() {
		if (($(this).attr('id') == "sellrewAuction") || ($(this).attr('id') == "auctionLabel")) {
			$('#sellrewAuction').prop('checked', true);
			$('#sellrewDirect').prop('checked', false);
			$('#sellrewReserved').prop('checked', false);
		}
		else if (($(this).attr('id') == "sellrewDirect") || ($(this).attr('id') == "directLabel")) {
			$('#sellrewDirect').prop('checked', true);
			$('#sellrewAuction').prop('checked', false);
			$('#sellrewReserved').prop('checked', false);
		}
		else {
			$('#sellrewReserved').prop('checked', true);
			$('#sellrewAuction').prop('checked', false);
			$('#sellrewDirect').prop('checked', false);
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
			alert('1');
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
	$(document).click(function(evt){    
		if ((evt.target.id == "sellrewPanel") || (evt.target.id == "sellrewPanelSettings"))
			return;
		if (($(evt.target).closest('#sellrewPanel').length) || ($(evt.target).closest('#sellrewPanelSettings').length))
			return;
		$('#sellrewPanelSettings').hide(0);
	});

	//Нажатие на кнопку "Вкл/выкл"
	$('#sellrewPower').click(function() {
		$('#sellrewPanelSettings').hide(0);
		if (sellrewStartup == 0) {
			$(this).css({"-webkit-filter" : "hue-rotate(0deg)"});
			sellrewStartup = 1;
		}
		else {
			$(this).css({"-webkit-filter" : "hue-rotate(280deg)"});
			sellrewStartup = 0;
		}
		localStorage.setItem('sellrewStartup', sellrewStartup);
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

	//Нажатие на Сбросить настройки (!!!)
	$('#sellrewResetSettings').on('mouseover', function() {
		$(this).css('color', 'red').change();
	});
	$('#sellrewResetSettings').on('mouseout', function() {
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

	//Установка настроек
}
catch (e) {alert('Ошибка! Обратитесь к разработчику со скриншотом этого окна. Текст ошибки: Interface Error\n' + e);}
