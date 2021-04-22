<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\API;

use App\Http\Controllers\API\SetPasswordController;
use App\Http\Requests\SetPasswordRequest;
use App\Models\PasswordReset;
use App\Models\User;
use App\Repositories\PasswordResetRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Illuminate\Support\Carbon;
use Mockery\MockInterface;
use Symfony\Component\HttpFoundation\Request;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\API\SetPasswordController
 */
class SetPasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var SetPasswordController */
    protected $controller;
    /** @var PasswordResetRepositoryInterface|MockInterface */
    protected $mockPasswordResetRepository;
    /** @var UserRepositoryInterface|MockInterface */
    protected $mockUserRepository;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockPasswordResetRepository = $this->mock(PasswordResetRepositoryInterface::class);
        $this->mockUserRepository = $this->mock(UserRepositoryInterface::class);
        $this->mockLogger = $this->mock(Logger::class);
        $this->controller = new SetPasswordController(
            $this->mockPasswordResetRepository,
            $this->mockUserRepository,
            $this->mockLogger
        );
    }

    public function test_that_handle_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var PasswordReset $passwordReset */
        $passwordReset = PasswordReset::factory()->create([
            'email' => $user->email
        ]);

        $request = new SetPasswordRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'set_password_token'    => $passwordReset->token
        ]);

        $this->mockPasswordResetRepository
            ->shouldReceive('getByToken')
            ->once()
            ->withArgs(function (string $token) use ($passwordReset) {
                return $token === $passwordReset->token;
            })
            ->andReturn($passwordReset);

        $this->mockUserRepository
            ->shouldReceive('getByEmailAddress')
            ->once()
            ->withArgs(function (string $emailAddress) use ($user) {
                return $emailAddress === $user->email;
            })
            ->andReturn($user);

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->handle($request);

        static::assertTrue($response->isSuccessful());
    }

    public function test_that_handle_returns_error_when_token_is_invalid()
    {
        $request = new SetPasswordRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'set_password_token'    => 'invalid-token'
        ]);

        $this->mockPasswordResetRepository
            ->shouldReceive('getByToken')
            ->once()
            ->withArgs(function (string $token) {
                return $token === 'invalid-token';
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->handle($request);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'Invalid password token'
        );
    }

    public function test_that_handle_returns_error_when_token_is_expired()
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var PasswordReset $passwordReset */
        $passwordReset = PasswordReset::factory()->create([
            'email'      => $user->email,
            'created_at' => Carbon::now()->modify('-49 hours')
        ]);

        $request = new SetPasswordRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'set_password_token'    => $passwordReset->token
        ]);

        $this->mockPasswordResetRepository
            ->shouldReceive('getByToken')
            ->once()
            ->withArgs(function (string $token) use ($passwordReset) {
                return $token === $passwordReset->token;
            })
            ->andReturn($passwordReset);

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->handle($request);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'Password token expired'
        );
    }

    public function test_that_handle_returns_error_when_user_not_found()
    {
        /** @var User $user */
        $user = User::factory()->make();
        /** @var PasswordReset $passwordReset */
        $passwordReset = PasswordReset::factory()->create([
            'email' => $user->email
        ]);

        $request = new SetPasswordRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'set_password_token'    => $passwordReset->token
        ]);

        $this->mockPasswordResetRepository
            ->shouldReceive('getByToken')
            ->once()
            ->withArgs(function (string $token) use ($passwordReset) {
                return $token === $passwordReset->token;
            })
            ->andReturn($passwordReset);

        $this->mockUserRepository
            ->shouldReceive('getByEmailAddress')
            ->once()
            ->withArgs(function (string $emailAddress) use ($user) {
                return $emailAddress === $user->email;
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->handle($request);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'User not found'
        );
    }
}
