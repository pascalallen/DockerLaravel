<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\PersonalAccessTokenRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Class TwoFactorAuthenticationController
 */
final class TwoFactorAuthenticationController extends Controller
{
    /**
     * Constructs TwoFactorAuthenticationController
     */
    public function __construct(
        protected PersonalAccessTokenRepositoryInterface $personalAccessTokenRepository,
        protected Logger $logger
    ) {
    }

    /**
     * Retrieves logged in user after successfully authenticated by 2fa middleware
     */
    public function __invoke(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        /** @var PersonalAccessToken|null $personalAccessToken */
        $personalAccessToken = $this->personalAccessTokenRepository->getByUserId($user->id);

        if ($personalAccessToken === null) {
            $user->access_token = $user->createToken('access-token')->plainTextToken;
        } else {
            $user->access_token = $personalAccessToken->token;
        }

        $message = 'User has logged in with two-factor authentication';
        $this->logger->info($message, [
            'user_id'       => $user->id,
            'email_address' => $user->email
        ]);

        return response()->json($user->load(['roles', 'permissions']), Response::HTTP_OK);
    }
}
