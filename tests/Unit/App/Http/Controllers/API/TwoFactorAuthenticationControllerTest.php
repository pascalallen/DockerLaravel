<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\API;

use App\Http\Controllers\API\TwoFactorAuthenticationController;
use App\Models\User;
use App\Repositories\PersonalAccessTokenRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Laravel\Sanctum\PersonalAccessToken;
use Mockery\MockInterface;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\API\TwoFactorAuthenticationController
 */
class TwoFactorAuthenticationControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var PersonalAccessTokenRepositoryInterface|MockInterface */
    protected $mockPersonalAccessTokenRepository;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockPersonalAccessTokenRepository = $this->mock(PersonalAccessTokenRepositoryInterface::class);
        $this->mockLogger = $this->mock(Logger::class);
    }

    public function test_that_invoke_returns_expected_response()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $controller = new TwoFactorAuthenticationController(
            $this->mockPersonalAccessTokenRepository,
            $this->mockLogger
        );

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

        $response = $controller();

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }

    public function test_that_invoke_returns_expected_response_existing_token()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $user->createToken('access-token');
        $personalAccessToken = new PersonalAccessToken([
            'tokenable_type' => User::class,
            'tokenable_id'   => $user->id,
            'name'           => 'access-token'
        ]);
        $this->actingAs($user);

        $controller = new TwoFactorAuthenticationController(
            $this->mockPersonalAccessTokenRepository,
            $this->mockLogger
        );

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

        $response = $controller();

        static::assertTrue(
            $response->isSuccessful()
            && !empty($response->getData())
        );
    }
}
