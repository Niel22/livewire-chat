<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($request->wantsJson() || $request->expectsJson()) {
            return parent::render($request, $e);
        }

        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();

            return Inertia::render('Errors/Error', [
                'status' => $status,
            ])->toResponse($request)->setStatusCode($status);
        }

        return parent::render($request, $e);
    }
}
