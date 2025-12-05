<?php

namespace App\Traits;

trait ApiResponse
{
    protected function successResponse($data = null, $message = "Success", $code = 200)
    {
        return response()->json([
            "status" => "success",
            "message" => $message,
            "data" => $data
        ], $code);
    }

    protected function errorResponse($message = "Error", $errors = null, $code = 400)
    {
        $response = [
            "status" => "error",
            "message" => $message
        ];

        if ($errors) {
            $response["errors"] = $errors;
        }

        return response()->json($response, $code);
    }
}
