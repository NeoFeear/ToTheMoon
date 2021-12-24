<?php

namespace Framework\Controller;

use Framework\Templating\Twig;

session_start();
abstract class AbstractController
{
    public function render(string $template, array $args = []): string
    {
        $twig = new Twig();

        return $twig->render($template, $args);
    }

    public function isSubmited():bool
    {
        return !empty($_POST);

    }

    public function redirect(string $uri):void
    {
        header('Location:' . $uri);
    }

    public function formCheck($data)
    {
        $errors =[]; //Initialisation d'un tableau d'erreurs

        //Définition des conditions de validations requis pour chaques champs du formulaire
        $validations = [
            'username' => [
                'rules' => [
                    ['name' => 'required'],
                    ['name' => 'maxlength', 'value' => 25],
                    ['name' => 'isValideUsername'],
                ]
            ],

            'firstName' => [
                'rules' => [
                    ['name' => 'required'],
                    ['name' => 'maxlength', 'value' => 50],
                    ['name' => 'isString']
                ]
            ],


            'lastName' => [
                'rules' => [
                    ['name' => 'required'],
                    ['name' => 'maxlength', 'value' => 50],
                    ['name' => 'isString'],
                ]
            ],

            'email' => [
                'rules' => [
                    ['name' => 'required'],
                    ['name' => 'maxlength', 'value' => 100],
                    ['name' => 'email']
                ]
            ],
            
            'password' => [
                'rules' => [
                    ['name' => 'required'],
                    ['name' => 'maxlength', 'value' => 100]
                ]
            ],

            'password_confirm' => [
                'rules' => [
                    [
                        'name' => 'sameAs',
                        'field' => 'password',
                        'errorMessage' => 'Les mots de passe doivent correspondre'
                    ],
                ]
            ]
        ];

        //Création des conditions de validations et vérification de tous les champs par rapports aux règles définis 
        foreach ($validations as $fieldName => $params) {
            foreach ($params['rules'] as $rule) {
                
                switch ($rule['name']) {

                    case 'required':
                        if (empty($data[$fieldName])) {
                            $errors[$fieldName] = 'Le champs est obligatoire !';
                        }; 
                    break;

                    case 'maxlength':
                        if (strlen($data[$fieldName]) > $rule['value']) {
                            $errors[$fieldName] = 'La valeur du champs ne doit pas dépasser ' .$rule['value'].' caractères !';
                        }; 
                    break;

                    case 'isValideUsername':
                        if (!is_string($data[$fieldName]) || !preg_match('/^[a-zA-ZzÀ-ÿ0-9 .\-]+$/i', $data[$fieldName])) {
                            $errors[$fieldName] = "Veuillez entrer une chaine de caractères !";
                        }; 
                    break;

                    case 'isString':
                        if (!is_string($data[$fieldName]) || !preg_match('/^[a-zA-ZzÀ-ÿ .\-]+$/i', $data[$fieldName])) {
                            $errors[$fieldName] = "Veuillez entrer une chaine de caractères !";
                        }; 
                    break;

                    case 'email':
                        if (!filter_var($data[$fieldName], FILTER_VALIDATE_EMAIL)) {
                            $errors[$fieldName] = "Veuillez entrer une adresse email valide !";
                        }; 
                    break;

                    case 'sameAs':
                    if ($_POST[$fieldName] !== $data[$rule['field']]) {
                        $errors[$fieldName] = $rule['errorMessage'];
                    }; 
                    break;
                }
            }
        }

        return $errors;
    }
}