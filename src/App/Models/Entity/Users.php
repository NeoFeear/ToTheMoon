<?php 

namespace App\Models\Entity;

use App\Models\Model;

class Users extends Model {
    protected $id;
    protected $username;
    protected $password;
    protected $email;
    protected $role;
    protected $firstName;
    protected $lastName;
    protected $createdAt;
    protected $picture;

    public function __construct()
    {
        $this->setCreatedAt(date('Y-m-d H:i:s'));
    }

    //ID
    public function getId(): ?int {
        return $this->id;
    }
    public function setId(int $id): void {
        $this->id = $id;
    }

    //USERNAME
    public function getUsername(): string {
        return $this->username;
    }
    public function setUsername(string $username) {
        $this->username = $username;
    }

    //PASSWORD
    public function getPassword(): string {
        return $this->password;
    }
    public function setPassword(string $password) {
        $this->password = $password;
    }

    //EMAIL
    public function getEmail(): string {
        return $this->email;
    }
    public function setEmail(string $email) {
        $this->email = $email;
    }

    //ROLE
    public function getRole():string {
        return $this->role;
    }
    public function setRole(string $role) {
        $this->role = $role;
    }    

    //FIRSTNAME
    public function getFirstName(): string {
        return $this->firstName;
    }
    public function setFirstname(string $firstName) {
        $this->firstName = $firstName;
    }

    //LASTNAME
    public function getLastName(): string {
        return $this->lastName;
    }
    public function setLastName(string $lastName) {
        $this->lastName = $lastName;
    }

    //CREATED AT
    public function getCreatedAt(){
        return $this->createdAt;
    }
    public function setCreatedAt(string $date):void {
        $this->createdAt = $date;
    }

    //PICTURE
    public function getPicture(): string {
        return $this->picture;
    }
    public function setPicture(string $picture) {
        $this->picture = $picture;
    }
}