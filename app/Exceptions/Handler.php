<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        throw new \Exception('test handler');
        if ($request->header('X-Inertia')) {
            if ($e instanceof NotFoundHttpException) {
                return Inertia::render('Errors/404', ['status' => 404])
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            if ($e instanceof HttpException) {
                $status = $e->getStatusCode();

                if (view()->exists("Errors/{$status}")) {
                    return Inertia::render("Errors/{$status}", ['status' => $status])
                        ->toResponse($request)
                        ->setStatusCode($status);
                }

                return Inertia::render('Errors/Default', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }
        }

        return parent::render($request, $e);
    }
}
