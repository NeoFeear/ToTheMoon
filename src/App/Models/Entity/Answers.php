<?php

namespace App\Models\Entity;

use App\Models\Model;

class Answers extends Model
{
    private $id;
    private $question_id;
    private $answer;
    private $is_correct;

    // ID
    public function getId(){
        return $this->id;
    }
    public function setId($id){
        $this->id = $id;
    }

    // Question ID
    public function getQuestion_Id(){
        return $this->question_id;
    }
    public function setQuestion_Id($question_id){
        $this->question_id = $question_id;
    }

    // Answer
    public function getAnswer(){
        return $this->answer;
    }
    public function setAnswer($answer){
        $this->answer = $answer;
    }

    // Is correct
    public function getIs_Correct(){
        return $this->is_correct;
    }
    public function setIs_Correct($is_correct){
        $this->is_correct = $is_correct;
    }
}
