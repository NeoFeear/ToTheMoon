<?php

use Framework\Routing\Route;

use App\Controller\Home\HomepageController;

use App\Controller\Users\UserLoginController;
use App\Controller\Users\UserRegisterController;
use App\Controller\Users\UserLogoutController;
use App\Controller\Users\UserProfileController;

use App\Controller\Questions\QuestionController;

use App\Controller\Admin\AdminHomepageController;
use App\Controller\Admin\Answers\AdminAnswersController;
use App\Controller\Admin\Users\AdminUsersController;
use App\Controller\Admin\Users\AdminEditUserController;

use App\Controller\Admin\Questions\AdminQuestionsController;
use App\Controller\Admin\Questions\AdminEditQuestionController;
use App\Controller\Quiz\QuizController;
use App\Controller\Room\InvitationController;

return [
    new Route('GET', '/', HomepageController::class),

    //GESTION UTILISATEURS
    new Route(['GET', 'POST'], '/register', UserRegisterController::class),
    new Route(['GET', 'POST'], '/login', UserLoginController::class),
    new Route('GET', '/logout', UserLogoutController::class),
    new Route(['GET', 'POST'], '/profile/{id}', UserProfileController::class),

    //DASHBOARD ADMINISTRATEUR
    new Route('GET', '/admin', AdminHomepageController::class),

    //ZONE ADMIN GESTION UTILISATEURS
    new Route(['GET', 'POST'], '/admin/users', AdminUsersController::class),
    new Route(['GET', 'POST'], '/admin/users/edit/{id}', AdminEditUserController::class),

    //ZONE ADMIN GESTION QUESTIONS
    new Route(['GET', 'POST'], '/admin/questions', AdminQuestionsController::class),
    new Route(['GET', 'POST'], '/admin/questions/edit/{id}', AdminEditQuestionController::class),
    new Route(['GET', 'POST'], '/admin/question/{id}', AdminAnswersController::class),
    new Route('GET', '/question/{id}', QuestionController::class),

    //PLAY ROOM
    new Route(['GET', 'POST'], '/play_room', InvitationController::class),

    //QUIZZ GAME
    new Route(['GET', 'POST'], '/game/{id}', QuizController::class)


    
];