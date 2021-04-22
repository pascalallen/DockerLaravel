<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\API;

use App\Http\Controllers\API\GetQRCodeController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Log\Logger;
use Mockery\MockInterface;
use PragmaRX\Google2FALaravel\Google2FA;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\API\GetQRCodeController
 */
class GetQRCodeControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var Google2FA|MockInterface */
    protected $mockTwoFactorAuthenticationService;
    /** @var Logger|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->mockTwoFactorAuthenticationService = $this->mock(Google2FA::class);
        $this->mockLogger = $this->mock(Logger::class);
    }

    public function test_that_invoke_returns_expected_response()
    {
        $controller = new GetQRCodeController($this->mockTwoFactorAuthenticationService, $this->mockLogger);

        /** @var User $user */
        $user = User::factory()
            ->create();
        $this->actingAs($user);
        $secretKey = 'ABCDEFGHIJKLMNOP';
        $qrCode = '1234567890';

        $this->mockTwoFactorAuthenticationService
            ->shouldReceive('generateSecretKey')
            ->once()
            ->withNoArgs()
            ->andReturn($secretKey);

        $this->mockTwoFactorAuthenticationService
            ->shouldReceive('getQRCodeInline')
            ->once()
            ->withArgs(function (
                string $appName,
                string $email,
                string $secret
            ) use ($user, $secretKey) {
                return $appName === config('app.name')
                    && $email === $user->email
                    && $secret === $secretKey;
            })
            ->andReturn($qrCode);

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
            && isset(
                $response->getData()->qr_code,
                $response->getData()->google2fa_secret
            )
        );
    }
}
