using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = null!;

        // store password hash
        public string PasswordHash { get; set; } = null!;

        public ICollection<ProjectItem> Projects { get; set; } = new List<ProjectItem>();
    }
}
