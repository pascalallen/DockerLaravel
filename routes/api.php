<?php

declare(strict_types=1);

use App\Http\Controllers\API\CheckTwoFactorAuthenticationController;
use App\Http\Controllers\API\GetQRCodeController;
use App\Http\Controllers\API\SetPasswordController;
use App\Http\Controllers\API\TwoFactorAuthenticationController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['namespace' => 'API'], function () {
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::put('users/{id}', [UserController::class, 'update'])
            ->name('users.update');

        Route::delete('users/{id}', [UserController::class, 'destroy'])
            ->name('users.remove');

        Route::post('2fa', [TwoFactorAuthenticationController::class, '__invoke'])
            ->middleware('2fa')
            ->name('2fa');

        Route::get('2fa/qr-code', [GetQRCodeController::class, '__invoke'])
            ->name('2fa.get-qr-code');
    });

    Route::post('2fa/check', [CheckTwoFactorAuthenticationController::class, 'handle'])
        ->name('2fa.check');

    Route::post('set-password', [SetPasswordController::class, 'handle'])
        ->name('set-password');
});
