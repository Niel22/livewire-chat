<?php

namespace App\Action\User;

use App\Models\User;
use Faker\Factory as Faker;

class CreateSubAccount{

    public function execute(array $request): bool
    {

        $faker = Faker::create();

        $request['email'] = $faker->unique()->safeEmail();
        $request['password'] = $faker->password(8);

        $user = User::create($request);

        if($user){
            return true;
        }

        return false;
    }
}