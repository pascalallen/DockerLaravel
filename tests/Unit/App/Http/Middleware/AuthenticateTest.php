<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Middleware;

use App\Http\Middleware\Authenticate;
use Illuminate\Contracts\Auth\Factory;
use Illuminate\Http\Request;
use Mockery\MockInterface;
use Tests\TestCase;

/**
 * @covers \App\Http\Middleware\Authenticate
 */
class AuthenticateTest extends TestCase
{
    /** @var Authenticate */
    protected $middleware;
    /** @var Factory|MockInterface */
    protected $mockAuthFactory;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mockAuthFactory = $this->mock(Factory::class);
        $this->middleware = new Authenticate($this->mockAuthFactory);
    }

    public function test_that_redirect_to_returns_expected_value()
    {
        $request = new Request();
        $path = $this->middleware->redirectTo($request);

        static::assertSame(route('login'), $path);
    }

    public function test_that_redirect_to_returns_expected_json_value()
    {
        $request = new Request();
        $request->headers->replace([
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json'
        ]);
        $path = $this->middleware->redirectTo($request);

        static::assertNull($path);
    }
}
