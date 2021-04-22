<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\LoginController;
use App\Models\User;
use App\Repositories\PersonalAccessTokenRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Laravel\Sanctum\PersonalAccessToken;
use Mockery\MockInterface;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\Auth\LoginController
 */
class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var LoginController */
    protected $controller;
    /** @var PersonalAccessTokenRepositoryInterface|MockInterface */
    protected $mockPersonalAccessTokenRepository;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockPersonalAccessTokenRepository = $this->mock(PersonalAccessTokenRepositoryInterface::class);
        $this->mockLogger = $this->mock(Logger::class);
        $this->controller = new LoginController(
            $this->mockPersonalAccessTokenRepository,
            $this->mockLogger
        );
    }

    public function test_that_controller_middleware_contains_guest()
    {
        $middlewareCollection = collect($this->controller->getMiddleware());

        static::assertTrue($middlewareCollection->contains('middleware', '=', 'guest'));
    }

    public function test_that_authenticated_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $this->mockPersonalAccessTokenRepository
            ->shouldReceive('getByUserId')
            ->once()
            ->withArgs(function (int $userId) use ($user) {
                return $userId === $user->id;
            })
            ->andReturnNull();

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->authenticated(new Request(), $user);

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }

    public function test_that_authenticated_returns_expected_response_existing_access_token()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $user->createToken('access-token');
        $personalAccessToken = new PersonalAccessToken([
            'tokenable_type' => User::class,
            'tokenable_id'   => $user->id,
            'name'           => 'access-token'
        ]);

        $this->mockPersonalAccessTokenRepository
            ->shouldReceive('getByUserId')
            ->once()
            ->withArgs(function (int $userId) use ($user) {
                return $userId === $user->id;
            })
            ->andReturn($personalAccessToken);

        $this->mockLogger
            ->shouldReceive('info')
            ->once()
            ->withArgs(function (string $message, array $context) {
                return is_string($message) && is_array($context);
            })
            ->andReturnNull();

        $response = $this->controller->authenticated(new Request(), $user);

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }
}
