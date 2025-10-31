using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.Api.Data;
using ProjectManager.Api.DTOs;
using ProjectManager.Api.Models;

namespace ProjectManager.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public TasksController(ApplicationDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirst("uid")!.Value);

        // ✅ Add Task to Project
        [HttpPost("/api/projects/{projectId}/tasks")]
        public async Task<IActionResult> AddTaskToProject(int projectId, TaskCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var project = await _db.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == CurrentUserId);

            if (project == null) return NotFound(new { message = "Project not found" });

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectItemId = project.Id
            };

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

        // ✅ Get Task by ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _db.Tasks
                .Include(t => t.ProjectItem)
                .Where(t => t.Id == id && t.ProjectItem!.UserId == CurrentUserId)
                .Select(t => new { t.Id, t.Title, t.DueDate, t.IsCompleted, t.ProjectItemId })
                .FirstOrDefaultAsync();

            return task == null ? NotFound() : Ok(task);
        }

        // ✅ Get Tasks in a Project
        [HttpGet("/api/projects/{projectId}/tasks")]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            var tasks = await _db.Tasks
                .Include(t => t.ProjectItem)
                .Where(t => t.ProjectItem!.UserId == CurrentUserId && t.ProjectItemId == projectId)
                .Select(t => new { t.Id, t.Title, t.DueDate, t.IsCompleted })
                .ToListAsync();

            return Ok(tasks);
        }

        // ✅ Update Task
        [HttpPut("{taskId:int}")]
        public async Task<IActionResult> UpdateTask(int taskId, TaskCreateDto dto)
        {
            var task = await _db.Tasks.Include(t => t.ProjectItem)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectItem!.UserId == CurrentUserId);

            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.DueDate = dto.DueDate;
            await _db.SaveChangesAsync();

            return Ok(task);
        }

        // ✅ Toggle Complete
        [HttpPut("{taskId:int}/toggle")]
        public async Task<IActionResult> ToggleTaskCompletion(int taskId)
        {
            var task = await _db.Tasks.Include(t => t.ProjectItem)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectItem!.UserId == CurrentUserId);

            if (task == null) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            await _db.SaveChangesAsync();

            return Ok(new { task.Id, task.IsCompleted });
        }

        // ✅ Delete Task
        [HttpDelete("{taskId:int}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var task = await _db.Tasks.Include(t => t.ProjectItem)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectItem!.UserId == CurrentUserId);

            if (task == null) return NotFound();

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
