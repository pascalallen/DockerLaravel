<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetPasswordRequest;
use App\Models\PasswordReset;
use App\Models\User;
use App\Repositories\PasswordResetRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class SetPasswordController
 */
final class SetPasswordController extends Controller
{
    /**
     * Constructs SetPasswordController
     */
    public function __construct(
        protected PasswordResetRepositoryInterface $passwordResetRepository,
        protected UserRepositoryInterface $userRepository,
        protected Logger $logger
    ) {
    }

    /**
     * Handles request to set password
     */
    public function handle(SetPasswordRequest $request): JsonResponse
    {
        try {
            /** @var PasswordReset|null $passwordReset */
            $passwordReset = $this->passwordResetRepository->getByToken($request->input('set_password_token'));

            if ($passwordReset === null) {
                $message = 'Invalid password token';
                throw new HttpException(Response::HTTP_UNPROCESSABLE_ENTITY, $message);
            }

            $now = Carbon::now();
            if ($now->diffInHours($passwordReset->created_at) > 48) {
                $message = 'Password token expired';
                throw new HttpException(Response::HTTP_UNAUTHORIZED, $message);
            }

            /** @var User|null $user */
            $user = $this->userRepository->getByEmailAddress($passwordReset->email);
            if ($user === null) {
                $message = 'User not found';
                throw new HttpException(Response::HTTP_NOT_FOUND, $message);
            }

            $user->update([
                'password' => Hash::make($request->input('password'))
            ]);

            $message = 'User password updated';
            $this->logger->info($message, [
                'user_id'       => $user->id,
                'email_address' => $user->email
            ]);

            return response()->json([], Response::HTTP_OK);
        } catch (HttpException $e) {
            $this->logger->error($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }
}
