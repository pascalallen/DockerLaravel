<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FALaravel\Google2FA;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class UserController
 */
final class UserController extends Controller
{
    /**
     * Constructs UserController
     */
    public function __construct(
        protected Google2FA $twoFactorAuthenticationService,
        protected UserRepositoryInterface $userRepository,
        protected Logger $logger
    ) {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            if (Auth::id() !== $id) {
                $message = 'You are not authorized to update anyone other than yourself';
                throw new HttpException(Response::HTTP_UNAUTHORIZED, $message);
            }

            /** @var User|null $user */
            $user = $this->userRepository->getById($id);
            if ($user === null) {
                $message = 'User not found';
                throw new HttpException(Response::HTTP_NOT_FOUND, $message);
            }

            $attributes = [];
            $attributes['name'] = $request->input('name');

            if (!isset($user->google2fa_secret) && $request->filled('google2fa_secret')) {
                $attributes['google2fa_secret'] = $request->input('google2fa_secret');
            } elseif (isset($user->google2fa_secret) && !$request->input('google2fa_secret')) {
                $attributes['google2fa_secret'] = null;
            }

            if ($request->filled('password')) {
                $attributes['password'] = Hash::make($request->input('password'));
            }

            $user->update($attributes);

            $message = 'User updated';
            $this->logger->info($message, [
                'user_id'       => $user->id,
                'email_address' => $user->email
            ]);

            return response()->json($user->only(['name', 'google2fa_secret']), Response::HTTP_OK);
        } catch (HttpException $e) {
            $this->logger->error($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            if (Auth::id() !== $id) {
                $message = 'You are not authorized to delete anyone other than yourself';
                throw new HttpException(Response::HTTP_UNAUTHORIZED, $message);
            }

            /** @var User|null $user */
            $user = $this->userRepository->getById($id);
            if ($user === null) {
                $message = 'User not found';
                throw new HttpException(Response::HTTP_NOT_FOUND, $message);
            }
            $user->delete();

            $message = 'User deleted';
            $this->logger->info($message, [
                'user_id'       => $user->id,
                'email_address' => $user->email
            ]);

            return response()->json(null, Response::HTTP_OK);
        } catch (HttpException $e) {
            $this->logger->error($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }
}
