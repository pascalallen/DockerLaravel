<?php

declare(strict_types=1);

namespace Tests\Unit\App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers \App\Repositories\Eloquent\UserRepository
 */
class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    /** @var UserRepositoryInterface */
    protected $userRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = $this->app->get(UserRepositoryInterface::class);
    }

    public function test_that_get_by_id_returns_expected_values()
    {
        /** @var User $user */
        $user = User::factory()->make();

        $this->userRepository->add($user);

        $result = $this->userRepository->getById($user->id);

        static::assertSame($user->email, $result->email);
    }

    public function test_that_get_by_email_address_returns_expected_values()
    {
        /** @var User $user */
        $user = User::factory()->make();

        $this->userRepository->add($user);

        $result = $this->userRepository->getByEmailAddress($user->email);

        static::assertSame($user->email, $result->email);
    }

    public function test_that_get_all_returns_expected_result_set_with_search_term()
    {
        $searchTerm = 'Bill';

        /** @var User $user */
        $user = User::factory()->make([
            'name' => sprintf('%s Cosby', $searchTerm)
        ]);

        $this->userRepository->add($user);

        $perPage = 15;
        $page = 1;

        $resultSet = $this->userRepository->getAll($perPage, $page, $searchTerm);

        static::assertSame($resultSet->total(), 1);
    }

    public function test_that_stream_all_returns_expected_result_set()
    {
        $total = 150;
        $users = User::factory()->count($total)->make();

        /** @var User $user */
        foreach ($users as $user) {
            $this->userRepository->add($user);
        }

        $users = $this->userRepository->streamAll();
        $count = 0;
        /** @var User $user */
        foreach ($users as $user) {
            $count++;
        }

        static::assertSame($total, $count);
    }
}
