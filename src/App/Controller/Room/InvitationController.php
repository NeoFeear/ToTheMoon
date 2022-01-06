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
            $invitedPlayers = [$_SESSION['logged']];
            $randomId = '';

            $uri = 'ttm.io/game/';

            //GENERER UN ID ALEATOIRE
            for ($i = 0; $i < 5; $i++) {
                $randomId .= rand(0, 9);
                $randomId .= chr(rand(97, 122));
            }

            $uri .= $randomId;

            //RECUPERATION DES UTILISATEURS/ID INVITES ET STOCKAGE DANS UN TABLEAU
            foreach($_POST as $player) {
                
                $tmpUser = $this->getRepository('users')->findOneBy('username', $player);
                

                if (!empty($player) && $tmpUser !== false) {
                    array_push($invitedPlayers, $tmpUser);
                } else {
                    $errors = 'Aucun utilisateur';
                }
            }

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
            } else {
                $errors = "Vous ne pouvez pas jouer tout seul ABRUTI VA!";
            }

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
        }

        return $this->render('play_room/home.html.twig', [
            'users' => $users,
            'errors' => $errors
        ]);
    }
}