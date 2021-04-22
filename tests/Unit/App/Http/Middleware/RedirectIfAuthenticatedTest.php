<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Middleware;

use App\Http\Middleware\RedirectIfAuthenticated;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Tests\TestCase;

/**
 * @covers \App\Http\Middleware\RedirectIfAuthenticated
 */
class RedirectIfAuthenticatedTest extends TestCase
{
    use RefreshDatabase;

    /** @var RedirectIfAuthenticated */
    protected $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new RedirectIfAuthenticated();
    }

    public function test_that_handle_returns_expected_value()
    {
        $request = new Request();
        $request->request->replace([
            'foo' => 'bar'
        ]);

        $this->middleware->handle(
            $request,
            function (Request $req) {
                static::assertSame($req->get('foo'), 'bar');
            }
        );
    }

    public function test_that_handle_returns_expected_value_guard()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = new Request();
        $request->request->replace([
            'foo' => 'bar'
        ]);

        /** @var RedirectResponse $response */
        $response = $this->middleware->handle(
            $request,
            function () { },
            'web'
        );

        static::assertTrue($response->isRedirection());
    }
}
