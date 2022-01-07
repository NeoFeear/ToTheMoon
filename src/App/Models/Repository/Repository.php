<?php 
//Le Repository est la classe qui permet de faire le lien entre l'entité et sa table correspondante.
//Il faut créer autant d'instances de Repository qu'il existe de classe d'entités différentes.
//Avant d'utiliser un Repository, il faudra lui communiquer un EntityManager (em) qui fait le lien avec la BDD.
//Le repository contient un ensemble de méthodes qui permettent de créer, lire, modifier, effacer (CRUD) des entités.

namespace App\Models\Repository;
date_default_timezone_set('Europe/Paris');

use App\Models\Repository\AbstractRepository;
use PDOException;
use PDO;

class Repository extends AbstractRepository {
    protected $_table = '';
    protected $_entite = '';
    protected $_em;
    protected $_champs = [];

    public function __construct($tableName, $em){
        $this->_table = $tableName;
        $this->_em = $em;
        $this->_champs = "";
    }

    public function findAll(){
        $db = $this->getInstance(); 

        $query = "SELECT * FROM $this->_table";
        $req = $db->prepare($query);

        $req->execute();
        $data = $req->fetchAll(PDO::FETCH_ASSOC);

        return $data; 
    }

    public function findOneBy(string $champ, $data):array|bool  {
        $db = $this->getInstance(); 

        $query = "SELECT * FROM $this->_table WHERE $champ = :data";
        $req = $db->prepare($query);
        $req->bindParam(':data', $data);

        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        
        return $data; 
    }

    public function findAllBy(string $champ, $data):array {
        $db = $this->getInstance(); 

        $query = "SELECT * FROM $this->_table WHERE $champ = :data";
        $req = $db->prepare($query);
        $req->bindParam(':data', $data);

        $req->execute();
        $data = $req->fetchAll(PDO::FETCH_ASSOC);

        return $data; 
    }

    public function insert($data){
        $db = $this->getInstance(); 
        $fields =  $data->getFields();
        $query = "INSERT INTO " . $this->_table . " (";

        foreach ($fields as $key => $value){
            $query .= $key . ", "; 
        }
        
        $query = substr($query, 0, -2);
        $query .= ") VALUES (";

        foreach ($fields as $key => $value){
            $query .= ":" . $key . ", "; 
        }
        
        $query = substr($query, 0, -2);
        $query .= ")";

        $stm = $db->prepare($query);

        foreach ($fields as $key => $value){
            $stm->bindValue(":" . $key, $value );
        }
    
        $stm->execute();
    }

    public function update($data){
        $db = $this->getInstance(); 
        $fields =  $data->getFields();
        $query = "UPDATE " . $this->_table . " SET ";

        foreach ($fields as $key => $value){
        $query .= $key . " = :" . $key . ", "; 
        }
        
        $query = substr($query, 0, -2);
        $query .= " WHERE id = :id";

        //var_dump($fields, $query);
        $stm = $db->prepare($query);

        foreach ($fields as $key => $value){
        $stm->bindValue(":" . $key, $value );
        }
    
        $stm->execute();
    }

    public function delete($id){
        $db = $this->getInstance(); 
        $query = "DELETE FROM " . $this->_table . " WHERE id = :id";

        $stm = $db->prepare($query);
        $stm->bindValue(':id', $id);
        $stm->execute();
    }

    public function deleteWhere($champs, $data){
        $db = $this->getInstance();
        $query = "DELETE FROM " . $this->_table . " WHERE $champs = :data";

        $stm = $db->prepare($query);
        $stm->bindValue(':data', $data);
        $stm->execute();
    }
}