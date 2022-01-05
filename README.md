# <p align="center">ToTheMoon<br/>Projet PHP</p>
## <p align="center">Par [Florian MARTIN](https://github.com/NeoFeear) et [Allan BREUIL](https://github.com/eSkAah)</p>

## Sommaire
1. [Introduction](#introduction)
2. [Comptes pré-créés](#comptes-pré-créés)
3. [Informations complémentaires](#informations-complémentaires)

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

## Lancement du serveur
Pour démarrer le serveur, il suffit d'exécuter la commande suivante :
`php bin/server.php`

## Comptes pré-créés
ADMINISTRATEUR :
- Pseudo : Admin
- Mot de passe : azer

JOUEUR :
- Pseudo : User
- Mot de passe : azer

## Informations complémentaires
Il n'y a des réponses que pour les trois premières questions pour le moment.