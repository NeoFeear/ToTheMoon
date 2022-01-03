<?php

namespace App\Controller\Quiz;

// require __DIR__.('/vendor/autoload.php');

use Framework\Controller\AbstractController;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use App\Models\Entity\Users;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use App\Quiz;


class QuizController extends AbstractController
{
  use SecurityTrait, RepositoryTrait;

  public function __invoke(int $id): string
  { 
    
    
    $roomId = $id;

    echo $id;

    // echo '<pre>';print_r($session_user); die;
    // Faire un curl pour recup l'id de la room
    // Envoyer un mail avec l'url 
    // ttm.io/game?roomId=4242
    // sur /game tu recup ton GET roomId
    // Dans le JS : Socket.io qui contacte le node : 127.0.0.1:8080/joinRoom/4242

    return $this->render('quiz/quiz.html.twig', [
      
    ]);

  }

  //FUNCTIONS SOCKET

  //OUVERTURE DE LA PAGE
  function onOpen(ConnectionInterface $conn) {
    // Store the new connection to send messages to later
    $currentUser = $_SESSION['logged'];
    $currentUser->attach($conn);
    echo "New connection! ({$conn->resourceId})\n";
    echo $conn;
  }

  //FERMETURE DE LA PAGE
  public function onClose(ConnectionInterface $conn) {
    // The connection is closed, remove it, as we can no longer send it messages
    $this->clients->detach($conn);

    echo "Connection {$conn->resourceId} has disconnected\n";
  }





}



//INSTANCIATION SERIALIZER AVEC CFG
// $encoders = [new JsonEncoder()];
// $normalizers = [new ObjectNormalizer()];
// $serializer = new Serializer($normalizers, $encoders);
  
// //SERIALIZE USER OBJECT EN JSON
// $jsonSessionUser = $serializer->serialize($sessionUser, 'json');