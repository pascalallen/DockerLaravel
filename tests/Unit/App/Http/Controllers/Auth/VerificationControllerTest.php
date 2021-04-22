<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\VerificationController;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\Auth\VerificationController
 */
class VerificationControllerTest extends TestCase
{
    /** @var VerificationController */
    protected $controller;

    public function setUp(): void
    {
        parent::setUp();
        $this->controller = new VerificationController();
    }

    public function test_that_controller_middleware_contains_auth_signed_and_throttle()
    {
        $middlewareCollection = collect($this->controller->getMiddleware());

        static::assertTrue(
            $middlewareCollection->contains('middleware', '=', 'auth')
            && $middlewareCollection->contains('middleware', '=', 'signed')
            && $middlewareCollection->contains('middleware', '=', 'throttle:6,1')
        );
    }
}
