<?php
/**
 * Этот скрипт получает возвращает курсы валют в xml формате.
 * Источник данных - сервер pfsoft.com.ua
 * После получения данные сохраняются в кеше.
 */

require_once('ratescache.php');

$rCache = new RatesCache();
//$rCache->expired = 30;

//пробуем получить данные из кеша
if (FALSE === ($data = $rCache->get())) {
	//если данные в кеше устарели, пытаемся получить их от сервера
    $today = date("d/m/Y");
	$data = @file_get_contents('http://www.cbr.ru/scripts/XML_daily.asp?date_req='.$today);
	//если сервер недоступен, пробуем получить данные из устаревшего кеша
	if (FALSE === $data) {
		$data = $rCache->get(TRUE);
	}
	else {
		//обновляем данные в кеше, предварительно изменяем кодировку на UTF-8
		$rCache->save(iconv('windows-1251','utf-8',$data));
	}
}

if (FALSE !== $data) {
	//отправляем данные
	echo $data;
	exit;
}
//отправляем сообщение об ошибке
echo 'ERR';