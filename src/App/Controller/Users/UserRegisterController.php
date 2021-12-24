<?php

namespace App\Controller\Users;

use App\Models\Entity\Users;
use App\Models\Manager\EntityManager;
use Framework\Controller\AbstractController;

class UserRegisterController extends AbstractController
{
    public function __invoke(): string
    {
        date_default_timezone_set('Europe/Paris');

        if (isset($_SESSION['logged'])) {
            return $this->redirect('/');
        }

        //Si le formulaire est envoyé
        if($this->isSubmited()){
            $errors = $this->formCheck($_POST);

            if(empty($errors)){
                $em = EntityManager::create(); //Creation de la connection avec la base de données.

                $user = new Users();
                $user->hydrate($_POST);
                $user->setPassword(password_hash($_POST["password"], PASSWORD_BCRYPT));
                $user->setRole("PLAYER");     
                

                $em->getRepository('users')->insert($user); //Ajout en base de données dans la table selectionnée
                
                return $this->render('user/register.html.twig', [
                    'message' => 'Votre compte a bien été créé !',
                    'type' => 'success'
                ]);

            }else{

                return $this->render('user/register.html.twig', [
                    'error_password' => $errors['password_confirm'] ?? '',
                    'error_username' => $errors['username'] ?? '' ,
                    'error_firstName' => $errors['firstName'] ?? '',
                    'error_lastName' => $errors['lastName'] ?? '',
                    'error_email' => $errors['email'] ?? '',
                    'type' => 'danger'
                ]);            
            }
     
        }

        return $this->render('user/register.html.twig');
    }
}