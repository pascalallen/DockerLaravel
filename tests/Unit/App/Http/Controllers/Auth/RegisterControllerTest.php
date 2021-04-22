<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Mockery\MockInterface;
use Symfony\Component\HttpFoundation\Request;
use Tests\TestCase;
use Throwable;

/**
 * @covers \App\Http\Controllers\Auth\RegisterController
 */
class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var RegisterController */
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
        $this->controller = new RegisterController($this->mockUserRepository, $this->mockLogger);
    }

    public function test_that_controller_middleware_contains_guest()
    {
        $middlewareCollection = collect($this->controller->getMiddleware());

        static::assertTrue($middlewareCollection->contains('middleware', '=', 'guest'));
    }

    public function test_that_register_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->make();

        $request = new RegisterUserRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'name'     => $user->name,
            'email'    => $user->email,
            'password' => $user->password
        ]);

        $this->mockUserRepository
            ->shouldReceive('add')
            ->once()
            ->withArgs(function (User $arg) use ($user) {
                return $arg->email === $user->email;
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->register($request);

        static::assertTrue(
            $response->isSuccessful()
            && $response->getData()->email === $user->email
        );
    }

    public function test_that_register_returns_error_when_user_cannot_be_persisted()
    {
        /** @var User $user */
        $user = User::factory()->make();

        $request = new RegisterUserRequest();
        $request->setMethod(Request::METHOD_POST);
        $request->request->replace([
            'name'     => $user->name,
            'email'    => $user->email,
            'password' => $user->password
        ]);

        $this->mockUserRepository
            ->shouldReceive('add')
            ->once()
            ->withArgs(function (User $arg) use ($user) {
                return $arg->email === $user->email;
            })
            ->andThrow(new Exception('Problem saving user'));

        $this->mockLogger
            ->shouldReceive('critical')
            ->once()
            ->withArgs(function (string $message) {
                return is_string($message);
            })
            ->andReturnNull();

        $response = $this->controller->register($request);

        static::assertTrue(
            $response->isServerError()
            && isset($response->getData()->message)
        );
    }
}
