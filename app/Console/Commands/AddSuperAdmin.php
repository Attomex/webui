<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AddSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'add:superadmin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add the first super admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Проверяем, существует ли уже супер-админ
        if (User::where('role', 'Super Admin')->exists()) {
            $this->error('Super admin already exists!');
            return Command::FAILURE;
        }

        // Запрашиваем данные у пользователя
        $name = $this->ask('What is your name?');
        $email = $this->ask('What is your email?');
        $password = $this->secret('What is the password?');

        // Создаем нового пользователя с ролью Super Admin
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'SuperAdmin',
        ]);

        $this->info('Super admin created successfully!');
        return Command::SUCCESS;
    }    
}
