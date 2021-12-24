<?php

namespace App\Controller\Users;

use App\Models\Entity\Users;
use App\Models\Manager\EntityManager;
use Framework\Controller\AbstractController;

class UserProfileController extends AbstractController
{
    public function __invoke(int $id)
    {
      if ($_SESSION['logged']) {
        if ($_SESSION['logged']['id'] != $id) {
          return $this->redirect('/profile/' . $_SESSION['logged']['id']);
        }
      } else {
        return $this->redirect('/login');
      }

      $em = new EntityManager();
      $user = new Users();
      $user->hydrate($em->getRepository('users')->findOneBy('id', $id));

      if($this->isSubmited() && isset($_POST["envoi"])) {
          $user->hydrate($_POST);

          $em->getRepository('users')->update($user);

          return $this->render('/user/profile.html.twig', [
              'user' => $user,
              'message' => 'Informations modifiées avec succès !',
              'type' => 'success'
          ]);
      }

      return $this->render('/user/profile.html.twig', [
        'user'=> $user
      ]);
    }
}