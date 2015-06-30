<?php
/**
 * Класс для кеширования курсов валют.
 * Позволяет сохранять данные в кеше и читать из него.
 * При этом, есть возможность получить данные из
 * устаревшего кеша (на случай, если данные не доступны).
 */

class RatesCache {
	public $cachefile = 'cache/rates.xml'; //файл кеша
	public $expired = 3600; //время "жизни" кеша
	
	public function __construct() {
	}
	
	/**
	 * Сохраняет данные в кеше.
	 * 
	 * @param string $data строка с данными
	 * @return boolean true если сохранение прошло успешно, false - при возникновении ошибки
	 */
	public function save($data) {
		//если файл не существует, пробуем создать его
		if (!file_exists($this->cachefile)) {
			if (FALSE === fopen($this->cachefile, 'w')) {
				return FALSE;
			}
		}
		//сохраняем данные
		if (file_put_contents($this->cachefile, $data) !== FALSE) {
			return TRUE;
		}
		return FALSE;
	}
	
	/**
	 * Возврашает данные из кеша.
	 *
	 * @param boolean $force указывает, что данные должны быть возвращены даже если кеш устарел
	 * @return string строка с данными или false если кеш отсутствует или возникли ошибки
	 */
	public function get($force = FALSE) {
		if (file_exists($this->cachefile)) {
			if($this->expired > time() - filemtime($this->cachefile) || $force === TRUE) {
				return file_get_contents($this->cachefile);
			}
		}
		return FALSE;
	}
}