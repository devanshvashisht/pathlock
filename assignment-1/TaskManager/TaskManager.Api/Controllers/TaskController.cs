using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _service;

        public TasksController(TaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetTasks()
        {
            return Ok(_service.GetAll());
        }

        [HttpPost]
        public ActionResult<TaskItem> AddTask([FromBody] TaskItem newTask)
        {
            if (string.IsNullOrWhiteSpace(newTask.Description))
                return BadRequest("Description cannot be empty.");

            var created = _service.Add(newTask.Description);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public ActionResult<TaskItem> ToggleTask(Guid id)
        {
            var updated = _service.Toggle(id);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(Guid id)
        {
            var result = _service.Delete(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
