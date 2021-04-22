<?php

declare(strict_types=1);

namespace Tests\Unit\App\Console;

use Tests\TestCase;

/**
 * @covers \App\Console\Kernel
 */
class KernelTest extends TestCase
{
    public function test_that_schedule_runs_successfully(): void
    {
        $this->artisan('schedule:run')
            ->assertExitCode(0);
    }
}
