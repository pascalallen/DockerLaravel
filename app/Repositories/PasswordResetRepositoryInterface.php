<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\PasswordReset;

/**
 * Interface PasswordResetRepositoryInterface
 */
interface PasswordResetRepositoryInterface
{
    /**
     * Retrieves a password reset by token
     */
    public function getByToken(string $token): ?PasswordReset;
}
