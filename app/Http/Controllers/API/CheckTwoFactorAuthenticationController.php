<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class CheckTwoFactorAuthenticationController
 */
final class CheckTwoFactorAuthenticationController extends Controller
{
    /**
     * Constructs CheckTwoFactorAuthenticationController
     */
    public function __construct(protected UserRepositoryInterface $userRepository, protected Logger $logger)
    {
    }

    /**
     * Handles request to check whether the user has two factor authentication enabled
     */
    public function handle(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->userRepository->getByEmailAddress($request->input('email'));

            if ($user === null) {
                $message = 'User not found';
                throw new HttpException(Response::HTTP_NOT_FOUND, $message);
            }

            $message = sprintf('Has two-factor authentication enabled: %s', isset($user->google2fa_secret));
            $this->logger->info($message, [
                'user_id'       => $user->id,
                'email_address' => $user->email
            ]);

            return response()->json([
                'has_two_factor_authentication' => isset($user->google2fa_secret)
            ], Response::HTTP_OK);
        } catch (HttpException $e) {
            $this->logger->error($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }
    }
}
