<?php

namespace App\Controller\Admin\Answers;

use App\Models\Entity\Answers;
use App\Models\Repository\RepositoryTrait;
use App\Security\SecurityTrait;
use Framework\Controller\AbstractController;

class AdminAnswersController extends AbstractController
{
    use SecurityTrait, RepositoryTrait;
    
    public function __invoke(int $id): string
    {
        $this->ensureLoggedIn();

        $question = $this->getRepository('questions')->findOneBy('id', $id);
        $answers = $this->getRepository('answers')->findAllBy('question_id', $id);
        
        if (isset($_POST['addAnswers'])) {
            for ($i = 1; $i < count($_POST); $i++) {
                if (isset($_POST['answer'.$i])) {
                    $answer = new Answers();
                    $answer->setQuestion_Id($id);
                    $answer->setAnswer($_POST['answer'.$i]);
                    if(isset($_POST['is_correct'.$i])) { $answer->setIs_Correct(1); } else { $answer->setIs_Correct(0);}
                    $this->getRepository('answers')->insert($answer);

                    $this->redirect('/admin/question/'.$id);
                }
            }

        } elseif (isset($_POST['updateAnswers'])) {
            for ($i = 1; $i < count($_POST); $i++) {
                if (isset($_POST['answer'.$i])) {
                    $answer = new Answers();
                    $answer->setId($answers[$i-1]['id']); // On récupère le bon id
                    $answer->setQuestion_Id($id);
                    $answer->setAnswer($_POST['answer'.$i]);
                    if(isset($_POST['is_correct'.$i])) { $answer->setIs_Correct(1); } else { $answer->setIs_Correct(0);}
                    $this->getRepository('answers')->update($answer);
                    
                    $this->redirect('/admin/question/'.$id);
                }
            }
        }

        return $this->render('admin/answers/answers.html.twig', [
            'id' => $id,
            'question' => $question,
            'answers' => $answers
        ]);
    }
}