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
    $errors = '';

    //Récupération de tous les utilisateurs pour autocomplétion
    $users = new Users();
    $users = $this->getRepository('users')->findAll();

    $user = $_SESSION['logged'];

    // A la validation du formulaire : ----------------
    if($this->isSubmited()){

      //VARIABLES GLOBALES
      $invitedPlayers = [];
      $invitedPlayersId = [];
      $randomId = '';
      
      $uri = 'ttm.io/game/';

      //GENERER UN ID ALEATOIRE
      for($i = 0; $i < 5; $i++){
        $randomId .=  rand(0,9);
        $randomId .= chr(rand(97,122));
      }
      
      $uri .= $randomId;

      //RECUPERATION DES UTILISATEURS/ID INVITES ET STOCKAGE DANS UN TABLEAU
      foreach($_POST as $player ){

        $tmpUser = $this->getRepository('users')->findOneBy('username', $player);

        if($player !== "" && $tmpUser !== false){
          array_push($invitedPlayers, $tmpUser);
          array_push($invitedPlayersId, $tmpUser['id']);
        }else{
          $errors = 'Aucun utilisateur';
        }

      }

      //ENVOI DU MAIL AUX UTILISATEURS AVEC LIEN DE LA ROOM
      if(count($invitedPlayers) >= 2) {

        foreach($invitedPlayers as  $player){

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
          $mail->addAddress($player['email'], 'John Doe');
          $mail->Body    = 'Cliquez sur ce <a href="'. $uri . '">lien</a> pour rejoindre la room !<br> l\'ID de la room est : ' . $randomId;
          //Set the subject line
          $mail->Subject = 'Vous êtes invité à jouer une partie de ToTheMoon';
          //Replace the plain text body with one created manually
          $mail->AltBody = 'This is a plain-text message body';
  
          //send the message, check for errors
          if (!$mail->send()) {
            $errors = $mail->ErrorInfo;
          } else {
            $errors = 'Message envoyé !';
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
          'users' => $invitedPlayersId
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
      'errors' => $errors
    ]);

  }

}
