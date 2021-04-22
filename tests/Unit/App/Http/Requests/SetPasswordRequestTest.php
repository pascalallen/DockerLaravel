<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Requests;

use App\Http\Requests\SetPasswordRequest;
use Tests\TestCase;

/**
 * @covers \App\Http\Requests\SetPasswordRequest
 */
class SetPasswordRequestTest extends TestCase
{
    /** @var SetPasswordRequest */
    protected $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new SetPasswordRequest();
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
            'password'           => 'required|confirmed',
            'set_password_token' => 'required'
        ];
        $actual = $this->request->rules();

        static::assertSame($expected, $actual);
    }
}
