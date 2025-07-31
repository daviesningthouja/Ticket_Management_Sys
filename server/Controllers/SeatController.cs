using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.Ticket;
using server.Models;
using server.Services;
using AutoMapper;

namespace server.Controllers
{
    [ApiController]
    [Route("api/seats")]
    [Authorize]
    public class SeatController : ControllerBase
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;

        public SeatController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        // GET: api/seats/category/5
        [HttpGet("category/{categoryId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GetSeatsByCategory(int categoryId)
        {
            var seats = await _context.Seats
                .Include(s => s.Category)
                .Where(s => s.CategoryId == categoryId)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<SeatDto>>(seats));
        }

        // GET: api/seats/event/5/available
        [HttpGet("event/{eventId}/available")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GetAvailableSeats(int eventId)
        {
            var seats = await _context.Seats
                .Include(s => s.Category)
                .Where(s => s.Category.EventId == eventId && (s.IsBooked == null || s.IsBooked == false))
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<SeatDto>>(seats));
        }
        /*
        // POST: api/seats
        [HttpPost]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult<SeatDto>> CreateSeat([FromBody] CreateSeatRequest request)
        {
            var category = await _context.TicketCategories
                .Include(tc => tc.Event)
                .FirstOrDefaultAsync(tc => tc.Id == request.CategoryId);

            if (category == null)
                return NotFound("Category not found.");

            // Ownership check for organizers
            if (_currentUser.IsOrganizer() && category.Event.OrganizerId != _currentUser.GetUserId())
                return Forbid();

            var seat = _mapper.Map<Seat>(request);
            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSeatsByCategory), new { categoryId = seat.CategoryId }, _mapper.Map<SeatDto>(seat));
        }
        */
        // POST: api/seats
        [HttpPost("generate")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<IActionResult> GenerateSeatsForCategory([FromBody] CreateSeatsRequest request)
        {
            // 1. Validate category
            var category = await _context.TicketCategories
                .Include(tc => tc.Event)
                .FirstOrDefaultAsync(tc => tc.Id == request.CategoryId);

            if (category == null)
                return NotFound("Ticket category not found.");

            // 2. Check organizer owns the event if role is Organizer
            if (_currentUser.IsOrganizer() && category.Event.OrganizerId != _currentUser.GetUserId())
                return Forbid();

            // 3. Check if seats already exist for this category, avoid duplicates (optional)
            bool seatsExist = await _context.Seats.AnyAsync(s => s.CategoryId == request.CategoryId);
            if (seatsExist)
                return BadRequest("Seats already generated for this category.");

            // 4. Generate seats
            var seats = new List<Seat>();
            for (int row = 0; row < request.RowNumber; row++)
            {
                char rowLetter = (char)('A' + row);
                for (int col = 1; col <= request.ColumnNumber; col++)
                {
                    string seatNumber = $"{rowLetter}{col}";
                    seats.Add(new Seat
                    {
                        CategoryId = request.CategoryId,
                        SeatNumber = seatNumber,
                        RowNumber = row + 1,
                        ColumnNumber = col,
                        IsBooked = false
                    });
                }
            }

            // 5. Save all seats
            _context.Seats.AddRange(seats);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully generated {seats.Count} seats for category '{category.Name}'." });
        }


       // PUT: api/seats/5

[HttpPut("{id}")]
[Authorize(Roles = "Organizer,Admin")]
public async Task<ActionResult<SeatDto>> UpdateSeat(int id, [FromBody] UpdateSeatRequest request)
{
    // ✅ Step 1: Check for null request body (bad JSON, etc.)
    if (request == null)
        return BadRequest("Invalid or empty request body.");

    // ✅ Step 2: Find the seat including its category and parent event
    var seat = await _context.Seats
        .Include(s => s.Category)
        .ThenInclude(c => c.Event)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (seat == null)
        return NotFound("Seat not found.");

    // ✅ Step 3: Organizer can only modify seats of their own events
    if (_currentUser.IsOrganizer() && seat.Category.Event.OrganizerId != _currentUser.GetUserId())
        return Forbid("You are not authorized to update this seat.");

    // ✅ Step 4: Apply updates using AutoMapper (only non-null fields)
    _mapper.Map(request, seat);

    // ✅ Step 5: Save and return the updated seat DTO
    await _context.SaveChangesAsync();

    return Ok(_mapper.Map<SeatDto>(seat));
}




        // DELETE: api/seats/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound("Seat not found.");

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
