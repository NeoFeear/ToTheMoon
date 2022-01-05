<?php

namespace App\Controller\Quiz;

use App\Models\Entity\WsUser;
use App\Security\SecurityTrait;
use Ratchet\ConnectionInterface;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;
use Ratchet\WebSocket\MessageComponentInterface;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;




class QuizController extends AbstractController implements MessageComponentInterface {
    use SecurityTrait, RepositoryTrait;

    // TODO: Recupérer l'id de l'utilisateur qui est connecté    
    // TODO: Récupérer l'id de la room qui se trouve dans l'URL

    protected $clients;
    protected  array $rooms = [];
    protected $usersList = [];
    
    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function __invoke(string $roomId): string { 

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);


        $questions = $this->getRepository('questions')->findAll();

        $jsonQuestions = $serializer->serialize($questions, 'json');

    
        return $this->render('quiz/quiz.html.twig', [
            'roomId' => $roomId,
            'questions' => $jsonQuestions
        ]);
    }

// SERVER

// ========== FUNCTIONS SOCKET ==========
    public function onOpen(ConnectionInterface $conn) {
        echo "New connection with resourceId={$conn->resourceId}\n";


    }

    protected function sendToAllButMe(ConnectionInterface $me, $data) {
        /** @var WsUser $client */
        foreach ($this->clients as $client) {
            //Pour chaques client dans Clients,
            if ($client->getClient() !== $me) {
                $client->getClient()->send(json_encode($data));
            }
        }
    }

    protected function sendToRoom(string $roomId, $data) {
        $clients = $this->getClientsInRoom($roomId);

        /** @var WsUser $client */
        foreach ($clients as $client) {
            $client->getClient()->send(json_encode($data));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        /** @var WsUser $client */
        foreach ($this->clients as $client) {
            $roomId = $client->getRoomId();
            $clientUsername = $client->getUsername();

            if ($client->getClient() === $conn) {
                $this->clients->detach($client);
                echo "Connection {$conn->resourceId} has disconnected\n";
                echo "Connection {$clientUsername} has disconnected\n";
                echo "Connection {$roomId} has disconnected\n";

            }

            if($key = array_search($clientUsername, $this->usersList)){
                array_splice($this->usersList, $key, 1);
            }; 

            $this->sendToRoom($roomId, [
                'type' => 'usersList',
                'usersList' => $this->usersList,
                'countNow' => count($this->getClientsInRoom($roomId)),
                'countRequired' => count($this->rooms[$roomId]['users'])+1 
            ]);

        }

    }

    public function createroom(ConnectionInterface $conn, array $data) {
        $this->rooms[$data['roomId']] = $data;
    }

    public function joinroom(ConnectionInterface $conn, array $data) {
        $wsUser = new WsUser();
        $wsUser
            ->setClient($conn)
            ->setRoomId($data['roomId'])
            ->setUsername($data['username'])
            ->setUid($data['uid']);

        $this->clients->attach($wsUser);

        // If user already exist in array usersList, don't add him again
        if (!in_array($data['username'], $this->usersList)) {
            array_push($this->usersList, $data['username']);
        }

        $this->sendToRoom($data['roomId'], [
            'type' => 'usersList',
            'usersList' => $this->usersList,
            'countNow' => count($this->getClientsInRoom($data['roomId'])),
            'countRequired' => count($this->rooms[$data['roomId']]['users'])+1
        ]);
        
        if (count($this->getClientsInRoom($data['roomId'])) === count($this->rooms[$data['roomId']]['users'])+1) {
            $this->sendToRoom($data['roomId'], [ // sendToRoom envoi un evenement a la room spécifique 
                'type' => 'start-game',
                'allClientsId' => $this->rooms[$data['roomId']]['users']
            ]);
        }
    }

    public function onMessage(ConnectionInterface $conn, $msg) {
        $msg = json_decode($msg, true);

        if (!isset($msg['type'])) {
            echo 'Unknown message type!';
            return;
        }

        if (method_exists($this, $msg['type'])) {
            $method = $msg['type'];
            $this->$method($conn, $msg['data']);
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    /**
     * Retourne les clients qui sont dans la room
     */
    private function getClientsInRoom(string $roomId): array
    {
        $connections = [];

        /** @var WsUser $client */
        foreach ($this->clients as $client)
        {
            //Si le ROOMID du client est set a la ROOMID demandé, alors tu ajoutes au tableau connections
            if ($client->getRoomId() === $roomId) {
                $connections[] = $client;
            }
        }

        return $connections;
    }
}