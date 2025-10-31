using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required, MinLength(1), MaxLength(200)]
        public string Title { get; set; } = null!;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public int ProjectItemId { get; set; }
        public ProjectItem? ProjectItem { get; set; }
    }
}
