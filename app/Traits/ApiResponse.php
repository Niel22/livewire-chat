<?php

namespace App\Traits;

use Illuminate\Http\Response;

trait ApiResponse
{
    public function success($data = [], $message = '')
    {
        return response()->json([
            'data' => $data,
            'message' => $message
        ], Response::HTTP_OK);
    }

    public function error($message, $status = Response::HTTP_BAD_REQUEST)
    {
        return response()->json([
            'message' => $message
        ], $status);
    }
}
