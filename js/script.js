/****************************

Разработано в [empty]Studio
    http://empty.pro
    e-mail: studio@empty.pro
    skype: dallas.kassel
    ICQ: 210339681
    vk: http://vk.com/empty_dev

***************************/

var curCodes = ['USD'];
var curRate = 0;
var rateTax = 1.05;
$(document).ready(function() {

    var d = new Date();

    var curr_day = d.getUTCDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

    curr_month++ ; // In js, first month is 0, not 1

    var curDate = (curr_day < 10 ? '0' : '') + curr_day + "%2F" + (curr_month < 10 ? '0' : '') + curr_month + "%2F" + curr_year;

	$.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%27http%3A%2F%2Fwww.cbr.ru%2Fscripts%2FXML_daily.asp%3Fdate_req%3D' + curDate + '%27&format=xml&callback=', function(data) {
		if (data != 'ERR') {
			var rates = '';
            $(data).find('ValCurs').each(function(){
                if($(this).attr('Date')!=undefined) {
                    var rate_data = $(this).attr('Date');
                    var temp = $(this).attr('Date');
                    var splArr = temp.split('/');
                    splArr[2] = splArr[2].substring(2,4);
                    rate_data = splArr.join('.');
                    $('#rate-data').html(rate_data);
                }
            });

			$(data).find('Valute').each(function(key, value) {
				var curCode = $(value).find('CharCode').html();
				if (-1 != $.inArray(curCode, curCodes)) {
					rates += '<li>' + $(value).find('Nominal').html()
						+ ' ' + curCode
						+ ' = ' + $(value).find('Value').html() + ' руб.' + '</li>';
                    curRate = $(value).find('Value').html().substring(0,5);
                    curRate = curRate.replace(/,/g, "\.");
                    curRate = parseFloat(curRate);
                    curRate = curRate.toString().substring(0,5);
				}
				$('#rates').html(rates);
                $('#rate-cur').html(curRate);
                $('#rate-rur').val(curRate);
			});
		}
		else {
			$('#rates').html('<li>Данные недоступны</li>');
            $('#rate-cur').html('ERR');
		}
	});

    setInterval(function(){
        var curVal = $("#rate-usd").val();
        var prevVal  = $("#rate-usd").data("prevVal") || null;

        if (prevVal !== curVal) {
            var rateUsd = $("#rate-usd").val().replace(/,/g, "\.");
            curRate = curRate.replace(/,/g, "\.");
            var rateRur = (parseFloat(rateUsd)*parseFloat(curRate)*rateTax).toFixed(2);
            if(!isNaN(rateRur)) {
                $("#rate-rur").val(rateRur);
            } else {
                $("#rate-rur").val("-");
            }
        }
    }, 100);

});