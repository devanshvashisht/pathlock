using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = null!;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; set; } = null!;
    }
}
