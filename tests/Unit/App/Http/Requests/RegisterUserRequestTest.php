<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Requests;

use App\Http\Requests\RegisterUserRequest;
use Tests\TestCase;

/**
 * @covers \App\Http\Requests\RegisterUserRequest
 */
class RegisterUserRequestTest extends TestCase
{
    /** @var RegisterUserRequest */
    protected $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new RegisterUserRequest();
    }

    public function test_that_authorize_returns_expected_value()
    {
        $expected = true;
        $actual = $this->request->authorize();

        static::assertSame($expected, $actual);
    }

    public function test_that_rules_returns_expected_value()
    {
        $expected = [
            'name'     => 'required|max:255',
            'email'    => 'required|unique:users,email|email|max:255',
            'password' => 'required|min:8|max:255'
        ];
        $actual = $this->request->rules();

        static::assertSame($expected, $actual);
    }
}
