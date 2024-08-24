<?php

namespace App\Http\Controllers\Auth;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $encrypt_role = Crypt::encrypt(Auth::user()->role);

        return redirect()->intended(route('admin', absolute: false))->withCookie(cookie('role', $encrypt_role, 60 * 24 * 30, null, null, false, false));
    }

    public function getRole(Request $request)
    {
        $encryptedRole = $request->cookie('role');
        if ($encryptedRole) {
            $decrypted_role = Crypt::decrypt($encryptedRole);
            return response()->json(['role' => $decrypted_role]);
        }
        else{
            return response()->json(['role' => null]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/')->withoutCookie('role');
    }
}
