# <p align="center">ToTheMoon<br/>Projet PHP</p>
## <p align="center">Par [Florian MARTIN](https://github.com/NeoFeear) et [Allan BREUIL](https://github.com/eSkAah)</p>

## Sommaire
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Virtual Host](#virtual-host)
4. [Lancement du serveur](#lancement-du-serveur)
5. [Comptes pré-créés](#comptes-pré-créés)
6. [Comment lancer une partie](#comment-lancer-une-partie)
7. [Informations complémentaires](#informations-complémentaires)
8. [Technologies utilisées](#technologies-utilisées)

## Introduction
Le but de ce projet est le développement d’un jeu de plateau multijoueurs dans lequel le joueur répondra à des questions afin d’avancer en cas de bonne réponse ou de reculer en cas de mauvaise réponse.

Au moment de jouer, le joueur pourra choisir la difficulté de sa question.
- Niveau 1 : vert
- Niveau 2 : jaune
- Niveau 3 : bleu
- Niveau 4 : orange
- Niveau 5 : rouge
- Niveau 6 : noir

Lorsque le niveau est choisi, une question apparaît à l’écran dont la difficulté dépend de la couleur choisie. Vert étant la plus simple, noir la plus compliquée.

L’utilisateur devra répondre oralement à la question. Si la réponse est bonne, il avance d’autant de case que la difficulté (1 case pour vert, 6 case pour noir).

Le premier joueur à arriver sur la case finale remporte la partie. Les autres joueurs continuent jusqu’à ce qu’il y ait un perdant de la partie. Le nombre de cases est fixé à 48.

Le jeu pourra être joué de deux à six joueurs. Un compte sur la plateforme est nécessaire pour démarrer une partie. Au moment de jouer, tous les joueurs sont sur leurs propres terminaux (smartphone, tablette ou pc).

Le premier joueur initie la partie en renseignant les pseudos des autres joueurs. Une fois le formulaire de démarrage de partie envoyé, un QR code est généré pour chaque joueur. S’ils sont dans la même pièce, ils pourront scanner le QR Code afin d’arriver sur la page de la partie. Dans le cas contraire, le joueur maître pourra leur envoyer le lien en cliquant sur un bouton “Envoyer le lien par mail”. Vu que le joueur est déjà inscrit sur la plateforme, le lien lui sera envoyé par mail.


## Installation

- Placer le dossier du projet dans votre dossier `C:\wamp64\www`.
- Utilisez le fichier .sql qui se trouve dans le projet et l'importer dans votre PHPMYADMIN.
- Ouvrez le projet dans votre IDE ( Vscode / Php Storm etc...)
- Entrer dans le terminal `composer i ` afin d'installer les différents modules nécessaire au bon fonctionnement de l'application.
- Entrez les informations de votre base de données dans /config/app.php.
- Démarrez le serveur.
- Connectez vous avec le compte `Admin` cliquez sur #JOUER!, invitez vos amis, et que le meilleur gagne. 

Let's play!

## Virtual Host

Pour faire fonctionner notre projet qui est en PHP nous avons utilisé  WAMP64 et crée un Virtual Host, pour cela suivez les étapes suivantes :

- Démarrez votre WAMP64.
- Ensuite allez dans votre navigateur et tappez dans l'url `http://localhost/` ou `http://127.0.0.1/`;
- En bas a gauche cliquez sur `Ajouter un Virtual Host`.
- Dans l'input : `Nom du Virtual Host` entrez l'url que vous souhaitez utiliser pour vous connecter a votre site, nous utiliserons `ttm.io`.
- Dans l'input : `Chemin absolu du dossier` ciblez le dossier `public` de notre projet donc si vous avez suivis ce guide : `C:\wamp64\www\tothemoon\public` .
- Redémarrez votre WAMP64.

Voila ! vous êtes prêt à passer a l'étape suivante.

## Lancement du serveur

Pour démarrer le serveur, il suffit d'exécuter la commande suivante :
`php bin/server.php`

## Comptes pré-créés

ADMINISTRATEUR :
- Pseudo : Admin
- Mot de passe : azer

JOUEUR 1 :
- Pseudo : Player1
- Mot de passe : azer

JOUEUR 2 :
- Pseudo : Player2
- Mot de passe : azer

JOUEUR 3 :
- Pseudo : Player3
- Mot de passe : azer

JOUEUR 4 :
- Pseudo : Player4
- Mot de passe : azer

JOUEUR 5 :
- Pseudo : Player5
- Mot de passe : azer

## Comment lancer une partie 

- Connectez vous avec le compte `Admin`.
- Cliquez sur le bouton dans la barre de navigation `JOUER!`.
- Entrez le pseudo EXACTE de vos amis dans les inputs, et choisissez leur une couleur.
- Vos amis reçoivent un Email qui les redirigent dans la room.
- Vous pouvez aussi faire en sorte qu'ils scannent le `QRcode` de la salle d'attente pour vous rejoindre.

La partie commence, bon jeu !

## Informations complémentaires

Ce projet a été très formateur pour nous deux, malgrès la frustration de ne pas avoir un résultat abouti comme souhaité, nous ne pouvons pas être déçu car notre investissement a été maximum dans ce projet.

#Difficultés majeures rencontrés : 

- Nous avons décidé de développer un système de Repository/Entity/EntityManager inspiré de Symfony qui nous a pris pas mal de temps a reproduire, mais qui nous a ensuite fait gagner du temps lors de nos requêtes dans les Controllers.

- Nous avions commencé la partie Websocket avec un coté serveur sur Node.js/Express/Socket.io, qui fonctionnait bien, mais en passant uniquement par la partie client. A 3 jours de rendre le projet, nous avons modifié la technologie utilisée pour Ratchet qui nous a mis en difficulté, car la Documentation de Ratchet n'est pas non plus des plus précises, la library la plus connue n'est plus maintenu, et Socket.io dominant les projets Websocket, la communauté autour de Ratchet n'est pas très présente sur le Web. De plus notre manque de compétence initiale en Websocket a fait que nous avons appris "lentement" et perdu du temps, mais nous avons appris, et améliorer nos compétences d'analyse et de réflexion. 

## Ce qui fonctionne : 
- Le système d'Administartion.
- La navigation sur le site.
- L'inscription et la gestion de l'espace membre.
- le CRUD Questions / Utilisateurs.
- L'invitation des joueurs en fonction des rôles.
- Le choix des couleurs des joueurs (améliorable, dans le code et dans l'utilisation).
- L'invitation via QR Code.
- Invitation par Email automatique.
- Gestion d'attribution des couleurs 
- Le système de jeu en ligne.
- Gestion des Rooms aléatoires, et sécurisation des joueurs attendus.
- Autocomplétion lors de l'invitation des joueurs

## Ce qui ne fonctionne pas ou partiellement :
- Gestion d'aller-retour des utilisateurs dans une Room (améliorable++)
- Plateau de jeu (Améliorable++) adapté en fonction du temps restant
- Autocomplétion des joueurs à inviter
- La partie serveur du Socket est améliorable.
- C'est l'admin qui choisis les couleurs et pas les joueurs.

# Tâches de chaque membre du groupe

Lors du développement du projet, nous avons su travailler de manière complémentaire, souvent en présentiel ou sur Discord en double partage d'écran pour s'aider en direct lors du développement. Peu de parties du projet ont été réalisées uniquement par un seul des deux développeurs.

## Première partie du projet : 

- Florian : 
  -> Partie Front et mise en place des vues Twig.
  -> M'a Rejoint développement de la partie Back end Repo/Entity/EM.
  -> CRUD Question.
  -> CRUD Réponses.
  
- Allan : 
  -> Développement de la partie Back end Repo/Entity/EM.
  -> CRUD Utilisateurs.
  
## Deuxième partie du Projet :
  
 - Florian : 
  -> Développement du jeu en JavaScript.
  -> Autocomplétion formulaire d'invitations.
  -> Intégration du jeu dans le projet, et avec le Socket.
  
 - Allan : 
  -> Développement partie Serveur NodeJs/Express/Socket.io Fonctionnel ( Arreté lorsque les utilisateurs étaient dans une même room).
  -> Envoi des Mail avec PHPMailer.
  -> Input de sélection des couleurs pour les joueurs.
  -> Formulaire d'invitation des joueurs.
  -> Développement partie Serveur Ratchet Websocket.
  
  
  ## Technologies utilisées:
- Bootstrap 5
- PHP v8.0.13
- Websocket Ratchet v0.4.4
- Textalk Websocket v1.5
- Twig
- Javascript
- MySQL
- GitHub
- PHPMailer v6.5
- Serializer v5.4
- Fastroute 1.3
- WAMP v3.2.5
- Apache v2.4.5
- Composer