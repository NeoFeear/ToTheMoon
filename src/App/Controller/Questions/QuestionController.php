<?php

namespace App\Controller\Questions;

use App\Models\Entity\Answers;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class QuestionController extends AbstractController
{
    use RepositoryTrait;
    
    public function __invoke(int $id): string
    {
        $question = $this->getRepository('questions')->findOneBy('id', $id);
        $answers = $this->getRepository('answers')->findAllBy('question_id', $id);
        
        return $this->render('question/question.html.twig', [
            'id' => $id,
            'question' => $question,
            'answers' => $answers
        ]);
    }
}