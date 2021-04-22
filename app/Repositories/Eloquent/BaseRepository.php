<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BaseRepository
 */
class BaseRepository implements EloquentRepositoryInterface
{
    /**
     * Constructs BaseRepository
     */
    public function __construct(protected Model $model)
    {
    }
}
