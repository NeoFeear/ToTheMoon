<?php

namespace App\Controller\Quiz;

use App\Models\Entity\WsUser;
use App\Security\SecurityTrait;
use Ratchet\ConnectionInterface;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;
use Ratchet\WebSocket\MessageComponentInterface;

class QuizController extends AbstractController implements MessageComponentInterface {
    // use SecurityTrait, RepositoryTrait;

    //Recupérer l'id de l'utilisateur qui est connecté
    //Récupérer l'id de la room qui se trouve dans l'URL


    protected $clients;
    protected  $rooms = [];

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function __invoke(string $roomId): string {       
        return $this->render('quiz/quiz.html.twig', [
            'roomId' => $roomId,

        ]);
    }

// ========== FUNCTIONS SOCKET ==========
    public function onOpen(ConnectionInterface $conn) {
        echo "New connection with resourceId={$conn->resourceId}\n";
    }

    protected function sendToAllButMe(ConnectionInterface $me, $data)
    {
        /** @var WsUser $client */
        foreach ($this->clients as $client) {
            if ($client->getClient() !== $me) {
                $client->getClient()->send(json_encode($data));
            }
        }
    }

    protected function sendToRoom(int $roomId, $data)
    {
        $clients = $this->getClientsInRoom($roomId);

        /** @var WsUser $client */
        foreach ($clients as $client) {
            $client->getClient()->send(json_encode($data));
        }
    }


    public function onClose(ConnectionInterface $conn) {
        /** @var WsUser $client */
        foreach ($this->clients as $client) {
            if ($client->getClient() === $conn) {
                $this->clients->detach($client);
                echo "Connection {$conn->resourceId} has disconnected\n";
            }
        }
    }

    public function createroom(ConnectionInterface $conn, array $data)
    {
        $this->rooms[$data['roomId']] = $data;
    }

    public function joinroom(ConnectionInterface $conn, array $data)
    {
        $wsUser = new WsUser();
        $wsUser
            ->setClient($conn)
            ->setRoomId($data['roomId'])
            ->setUid($data['uid']);

        $this->clients->attach($wsUser);

        
        if (count($this->getClientsInRoom($data['roomId'])) === count($this->rooms[$data['roomId']]['users'])) {
            $this->sendToRoom($data['roomId'], [
                'type' => 'start-game'
            ]);
        }

        $this->sendToAllButMe($conn, 'Bonjour je suis ' . $wsUser->getUid());
        
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

    private function getClientsInRoom(int $roomId): array
    {
        $connections = [];

        /** @var WsUser $client */
        foreach ($this->clients as $client)
        {
            if ($client->getRoomId() === $roomId) {
                $connections[] = $client;
            }
        }

        return $connections;
    }
}