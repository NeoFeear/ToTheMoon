<?php

namespace App\Models\Repository;
use PDO;
use Exception;
use Framework\Config\Config;

class AbstractRepository
{
  private $PDOInstance = null; 
  private static $instance = null;

  //INFORMATION DE CONNEXION A LA BASE DE DONNEES
  const DEFAULT_SQL_USER = 'root';
  const DEFAULT_SQL_HOST = 'localhost';
  const DEFAULT_SQL_PASS = '';
  const DEFAULT_SQL_DTB = 'to-the-moon';

   /**
    * Crée et retourne l'objet SPDO
    *
    * @access public
    * @static
    * @param void
    * @return SPDO $instance
    */
  public static function getInstance()
  {  
    try{
      if(is_null(self::$instance))
      {
        self::$instance = new PDO ('mysql:host=localhost;dbname='.Config::get('SQL_DTB'),Config::get('SQL_USER'), Config::get('SQL_PASS'));
        self::$instance->exec("SET NAMES 'utf8'");
      }
      return self::$instance;
    }catch (Exception $e){
      echo $e;
    }
  }
 
  /**
   * Exécute une requête SQL avec PDO
   *
   * @param string $query La requête SQL
   * @return PDOStatement Retourne l'objet PDOStatement
   */
  public function query($query)
  {
    return $this->PDOInstance->query($query);
  }
}