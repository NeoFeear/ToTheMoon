<?php 
//L' EntityManager est la classe qui permet de faire le lien avec la base de données.
//Le rôle de l'EntityManager est d'appeler un Repository avec l'entité à manipuler.
//Il permet aussi d'ajouter de nouvelles tables ou de les updates / Delete

namespace App\Models\Manager;

use App\Models\Repository\Repository;
use App\Models\Repository\AbstractRepository;

class EntityManager extends AbstractRepository
{
    protected static $_db;
    protected static $_dbParams;
    protected $_entityInsertions = [];
    protected $_entityUpdates = [];
    protected $_entityDeletions = [];

    public static function create() {
        self::$_db = AbstractRepository::getInstance();
        return new EntityManager();
    }

    public function getRepository($table){        
        return new Repository($table, $this);
    }
}