<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FALaravel\Google2FA;

/**
 * Class GetQRCodeController
 */
final class GetQRCodeController extends Controller
{
    /**
     * Constructs GetQRCodeController
     */
    public function __construct(protected Google2FA $twoFactorAuthenticationService, protected Logger $logger)
    {
    }

    /**
     * Retrieves Google2FA QR code for logged in user
     */
    public function __invoke(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $google2faSecret = $this->twoFactorAuthenticationService->generateSecretKey();
        $qrCode = $this->twoFactorAuthenticationService->getQRCodeInline(
            config('app.name'),
            $user->email,
            $user->google2fa_secret ?? $google2faSecret
        );

        $message = 'QR code and two-factor authentication data fetched';
        $this->logger->info($message, [
            'user_id'       => $user->id,
            'email_address' => $user->email
        ]);

        return response()->json([
            'qr_code'          => $qrCode,
            'google2fa_secret' => $user->google2fa_secret ?? $google2faSecret
        ], Response::HTTP_OK);
    }
}
