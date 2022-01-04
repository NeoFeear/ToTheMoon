<?php

namespace App\Models\Entity;

use Ratchet\ConnectionInterface;

class WsUser
{
    protected ConnectionInterface $client;

    protected int $uid;
    protected int $roomId;

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

    public function getRoomId(): int
    {
        return $this->roomId;
    }

    public function setRoomId(int $roomId): WsUser
    {
        $this->roomId = $roomId;
        return $this;
    }
}