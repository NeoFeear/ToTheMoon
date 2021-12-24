<?php 
namespace App\Models;

Abstract class Model {
    public function getFields(){
        $reflection = new \ReflectionClass($this);
        $methods = $reflection->getMethods();
        $fields = [];
        foreach($methods as $method){
            if(strpos($method->name, 'get') === 0){
                $methodName = $method->name;
                if ($methodName === 'getFields') {
                    continue;
                }
                $fields[lcfirst(substr($method->name, 3))] = $this->$methodName();
            }
        }
        //var_dump($fields);
        return $fields;
    }

    public function hydrate($data)
    {
        foreach ($data as $attribut => $value) {
            $method = 'set'.str_replace(' ', '', ucwords(str_replace('_', ' ', $attribut)));
            if (is_callable(array($this, $method))) {
                $this->$method($value);
            }
        }
    }

}