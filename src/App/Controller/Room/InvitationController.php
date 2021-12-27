<?php

namespace App\Controller\Room;

use Framework\Controller\AbstractController;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use App\Models\Entity\Users;

class InvitationController extends AbstractController
{
  use SecurityTrait, RepositoryTrait;

  public function __invoke(): string
  { 
    $this->ensureLoggedIn();
    $users = new Users();
    $users = $this->getRepository('users')->findAll();

        $users = new Users();
        $users = $this->getRepository('users')->findAll();

        // Faire un curl pour recup l'id de la room
        // Envoyer un mail avec l'url 
        // ttm.io/game?roomId=4242&uid=4

        // sur /game tu recup ton GET roomId
        // Dans le JS : Socket.io qui contacte le node : 127.0.0.1:8080/joinRoom/4242

      return $this->render('play_room/home.html.twig', [
        'users' => $users
      ]);
  }

}
