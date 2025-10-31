using ProjectManager.Api.DTOs.Auth;

namespace ProjectManager.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest req);
        Task<AuthResponse?> LoginAsync(LoginRequest req);
    }
}
