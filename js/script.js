/**
 * @author Statsenko Vladimir
 * @link http://www.simplecoding.org
*/
var curCodes = ['RUB', 'USD', 'EUR'];
$(document).ready(function() {
	$.get('getrates.php', function(data) {
		if (data != 'ERR') {
			var rates = '';
			$(data).find('Valute').each(function(key, value) {
				var curCode = $(value).find('CharCode').html();
				if (-1 != $.inArray(curCode, curCodes)) {
					rates += '<li>' + $(value).find('Nominal').html()
						+ ' ' + curCode
						+ ' = ' + $(value).find('Value').html() + ' грн.' + '</li>';
				}
				$('#rates').html(rates);
			});
		}
		else {
			$('#rates').html('<li>Данные недоступны</li>');
		}
	});
});