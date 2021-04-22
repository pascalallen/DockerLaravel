<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Generator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Class UserRepository
 */
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * Constructs UserRepository
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getById(int $id): ?User
    {
        /** @var User|null $user */
        $user = $this->model::where('id', $id)
            ->first();

        return $user;
    }

    /**
     * @inheritDoc
     */
    public function getByEmailAddress(string $emailAddress): ?User
    {
        /** @var User|null $user */
        $user = $this->model::where('email', $emailAddress)
            ->first();

        return $user;
    }

    /**
     * @inheritDoc
     */
    public function getAll(int $perPage, ?int $page, ?string $searchTerm = null): LengthAwarePaginator
    {
        $query = User::query();

        if ($searchTerm !== null) {
            $query->where('name', 'LIKE', '%'.$searchTerm.'%')
                ->orWhere('email', 'LIKE', '%'.$searchTerm.'%');
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * @inheritDoc
     */
    public function streamAll(): Generator
    {
        $perPage = 15;
        $page = 1;
        $searchTerm = null;

        $resultSet = $this->getAll($perPage, $page, $searchTerm);

        /** @var User $user */
        foreach ($resultSet as $user) {
            yield $user;
        }

        $totalPages = $resultSet->lastPage();
        if ($totalPages > 1) {
            $page = 2;
            while ($page <= $totalPages) {
                $resultSet = $this->getAll($perPage, $page, $searchTerm);

                /** @var User $user */
                foreach ($resultSet as $user) {
                    yield $user;
                }

                $page++;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public function add(User $user): void
    {
        $user->saveOrFail();
    }
}
