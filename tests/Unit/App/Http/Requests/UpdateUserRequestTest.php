<?php

declare(strict_types=1);

namespace Tests\Unit\App\Http\Requests;

use App\Http\Requests\UpdateUserRequest;
use Tests\TestCase;

/**
 * @covers \App\Http\Requests\UpdateUserRequest
 */
class UpdateUserRequestTest extends TestCase
{
    /** @var UpdateUserRequest */
    protected $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new UpdateUserRequest();
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
            'password' => 'confirmed|min:8|max:255'
        ];
        $actual = $this->request->rules();

        static::assertSame($expected, $actual);
    }
}
