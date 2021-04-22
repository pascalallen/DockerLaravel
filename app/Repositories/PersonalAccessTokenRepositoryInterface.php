<?php

declare(strict_types=1);

namespace App\Repositories;

use Laravel\Sanctum\PersonalAccessToken;

/**
 * Interface PersonalAccessTokenRepositoryInterface
 */
interface PersonalAccessTokenRepositoryInterface
{
    /**
     * Retrieves a Personal Access Token by user ID
     */
    public function getByUserId(int $userId): ?PersonalAccessToken;
}
