using Microsoft.AspNetCore.Mvc;
using ProjectManager.Api.DTOs.Auth;
using ProjectManager.Api.Services;

namespace ProjectManager.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) => _auth = auth;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var res = await _auth.RegisterAsync(req);
            if (res == null) return Conflict(new { message = "Username already exists" });
            return Ok(res);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var res = await _auth.LoginAsync(req);
            if (res == null) return Unauthorized(new { message = "Invalid credentials" });
            return Ok(res);
        }
    }
}
