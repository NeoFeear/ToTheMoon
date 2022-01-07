<?php

namespace App\Models\Entity;

use Ratchet\ConnectionInterface;

class WsUser
{
    protected $client;
    protected int $uid;
    protected string $username;
    protected string $roomId;

    public function getClient(): ConnectionInterface
    {
        return $this->client;
    }

    public function setClient(ConnectionInterface $client): WsUser
    {
        $this->client = $client;
        return $this;
    }

    public function getUid(): int
    {
        return $this->uid;
    }

    public function setUid(int $uid): WsUser
    {
        $this->uid = $uid;
        return $this;
    }

    public function getRoomId(): string
    {
        return $this->roomId;
    }

    public function setRoomId(string $roomId): WsUser
    {
        $this->roomId = $roomId;
        return $this;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): WsUser
    {
        $this->username = $username;
        return $this;
    }


    


    


}