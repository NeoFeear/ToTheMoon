<?php

namespace App\Security;

trait SecurityTrait
{
    public function ensureLoggedIn()
    {
        if (!$_SESSION['logged'] || $_SESSION['logged']['role'] != "ADMIN") {
            return $this->redirect('/login');
        }
    }
}