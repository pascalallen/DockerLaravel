<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\API;

use App\Http\Controllers\API\UserController;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Mockery\MockInterface;
use PragmaRX\Google2FALaravel\Google2FA;
use Symfony\Component\HttpFoundation\Request;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\API\UserController
 */
class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var UserController */
    protected $controller;
    /** @var Google2FA|MockInterface */
    protected $mockTwoFactorAuthenticationService;
    /** @var UserRepositoryInterface|MockInterface */
    protected $mockUserRepository;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockTwoFactorAuthenticationService = $this->mock(Google2FA::class);
        $this->mockUserRepository = $this->mock(UserRepositoryInterface::class);
        $this->mockLogger = $this->mock(Logger::class);
        $this->controller = new UserController(
            $this->mockTwoFactorAuthenticationService,
            $this->mockUserRepository,
            $this->mockLogger
        );
    }

    public function test_that_update_returns_expected_response()
    {
        $secretKey = 'ABCDEFGHIJKLMNOP';
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = new UpdateUserRequest();
        $request->setMethod(Request::METHOD_PUT);
        $request->request->replace([
            'name'                  => 'Leeroy Jenkins',
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'google2fa_secret'      => $secretKey
        ]);

        $this->mockUserRepository
            ->shouldReceive('getById')
            ->once()
            ->withArgs(function (int $userId) use ($user) {
                return $userId === $user->id;
            })
            ->andReturn($user);

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->update($request, $user->id);

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }

    public function test_that_update_returns_expected_response_2fa_turned_off()
    {
        $secretKey = 'ABCDEFGHIJKLMNOP';
        /** @var User $user */
        $user = User::factory()->create([
            'google2fa_secret' => $secretKey
        ]);
        $this->actingAs($user);

        $request = new UpdateUserRequest();
        $request->setMethod(Request::METHOD_PUT);
        $request->request->replace([
            'name'                  => 'Leeroy Jenkins',
            'password'              => 'new-password',
            'password_confirmation' => 'new-password'
        ]);

        $this->mockUserRepository
            ->shouldReceive('getById')
            ->once()
            ->withArgs(function (int $userId) use ($user) {
                return $userId === $user->id;
            })
            ->andReturn($user);

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->update($request, $user->id);

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }

    public function test_that_update_returns_error_when_attempting_to_update_not_self()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = new UpdateUserRequest();
        $request->setMethod(Request::METHOD_PUT);
        $request->request->replace([
            'name'                  => 'Leeroy Jenkins',
            'password'              => 'new-password',
            'password_confirmation' => 'new-password'
        ]);

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->update($request, $user->id + 1);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'You are not authorized to update anyone other than yourself'
        );
    }

    public function test_that_update_returns_error_when_user_not_found()
    {
        $secretKey = 'ABCDEFGHIJKLMNOP';
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = new UpdateUserRequest();
        $request->setMethod(Request::METHOD_PUT);
        $request->request->replace([
            'name'                  => 'Leeroy Jenkins',
            'password'              => 'new-password',
            'password_confirmation' => 'new-password',
            'google2fa_secret'      => $secretKey
        ]);

        $this->mockUserRepository
            ->shouldReceive('getById')
            ->once()
            ->withArgs(function (int $userId) use ($user) {
                return $userId === $user->id;
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->update($request, $user->id);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'User not found'
        );
    }

    public function test_that_destroy_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->mockUserRepository
            ->shouldReceive('getById')
            ->once()
            ->withArgs(function (int $id) use ($user) {
                return $id === $user->id;
            })
            ->andReturn($user);

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->destroy($user->id);

        static::assertTrue($response->isSuccessful());
    }

    public function test_that_destroy_returns_error_when_attempting_to_delete_not_self()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->destroy($user->id + 1);

        static::assertTrue(
            $response->isClientError()
            && !empty($response->getData())
        );
    }

    public function test_that_destroy_returns_error_when_user_not_found()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->mockUserRepository
            ->shouldReceive('getById')
            ->once()
            ->withArgs(function (int $id) use ($user) {
                return $id === $user->id;
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->destroy($user->id);

        static::assertTrue(
            $response->isClientError()
            && $response->getData()->message === 'User not found'
        );
    }
}
