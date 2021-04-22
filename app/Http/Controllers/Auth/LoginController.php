<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Repositories\PersonalAccessTokenRepositoryInterface;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Class LoginController
 */
final class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected string $redirectTo = RouteServiceProvider::HOME;

    /**
     * Constructs LoginController
     */
    public function __construct(
        protected PersonalAccessTokenRepositoryInterface $personalAccessTokenRepository,
        protected Logger $logger
    ) {
        $this->middleware('guest')->except('logout');
    }

    /**
     * The user has been authenticated.
     */
    public function authenticated(Request $request, User $user): JsonResponse
    {
        /** @var PersonalAccessToken|null $personalAccessToken */
        $personalAccessToken = $this->personalAccessTokenRepository->getByUserId($user->id);

        if ($personalAccessToken === null) {
            $user->access_token = $user->createToken('access-token')->plainTextToken;
        } else {
            $user->access_token = $personalAccessToken->token;
        }

        $message = 'User has logged in';
        $this->logger->info($message, [
            'user_id'       => $user->id,
            'email_address' => $user->email
        ]);

        return response()->json($user->load(['roles', 'permissions']), Response::HTTP_OK);
    }
}
