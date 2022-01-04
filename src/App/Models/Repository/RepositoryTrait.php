<?php

namespace App\Models\Repository;

use App\Models\Manager\EntityManager;

trait RepositoryTrait {
    
    protected ?EntityManager $em = null;

    public function getRepository(string $entityName) {
        $this->initManager();
        return $this->em->getRepository($entityName);
    }

    protected function initManager() {
        if(!$this->em) {
            $this->em = new EntityManager();
        }
    }
}