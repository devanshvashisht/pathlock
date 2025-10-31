using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.DTOs
{
    public class TaskCreateDto
    {
        [Required, MinLength(1), MaxLength(200)]
        public string Title { get; set; } = null!;

        public DateTime? DueDate { get; set; }
    }
}
