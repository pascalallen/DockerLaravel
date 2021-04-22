<?php

declare(strict_types=1);

namespace Tests\Unit\App\Exceptions;

use App\Exceptions\Handler;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mockery\MockInterface;
use Psr\Log\LoggerInterface;
use Tests\TestCase;

/**
 * @covers \App\Exceptions\Handler
 */
class HandlerTest extends TestCase
{
    /** @var Handler */
    protected $handler;
    /** @var LoggerInterface|MockInterface */
    protected $mockLogger;

    public function setUp(): void
    {
        parent::setUp();
        $this->handler = new Handler($this->app);
        $this->mockLogger = $this->mock(LoggerInterface::class);
    }

    public function test_that_report_logs_exception()
    {
        $message = "You done goofed";
        $exception = new Exception($message);

        $this->mockLogger
            ->shouldReceive('error')
            ->once()
            ->withArgs(function (string $arg) use ($message) {
                return $arg === $message;
            })
            ->andReturnNull();

        $this->handler->report($exception);
    }

    public function test_that_render_returns_an_http_response()
    {
        $request = Request::capture();
        $message = "You done goofed";
        $exception = new Exception($message);

        $response = $this->handler->render($request, $exception);

        static::assertInstanceOf(Response::class, $response);
    }
}
