<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = request()->route('group')->id;
        return [
            'name' => 'nullable|string|unique:groups,name,'. $id,
            'description' => 'nullable|string',
            'admin_id' => 'nullable|integer|exists:users,id',
            'avatar' => 'nullable|image|max:1024',
        ];
    }
}
