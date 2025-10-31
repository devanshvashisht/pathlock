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
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public ProjectsController(ApplicationDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirst("uid")!.Value);

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _db.Projects
                .Where(p => p.UserId == CurrentUserId)
                .Select(p => new ProjectDto {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();

            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var project = new ProjectItem
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = CurrentUserId,
                CreatedAt = DateTime.UtcNow
            };

            _db.Projects.Add(project);
            await _db.SaveChangesAsync();

            var outDto = new ProjectDto { Id = project.Id, Title = project.Title, Description = project.Description, CreatedAt = project.CreatedAt };
            return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, outDto);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _db.Projects
                .Include(p => p.Tasks)
                .Where(p => p.Id == id && p.UserId == CurrentUserId)
                .Select(p => new {
                    p.Id, p.Title, p.Description, p.CreatedAt,
                    Tasks = p.Tasks.Select(t => new {
                        t.Id, t.Title, t.DueDate, t.IsCompleted, ProjectItemId = t.ProjectItemId
                    })
                })
                .FirstOrDefaultAsync();

            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
            if (project == null) return NotFound();
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
