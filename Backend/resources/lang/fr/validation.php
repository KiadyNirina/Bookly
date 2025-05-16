<?php

return [
    'accepted'             => 'Le champ :attribute doit être accepté.',
    'active_url'           => 'Le champ :attribute n\'est pas une URL valide.',
    'after'                => 'Le champ :attribute doit être une date postérieure au :date.',
    'after_or_equal'       => 'Le champ :attribute doit être une date postérieure ou égale au :date.',
    'alpha'                => 'Le champ :attribute doit seulement contenir des lettres.',
    'alpha_dash'           => 'Le champ :attribute doit seulement contenir des lettres, des chiffres et des tirets.',
    'alpha_num'            => 'Le champ :attribute doit seulement contenir des chiffres et des lettres.',
    'array'                => 'Le champ :attribute doit être un tableau.',
    'before'               => 'Le champ :attribute doit être une date antérieure au :date.',
    'before_or_equal'      => 'Le champ :attribute doit être une date antérieure ou égale au :date.',
    'between'              => [
        'numeric' => 'La valeur de :attribute doit être comprise entre :min et :max.',
        'file'    => 'La taille du fichier :attribute doit être comprise entre :min et :max kilo-octets.',
        'string'  => 'Le texte :attribute doit contenir entre :min et :max caractères.',
        'array'   => 'Le tableau :attribute doit contenir entre :min et :max éléments.',
    ],
    'confirmed'            => 'La confirmation de :attribute ne correspond pas.',
    'email'                => 'Le champ :attribute doit être une adresse e-mail valide.',
    'required'             => 'Le champ :attribute est obligatoire.',
    'unique'               => 'Le champ :attribute a déjà été pris.',
    'max'                  => [
        'string' => 'Le champ :attribute ne peut pas contenir plus de :max caractères.',
    ],
    'min'                  => [
        'string' => 'Le champ :attribute doit contenir au moins :min caractères.',
    ],
];
