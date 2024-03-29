<?php

require dirname(__DIR__).'/vendor/autoload.php';

use App\Controller\Quiz\QuizController;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
        
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new QuizController()
        )
    ),
    8080
);

$server->run();