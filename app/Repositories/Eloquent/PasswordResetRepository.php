<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\PasswordReset;
use App\Repositories\PasswordResetRepositoryInterface;

/**
 * Class PasswordResetRepository
 */
class PasswordResetRepository extends BaseRepository implements PasswordResetRepositoryInterface
{
    /**
     * Constructs PasswordResetRepository
     */
    public function __construct(PasswordReset $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByToken(string $token): ?PasswordReset
    {
        /** @var PasswordReset|null $passwordReset */
        $passwordReset = $this->model::where('token', $token)
            ->first();

        return $passwordReset;
    }
}
