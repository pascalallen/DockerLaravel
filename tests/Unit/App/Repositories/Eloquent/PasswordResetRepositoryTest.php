<?php

declare(strict_types=1);

namespace Tests\Unit\App\Repositories\Eloquent;

use App\Models\PasswordReset;
use App\Models\User;
use App\Repositories\PasswordResetRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers \App\Repositories\Eloquent\BaseRepository
 * @covers \App\Repositories\Eloquent\PasswordResetRepository
 */
class PasswordResetRepositoryTest extends TestCase
{
    use RefreshDatabase;

    /** @var PasswordResetRepositoryInterface */
    protected $passwordResetRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->passwordResetRepository = $this->app->get(PasswordResetRepositoryInterface::class);
    }

    public function test_that_get_by_token_returns_expected_value()
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var PasswordReset $passwordReset */
        $passwordReset = PasswordReset::factory()->create([
            'email' => $user->email
        ]);

        $result = $this->passwordResetRepository->getByToken($passwordReset->token);

        static::assertSame($passwordReset->token, $result->token);
    }
}
