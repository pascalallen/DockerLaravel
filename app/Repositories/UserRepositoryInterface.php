<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Generator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Throwable;

/**
 * Interface UserRepositoryInterface
 */
interface UserRepositoryInterface
{
    /**
     * Retrieves a user by ID
     */
    public function getById(int $id): ?User;

    /**
     * Retrieves a user by email address
     */
    public function getByEmailAddress(string $emailAddress): ?User;

    /**
     * Retrieves list of users
     */
    public function getAll(int $perPage, ?int $page, ?string $searchTerm = null): LengthAwarePaginator;

    /**
     * Retrieves stream of users
     */
    public function streamAll(): Generator;

    /**
     * Adds a user
     *
     * @throws Throwable When an error occurs
     */
    public function add(User $user): void;
}
