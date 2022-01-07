<?php

namespace App\Controller\Room;

use Framework\Controller\AbstractController;
use App\Security\SecurityTrait;
use App\Models\Repository\RepositoryTrait;
use App\Models\Entity\Users;
use PHPMailer\PHPMailer\PHPMailer;
use WebSocket\Client;

class InvitationController extends AbstractController {
    use SecurityTrait, RepositoryTrait;

    public function __invoke(): string {
        $this->ensureLoggedIn();
        $errors = '';

        // Récupération de tous les utilisateurs pour autocomplétion
        $users = new Users();
        $users = $this->getRepository('users')->findAll();
        

        // A la validation du formulaire : ----------------
        if ($this->isSubmited()) {
            //VARIABLES GLOBALES
            //Invitation automatique de l'admin dans les users invités
            $randomId = '';
            $uri = 'ttm.io/game/';
            $invitedPlayers = [$_SESSION['logged']];
            $invitedPlayers[0]['color'] = 'teal';
            
 
            //GENERER UN ID ALEATOIRE
            for ($i = 0; $i < 5; $i++) {
                $randomId .= rand(0, 9);
                $randomId .= chr(rand(97, 122));
            }

            //Génération de l'url avec la ROOMID
            $uri .= $randomId;
            
            //RECUPERATION DES UTILISATEURS/ID INVITES ET STOCKAGE DANS UN TABLEAU
            //Récupération des couleurs en plus pour les push dans l'array de chaques users

            for($i = 1; $i < count($_POST)-1; $i++) 
            {
                if (!empty($_POST['player'.$i])) 
                {
                    //Faisable plus facilement en JS merci la fatigue.
                    if(!isset($_POST['color'.$i]) || $_POST['player'.$i] == ''){
                        $errors = 'Utilisateur introuvable, ou veuillez selectionner une couleur.';
                        return $this->render('play_room/home.html.twig', [
                            'errors' => $errors
                        ]);
                    }
                    
                    $player = $_POST['player'.$i];
                    $color = $_POST['color'.$i];
                    $tmpUser = $this->getRepository('users')->findOneBy('username', $player); 
                    $tmpUser['color'] = $color; 
                    array_push($invitedPlayers, $tmpUser);

                } else {
                    
                }
            }

            // echo '<pre>';print_r($invitedPlayers);die;
            //ENVOI DU MAIL AUX UTILISATEURS AVEC LIEN DE LA ROOM
            if (count($invitedPlayers) >= 2) {
                foreach($invitedPlayers as $player) {
                    $mail = new PHPMailer();
                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com';
                    $mail->Port = 465;
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                    $mail->SMTPAuth = true;
                    $mail->Username = 'test.symfony57155@gmail.com';
                    $mail->Password = 'neofear57';
                    $mail->setFrom('test.symfony57155@gmail.com', 'First Last');
                    $mail->addAddress($player['email'], 'John Doe');
                    $mail->Body = 'Cliquez sur ce <a href="'.$uri.'">lien</a> pour rejoindre la room !<br> l\'ID de la room est : '.$randomId;
                    $mail->Subject = 'Vous êtes invité à jouer une partie de ToTheMoon';
                    $mail->AltBody = 'This is a plain-text message body';

                    if (!$mail->send()) {
                        $errors = $mail->ErrorInfo;
                    } else {
                        $errors = 'Message envoyé !';
                    }
                }

                // echo '<pre>';print_r($invitedPlayers);die;

                 //Envoi un message au Serveur de création de la room
                $client = new Client("ws://127.0.0.1:8080/");
                $client->text(json_encode([
                    'type' => 'createroom',
                    'data' => [
                        'roomId' => $randomId,
                        'users' => $invitedPlayers
                    ]
                ]));

                $client->close();

                return $this->redirect('/game/'.$randomId);

            } else {
                $errors = "Hey ! Passe a la teverne pour chercher des amis et reviens !";

                return $this->render('play_room/home.html.twig', [
                    'errors' => $errors
                ]);
                
            }

        }

        return $this->render('play_room/home.html.twig', [
            'users' => $users,
        ]);
    }
}