<?php

namespace App\Controller\Quiz;

// require __DIR__.('/vendor/autoload.php');

use Framework\Controller\AbstractController;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use App\Models\Entity\Users;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class QuizController extends AbstractController
{
  use SecurityTrait, RepositoryTrait;

  public function __invoke(): string
  { 
    $this->ensureLoggedIn();

    //SERIALIZER CONFIG
    $encoders = [new JsonEncoder()];
    $normalizers = [new ObjectNormalizer()];
    $serializer = new Serializer($normalizers, $encoders);

    $users = new Users();
    $sessionUser = $_SESSION['logged'];

    $users = $this->getRepository('users')->findAll();

    //SERIALIZE USER OBJECT EN JSON
    $jsonSessionUser = $serializer->serialize($sessionUser, 'json');

    // echo '<pre>';print_r($session_user); die;
        // Faire un curl pour recup l'id de la room
        
        // Envoyer un mail avec l'url 
        // ttm.io/game?roomId=4242&uid=4

        // sur /game tu recup ton GET roomId
        // Dans le JS : Socket.io qui contacte le node : 127.0.0.1:8080/joinRoom/4242

      return $this->render('quiz/quiz.html.twig', [
        'users' => $users,
        'session_user' => $jsonSessionUser,
      ]);
  }

}
