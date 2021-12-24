<?php

namespace App\Controller\Users;

use App\Models\Manager\EntityManager;
use Framework\Controller\AbstractController;

class UserLoginController extends AbstractController
{
    public function __invoke(): string
    {
        if (isset($_SESSION['logged'])) {
            $this->redirect('/');
        }

        $em = EntityManager::create();

        if($this->isSubmited($_POST))
        {
            $selectedUser = $_POST['username'];
            $password = $_POST['password'];
            
            $userDB = $em->getRepository('users')->findOneBy('username', $_POST['username']);

            if($userDB) {

                if(($selectedUser == $userDB['username']) && (password_verify($password, $userDB['password']))) {
                    $_SESSION['logged'] = $userDB;
                    
                    if($userDB['role'] == 'ADMIN') {
                        $this->redirect('/admin');
                    } else {
                        $this->redirect('/');
                    }
                } else{
                    return $this->render('/user/login.html.twig', [
                        'error' => 'Identifiant ou mot de passe incorrect'
                    ]);
                }
                
            } else{
                return $this->render('/user/login.html.twig', [
                    'error' => 'Utilisateur inconnu'
                ]);
            }
        }

        return $this->render('user/login.html.twig');
    }
}