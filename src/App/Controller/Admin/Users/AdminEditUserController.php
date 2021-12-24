<?php

namespace App\Controller\Admin\Users;

use App\Models\Entity\Users;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class AdminEditUserController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;
    
    public function __invoke(int $id): string
    {
        $this->ensureLoggedIn();

        $user = new Users();
        $user->hydrate($this->getRepository('users')->findOneBy('id', $id));

        $loggedId = intval($_SESSION['logged']['id']);
        $userId = $user->getId();

        if($this->isSubmited() && isset($_POST["envoi"])) {
            $user->hydrate($_POST);
            if ($loggedId !== $userId) {
                if(isset($_POST['role'])) {
                    $user->setRole('ADMIN');
                } else {
                    $user->setRole('PLAYER');
                }
            }
            
            $this->getRepository('users')->update($user);
            $this->redirect('/admin/users');
        }

        return $this->render('admin/users/editUser.html.twig', [
            'id' => $id ?? null,
            'user' => $user
        ]);
    }
}