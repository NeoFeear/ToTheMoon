<?php

namespace App\Controller\Admin\Questions;

use App\Security\SecurityTrait;
use App\Models\Entity\Questions;
use App\Models\Repository\RepositoryTrait;
use Framework\Controller\AbstractController;

class AdminQuestionsController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;

    public function __invoke(): string
    {
        $this->ensureLoggedIn();

        $questions = new Questions();
        $questions = $this->getRepository('questions')->findAll();

        if($this->isSubmited()) {
            if (isset($_POST['addQuestion'])) {
                $question = new Questions();
                $question->hydrate($_POST);
                $question->setLevel(intval($_POST['level']));
                $question = $this->getRepository('questions')->insert($question);
                $this->redirect('/admin/questions');

            } elseif (isset($_POST['idQuestionEdit'])) {
                $this->redirect('/admin/questions/edit/' . $_POST['idQuestionEdit']);

            } elseif (isset($_POST['idQuestionDelete'])) {
                $questions = $this->getRepository('answers')->deleteWhere('question_id', $_POST['idQuestionDelete']);
                $questions = $this->getRepository('questions')->delete($_POST['idQuestionDelete']);
                $this->redirect('/admin/questions');
            }
        }

        return $this->render('admin/questions/list_questions.html.twig', [
            'questions' => $questions
        ]);
    }
}