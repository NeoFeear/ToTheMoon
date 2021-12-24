<?php 

namespace App\Models\Entity;

use App\Models\Model;

class Questions extends Model{
    protected $id;
    protected $label;
    protected $level;

    //ID
    public function getId(): ?int 
    {
        return $this->id;
    }
    public function setId(int $id): void 
    {
        $this->id = $id;
    }

    //LABEL
    public function getLabel(): ?string 
    {
        return $this->label;
    }
    public function setLabel(string $label): void 
    {
        $this->label = $label;
    }

    //LEVEL
    public function getLevel(): ?int 
    {
        return $this->level;
    }
    public function setLevel(int $level): void 
    {
        $this->level = $level;
    }
}