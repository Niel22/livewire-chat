<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Exception;
use Illuminate\Support\Facades\Log;

class CloudinaryUploadService{

    public function uploadFiles(array $files, $messageId){
        $attachments = [];


        foreach ($files as $file) {
            $upload = $this->attemptUpload($file);

            if (!$upload) {
                Log::error("Failed to upload file: {$file->getClientOriginalName()}");
                continue;
            }

            $attachments[] = [
                'message_id' => $messageId,
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'path' => $upload['secure_url'],
                'public_id' => $upload['public_id'],
            ];
        }

        return $attachments;
    }

    private function attemptUpload($file, $maxRetries = 3)
    {
        $attempts = 0;
        $uploadApi = new UploadApi();

        while ($attempts < $maxRetries) {
            try {
                return $uploadApi->upload($file->getRealPath(), [
                    'folder' => 'chat_attachments',
                    'resource_type' => 'auto',
                ]);
            } catch (Exception $e) {
                $attempts++;
                Log::warning("Cloudinary upload attempt {$attempts} failed: {$e->getMessage()}");

                if ($attempts >= $maxRetries) {
                    return null;
                }

                sleep(1);
            }
        }
    }

}