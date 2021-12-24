<?php

namespace App\Controller\Admin\Questions;

use App\Security\SecurityTrait;
use App\Models\Entity\Questions;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class AdminEditQuestionController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;
    
    public function __invoke(int $id): string
    {
        $this->ensureLoggedIn();

        $question = new Questions();
        $question->hydrate($this->getRepository('questions')->findOneBy('id', $id));

        if($this->isSubmited() && isset($_POST["envoi"])) {
            $question->hydrate($_POST);

            $this->getRepository('questions')->update($question);

            $this->redirect('/admin/questions');
        }

        return $this->render('admin/questions/editQuestion.html.twig', [
            'id' => $id ?? null,
            'question' => $question
        ]);
    }
}