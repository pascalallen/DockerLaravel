<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Log\Logger;

/**
 * Class ResetPasswordController
 */
final class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected string $redirectTo = RouteServiceProvider::HOME;

    /**
     * Constructs ResetPasswordController
     */
    public function __construct(protected Logger $logger) { }

    /**
     * Reset the given user's password.
     */
    public function resetPassword(User $user, string $password): void
    {
        $this->setUserPassword($user, $password);

        $user->save();

        event(new PasswordReset($user));

        $message = 'User password reset';
        $this->logger->info($message, [
            'user_id'       => $user->id,
            'email_address' => $user->email
        ]);
    }
}
