<?php

namespace App\Controller\Admin;

use App\Models\Entity\Users;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class AdminHomepageController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;
    
    public function __invoke():string
    {
        $this->ensureLoggedIn();

        $users = $this->getRepository('users')->findAll();
        $questions = $this->getRepository('questions')->findAll();
        
        return $this->render('admin/homepage.html.twig', [
            'users' => $users,
            'questions' => $questions
        ]);
    }
}