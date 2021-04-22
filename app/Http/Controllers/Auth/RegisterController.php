<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

/**
 * Class RegisterController
 */
final class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected string $redirectTo = RouteServiceProvider::HOME;

    /**
     * Constructs RegisterController
     */
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected Logger $logger
    ) {
        $this->middleware('guest');
    }

    /**
     * Handle a registration request for the application.
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        try {
            $user = new User([
                'name'     => $request->input('name'),
                'email'    => $request->input('email'),
                'password' => Hash::make($request->input('password'))
            ]);
            $this->userRepository->add($user);

            event(new Registered($user));
            $token = new PersonalAccessToken([
                'tokenable_type' => User::class,
                'tokenable_id'   => $user->id,
                'name'           => 'access-token',
                'token'          => hash('sha256', $plainTextToken = Str::random(40)),
                'abilities'      => ['*']
            ]);
            $token = new NewAccessToken($token, $token->getKey().'|'.$plainTextToken);
            $user->access_token = $token->plainTextToken;

            $message = 'User registered';
            $this->logger->info($message, [
                'user_id'       => $user->id,
                'email_Address' => $user->email
            ]);

            return response()->json($user->load(['roles', 'permissions']), Response::HTTP_CREATED);
        } catch (Throwable $e) {
            $this->logger->critical($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
