<?php

namespace App\Controller\Users;

use Framework\Controller\AbstractController;

class UserLogoutController extends AbstractController
{
    public function __invoke()
    {
        session_destroy();
        $this->redirect('/');
    }
}
