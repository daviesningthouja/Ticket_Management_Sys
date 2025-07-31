using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.Ticket;
using server.Models;
using AutoMapper;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/ticket-categories")]
    [Authorize]
    public class TicketCategoryController : ControllerBase
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;

        public TicketCategoryController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        // GET: api/ticket-categories/event/5
        [AllowAnonymous]
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<TicketCategoryDto>>> GetCategoriesByEvent(int eventId)
        {
            var categories = await _context.TicketCategories
                .Include(tc => tc.Seats)
                .Where(tc => tc.EventId == eventId)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<TicketCategoryDto>>(categories));
        }

        // POST: api/ticket-categories
        [HttpPost]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult<TicketCategoryDto>> CreateCategory([FromBody] CreateTicketCategoryRequest request)
        {
            if (!_currentUser.IsOrganizer() && !_currentUser.IsAdmin())
                return Forbid();

            var eventExists = await _context.Events.AnyAsync(e => e.Id == request.EventId);
            if (!eventExists)
                return NotFound("Event not found.");

            var category = _mapper.Map<TicketCategory>(request);
            _context.TicketCategories.Add(category);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<TicketCategoryDto>(category);
            return CreatedAtAction(nameof(GetCategoriesByEvent), new { eventId = category.EventId }, resultDto);
        }

        // PUT: api/ticket-categories/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult<TicketCategoryDto>> UpdateCategory(int id, [FromBody] UpdateTicketCategoryRequest request)
        {
            var category = await _context.TicketCategories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");

            // Optional: Check ownership for organizers
            if (_currentUser.IsOrganizer())
            {
                var eventItem = await _context.Events.FindAsync(category.EventId);
                if (eventItem?.OrganizerId != _currentUser.GetUserId())
                    return Forbid();
            }

            _mapper.Map(request, category);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<TicketCategoryDto>(category));
        }
        
        // DELETE: api/ticket-categories/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.TicketCategories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");

            _context.TicketCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
