<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

/**
 * Class ProcessCsv
 */
class ProcessCsv implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(protected string $filename)
    {
        $this->onConnection('sqs');
        $this->onQueue('jobs');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $row = 1;
        if (($handle = fopen($this->filename, 'rb')) !== false) {
            while (($data = fgetcsv($handle, 1000)) !== false) {
                $num = count($data);
                echo "<p> $num fields in line $row: <br /></p>\n";
                $row++;
                foreach ($data as $cValue) {
                    echo $cValue."<br />\n";
                }
            }
            fclose($handle);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // Send user notification of failure, etc...
    }
}
