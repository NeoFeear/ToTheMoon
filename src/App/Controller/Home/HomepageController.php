<?php
//Faire un dossier Home
namespace App\Controller\Home;

use Framework\Controller\AbstractController;
use WebSocket\Client;

class HomepageController extends AbstractController
{
    public function __invoke(): string
    { 
 

        return $this->render('home.html.twig');
    }
}