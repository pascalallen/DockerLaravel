<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\PersonalAccessTokenRepositoryInterface;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Class PersonalAccessTokenRepository
 */
class PersonalAccessTokenRepository extends BaseRepository implements PersonalAccessTokenRepositoryInterface
{
    /**
     * Constructs PersonalAccessTokenRepository
     */
    public function __construct(PersonalAccessToken $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByUserId(int $userId): ?PersonalAccessToken
    {
        /** @var PersonalAccessToken|null $personalAccessToken */
        $personalAccessToken = $this->model::where('tokenable_type', User::class)
            ->where('tokenable_id', $userId)
            ->where('name', 'access-token')
            ->first();

        return $personalAccessToken;
    }
}
