using QRMenu.Api.DTOs.Auth;

namespace QRMenu.Api.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
}