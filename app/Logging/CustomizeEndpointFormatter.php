<?php

namespace App\Logging;

use Monolog\Formatter\LineFormatter;

class CustomizeEndpointFormatter
{
    /**
     * Customize the given Monolog instance.
     */
    public function __invoke($logger)
    {
        foreach ($logger->getHandlers() as $handler) {
            $output = "[%datetime%] %channel%.%level_name%: %message% %context%\n";
            $dateFormat = "D, M j Y - g:i:s A";

            $formatter = new LineFormatter($output, $dateFormat, true, true);
            $handler->setFormatter($formatter);
        }
    }
}
