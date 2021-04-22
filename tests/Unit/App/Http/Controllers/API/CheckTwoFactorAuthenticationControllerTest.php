<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\API;

use App\Http\Controllers\API\CheckTwoFactorAuthenticationController;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Mockery\MockInterface;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\API\CheckTwoFactorAuthenticationController
 */
class CheckTwoFactorAuthenticationControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var CheckTwoFactorAuthenticationController */
    protected $controller;
    /** @var UserRepositoryInterface|MockInterface */
    protected $mockUserRepository;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockUserRepository = $this->mock(UserRepositoryInterface::class);
        $this->mockLogger = $this->mock(Logger::class);
        $this->controller = new CheckTwoFactorAuthenticationController(
            $this->mockUserRepository,
            $this->mockLogger
        );
    }

    public function test_that_handle_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'email' => $user->email
        ]);

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

        static::assertTrue(
            $response->isSuccessful()
            && isset($response->getData()->has_two_factor_authentication)
        );
    }

    public function test_that_handle_returns_error_when_user_not_found()
    {
        /** @var User $user */
        $user = User::factory()->make();
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'email' => $user->email
        ]);

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
