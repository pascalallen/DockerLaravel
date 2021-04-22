<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\ResetPasswordController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Mockery\MockInterface;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\Auth\ResetPasswordController
 */
class ResetPasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var ResetPasswordController */
    protected $controller;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockLogger = $this->mock(Logger::class);
        $this->controller = new ResetPasswordController($this->mockLogger);
    }

    public function test_that_reset_password_resets_given_users_password()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'id' => 1
        ]);
        $password = 'new-password';

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $this->controller->resetPassword($user, $password);

        $this->assertDatabaseHas('users', [
            'id' => $user->id
        ]);
    }
}
