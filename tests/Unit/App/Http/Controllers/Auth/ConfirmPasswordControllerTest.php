<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\ConfirmPasswordController;
use Tests\TestCase;

/**
 * @covers \App\Http\Controllers\Auth\ConfirmPasswordController
 */
class ConfirmPasswordControllerTest extends TestCase
{
    /** @var ConfirmPasswordController */
    protected $controller;

    public function setUp(): void
    {
        parent::setUp();
        $this->controller = new ConfirmPasswordController();
    }

    public function test_that_controller_middleware_contains_auth()
    {
        $middlewareCollection = collect($this->controller->getMiddleware());

        static::assertTrue($middlewareCollection->contains('middleware', '=', 'auth'));
    }
}
