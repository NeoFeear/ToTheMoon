<?php

namespace App\Controller\Admin\Users;

use App\Models\Entity\Users;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class AdminUsersController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;

    public function __invoke(): string
    { 
        $this->ensureLoggedIn();

        $users = new Users();
        $users = $this->getRepository('users')->findAll();

        if($this->isSubmited()) {
            if(isset($_POST['addUser'])) {
                $user = new Users();
                $user->hydrate($_POST);
                $user->setPassword(password_hash($_POST["password"], PASSWORD_BCRYPT));
                if(isset($_POST['role'])) { $user->setRole('ADMIN'); } else { $user->setRole('PLAYER');}
                $user = $this->getRepository('users')->insert($user);
                $this->redirect('/admin/users');
    
            } elseif (isset($_POST['idUserEdit'])) {
                $this->redirect('/admin/users/edit/' . $_POST['idUserEdit']);
    
            } elseif (isset($_POST['idUserDelete'])) {
                $users = $this->getRepository('users')->delete($_POST['idUserDelete']);
                $this->redirect('/admin/users');
            }
        }

        return $this->render('admin/users/list_users.html.twig', [
            'users' => $users
        ]);
    }
}