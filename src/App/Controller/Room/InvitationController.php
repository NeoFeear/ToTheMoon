<?php

namespace App\Controller\Room;

use Framework\Controller\AbstractController;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use App\Models\Entity\Users;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use WebSocket\Client;


class InvitationController extends AbstractController
{
  use SecurityTrait, RepositoryTrait;

  public function __invoke(): string
  { 
    $this->ensureLoggedIn();
    //Récupération de tous les utilisateurs pour autocomplétion
    $users = new Users();
    $users = $this->getRepository('users')->findAll();

    $user = $_SESSION['logged'];

    // A la validation du formulaire : ----------------
    if($this->isSubmited()){

      //VARIABLES GLOBALES
      $invitedPlayersEmail = [];
      $randomId = '';
      $errors = '';
      $uri = 'ttm.io/game/';

      //GENERER UN ID ALEATOIRE
      for($i = 0; $i < 5; $i++){
        $randomId .=  rand(0,9);
        $randomId .= chr(rand(97,122));
      }
      
      $uri .= $randomId;

     

      //RECUPERATION DES EMAILS DE TOUS LES UTILISATEURS ET STOCKAGE DANS UN TABLEAU
      foreach($_POST as $player ){
        
        if($player !== ""){
          $tmpUser = $this->getRepository('users')->findOneBy('username', $player);
          array_push($invitedPlayersEmail, $tmpUser['email']);
        }
     
      }

      if(count($invitedPlayersEmail) >= 2) {
        foreach($invitedPlayersEmail as $email){
          //Create a new PHPMailer instance
          $mail = new PHPMailer();
          //Tell PHPMailer to use SMTP
          $mail->isSMTP();
          $mail->Host = 'smtp.gmail.com';
          //Set the SMTP port number:
          // - 465 for SMTP with implicit TLS, a.k.a. RFC8314 SMTPS or
          $mail->Port = 465;
          //Set the encryption mechanism to use:
          // - SMTPS (implicit TLS on port 465) or
          $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
          //Whether to use SMTP authentication
          $mail->SMTPAuth = true;
          //Username to use for SMTP authentication - use full email address for gmail
          $mail->Username = 'test.symfony57155@gmail.com';
          //Password to use for SMTP authentication
          $mail->Password = 'neofear57';
          $mail->setFrom('test.symfony57155@gmail.com', 'First Last');
          //Set who the message is to be sent to
          $mail->addAddress($email, 'John Doe');
          $mail->Body    = 'Cliquez sur ce lien '. $uri . 'pour rejoindre la room !';
          //Set the subject line
          $mail->Subject = 'Vous êtes invité à jouer une partie de ToTheMoon';
          //Replace the plain text body with one created manually
          $mail->AltBody = 'This is a plain-text message body';
  
          //send the message, check for errors
          if (!$mail->send()) {
              echo 'Mailer Error: ' . $mail->ErrorInfo;
          } else {
              echo 'Message sent!';
              
          }        
        }
      }else{
        $errors = "Vous ne pouvez pas jouer tout seul ABRUTI VA!";
      }
      
      //Envoi un message au Serveur de création de la room
      $client = new Client("ws://127.0.0.1:8080/");
      $client->text(json_encode([
        'type' => 'createroom',
        'data' => [
          'roomId' => $randomId,
          'users' => [42, 43]
        ]
      ]));

      $client->close();

    }
    
    
    // Envoyer un mail avec l'url 



    
    // ttm.io/game/4242
    // sur /game tu recup ton GET roomId et UserID
    // Dans le JS : Socket.io qui contacte le node : 127.0.0.1:8080/joinRoom/4242

    return $this->render('play_room/home.html.twig', [
      'users' => $users,
      'error' => $errors
    ]);

  }

}
