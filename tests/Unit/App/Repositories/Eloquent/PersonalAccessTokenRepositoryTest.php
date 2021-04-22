<?php

declare(strict_types=1);

namespace Tests\Unit\App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Eloquent\PersonalAccessTokenRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

/**
 * @covers \App\Repositories\Eloquent\PersonalAccessTokenRepository
 */
class PersonalAccessTokenRepositoryTest extends TestCase
{
    use RefreshDatabase;

    /** @var PersonalAccessTokenRepository */
    protected $personalAccessTokenRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->personalAccessTokenRepository = $this->app->get(PersonalAccessTokenRepository::class);
    }

    public function test_that_remove_successfully_removes_google_access_token()
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var PersonalAccessToken $personalAccessToken */
        $personalAccessToken = $user->tokens()->create([
            'name'      => 'access-token',
            'token'     => hash('sha256', Str::random(40)),
            'abilities' => ['*']
        ]);

        $result = $this->personalAccessTokenRepository->getByUserId($user->id);

        static::assertSame($personalAccessToken->token, $result->token);
    }
}
