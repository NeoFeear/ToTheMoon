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

        //
        //
        //
        //
        //
        //
        //
        //



      return $this->render('play_room/home.html.twig');
  }


}
