using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.DTOs;
using server.DTOs.Events;
using Microsoft.AspNetCore.Authorization;
using server.Services;
using System.Security.Cryptography;
using server.DTOs.Ticket;
using server.DTOs.Admin;
namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class EventsController : Controller
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;
        public EventsController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        // GET: Events
        [Route("events/all")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
                .ToListAsync();


            var eventDtos = _mapper.Map<IEnumerable<EventDto>>(events);
            return Ok(eventDtos);
        }
        [Route("event")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvent()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.TicketCategories)
                    .ThenInclude(tc => tc.Seats)
                //.Where(e => e.Status == "Approved" || e.Status == "Completed")
                .ToListAsync();

            var eventDtos = _mapper.Map<List<EventDto>>(events);

            foreach (var dto in eventDtos)
            {
                var matchingEvent = events.First(e => e.Id == dto.Id);

                // ✅ AvailableSeats
                dto.AvailableTickets = matchingEvent.TicketCategories
                    .SelectMany(tc => tc.Seats)
                    .Count(s => s.IsBooked != true);

                // ✅ StartingPrice
                dto.StartingPrice = matchingEvent.TicketCategories
                    .OrderBy(tc => tc.Price)
                    .Select(tc => (decimal?)tc.Price)
                    .FirstOrDefault();
            }
            var tcCount = await _context.TicketCategories.CountAsync(tc => tc.EventId == 1);
            Console.WriteLine($"TicketCategories: {tcCount}");
            var seatCount = await _context.Seats
                .Where(s => s.Category.EventId == 1)
                .CountAsync();
            Console.WriteLine($"Total Seats: {seatCount}");
            var availableSeatCount = await _context.Seats
                .Where(s => s.Category.EventId == 1 && (s.IsBooked == null || s.IsBooked == false))
                .CountAsync();
            Console.WriteLine($"Available Seats: {availableSeatCount}");
            return Ok(eventDtos);
        }

        [Route("event/{id}")]
        [HttpGet]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventItem = await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.Tickets)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (!EventExists(id))
                return NotFound();
            var eventDto = _mapper.Map<EventDto>(eventItem);
            return Ok(eventDto);
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }

        //New Update 
        [Route("event/{eventId}/categories")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketCategoryDto>>> GetEventCategories(int eventId)
        {
            var categories = await _context.TicketCategories
                .Where(tc => tc.EventId == eventId)
                .Include(tc => tc.Seats)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<TicketCategoryDto>>(categories));
        }

        [HttpGet("event/{eventId}/available-seats")]
        public async Task<IActionResult> GetAvailableSeats(int eventId)
        {
            var seats = await _context.Seats
                .Include(s => s.Category)
                .Where(s => s.Category.EventId == eventId && (s.IsBooked == null || s.IsBooked == false))
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<SeatDto>>(seats));
        }




        // GET /api/events/search?title=xxx&location=yyy
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<EventDto>>> SearchEvents([FromQuery] string? title, [FromQuery] string? location)
        {
            if (title == null && location == null)
                return BadRequest("At least one search parameter is required");
            if (_currentUser.IsInRole("User"))
            {

                var query = _context.Events.Include(e => e.Organizer).AsQueryable();

                if (!string.IsNullOrEmpty(title))
                    query = query.Where(e => e.Title.Contains(title));

                if (!string.IsNullOrEmpty(location))
                    query = query.Where(e => e.Location != null && e.Location.Contains(location));

                var events = await query.ToListAsync();
                return Ok(_mapper.Map<IEnumerable<EventDto>>(events));
            }
            else
            {
                var query = _context.Events.Include(e => e.Organizer).AsQueryable();

                if (!string.IsNullOrEmpty(title))
                    query = query.Where(e => e.Title.Contains(title));

                if (!string.IsNullOrEmpty(location))
                    query = query.Where(e => e.Location != null && e.Location.Contains(location));

                var events = await query.ToListAsync();
                return Ok(_mapper.Map<IEnumerable<EventDto>>(events));
            }
        }

        /*_________________________________________*/
        //ROLE: Organizer
        /*_________________________________________*/
        [Route("org/events")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetOrganizerEvents()
        {
            if (!_currentUser.IsOrganizer())
                return Unauthorized("Needs to be organizer");
            //var organizer = await _context.Users.FindAsync(organizerId);
            // if (organizer == null || organizer.Role != "Organizer")
            //     return BadRequest("Organizer not found");

            var organizerId = _currentUser.GetUserId();
            var events = await _context.Events
                .Where(e => e.OrganizerId == organizerId)
                .Include(e => e.Organizer)
                .ToListAsync();

            var eventDtos = _mapper.Map<IEnumerable<EventDto>>(events);
            return Ok(eventDtos);
        }

        [Route("event/create")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<EventDto>> CreateEvent([FromForm] CreateEventRequest dto)
        {
            if (!_currentUser.IsOrganizer())
                return Unauthorized("Needs to be organizer");

            if (dto == null)
                return BadRequest("Event data is null");

            // if (dto.EventDate.Date < DateTime.UtcNow.Date)
            //     return BadRequest("Event date cannot be in the past.");

            //var organizer = await _context.Users.FindAsync(oID);
            //dto.OrganizerId = oID;
            var ImgUrl = "";
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                // Save the image file and get the URL
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img");
                Directory.CreateDirectory(uploadsFolder); // create folder if not exists

                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile?.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    if (dto.ImageFile != null)
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }
                }

                ImgUrl = $"/img/{uniqueFileName}";
            }


            var oID = _currentUser.GetUserId();
            var user = await _context.Users.FindAsync(oID);

            var eventItem = _mapper.Map<Event>(dto);
            // eventItem.EventDate = DateTime.SpecifyKind(dto.EventDate, DateTimeKind.Local).ToUniversalTime();


            // dto.OrganizerId = oID;
            eventItem.ImageUrl = ImgUrl;
            //auto take organizer id from token
            eventItem.OrganizerId = oID;
            if (eventItem == null)
                return BadRequest("Event data is null");

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            await _context.Entry(eventItem)
                .Reference(e => e.Organizer)
                .LoadAsync(); // Load the organizer after saving

            var eventDto = _mapper.Map<EventDto>(eventItem);

            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventDto);
        }

        [Route("event/{id}")]
        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<EventDto>> UpdateEvent(int id, [FromForm] CreateEventRequest dto)
        {
            // TODO: Validate the request body
            if (!_currentUser.IsOrganizer())
                return Unauthorized("Need To be Organizer");

            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
                return NotFound();

            var ImgUrl = "";
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile?.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    if (dto.ImageFile != null)
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }
                }

                ImgUrl = $"/img/{uniqueFileName}";
            }

            var oID = _currentUser.GetUserId();
            // _mapper.Map(dto, eventItem);

            if (!string.IsNullOrWhiteSpace(dto.Title))
                eventItem.Title = dto.Title;

            if (!string.IsNullOrWhiteSpace(dto.Description))
                eventItem.Description = dto.Description;

            if (!string.IsNullOrWhiteSpace(dto.Location))
                eventItem.Location = dto.Location;

            // Check if a valid date is sent (not the default DateTime.MinValue)
            if (dto.EventDate > DateTime.MinValue)
                eventItem.EventDate = dto.EventDate;
            // else
            // {
            //     eventItem.EventDate = DateTime.SpecifyKind(dto.EventDate, DateTimeKind.Local).ToUniversalTime();
            // }

            // Only update price if it is not 0 (you can change this logic as per your requirement)


            // Only update if a new image was uploaded
            if (!string.IsNullOrEmpty(ImgUrl))
                eventItem.ImageUrl = ImgUrl;

            eventItem.OrganizerId = oID;
            _context.Events.Update(eventItem);
            await _context.SaveChangesAsync();

            var eventDto = _mapper.Map<EventDto>(eventItem);
            return Ok(eventDto);
        }



        /*_________________________________________*/
        //ROLE: Administrator
        /*_________________________________________*/
        [Route("admin/events/{id}/status")]
        [HttpPatch]
        public async Task<IActionResult> ChangeEventStatus(int id, [FromQuery] string status)
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Needs to be Admin");

            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            if (status != "Approved" && status != "Rejected")
                return BadRequest("Invalid status. Use 'Approved' or 'Rejected'.");
            ev.Status = status;
            _context.Events.Update(ev);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Event status changed to {status}" });
        }

        [Route("admin/events/pending")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetPendingEvents()
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Need to be Admins");

            var pendingEvents = await _context.Events
                .Where(e => e.Status == "Pending")
                .Include(e => e.Organizer)
                .ToListAsync();

            var pendingEventDtos = _mapper.Map<IEnumerable<EventDto>>(pendingEvents);
            return Ok(pendingEventDtos);
        }

        [Route("event/delete/{id}")]
        [Authorize(Roles = "Admin, Organizer")]
        [HttpDelete]
        public async Task<ActionResult> DeleteEvent(int id)
        {


            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
                return NotFound();

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpPost("admin/update-statuses")]
        public async Task<IActionResult> UpdateEventAndTicketStatuses()
        {
            var today = DateTime.UtcNow.Date;

            // 1. Update Events
            var pastEvents = await _context.Events
                .Where(e => e.EventDate < today && e.Status == "Approved")
                .ToListAsync();

            foreach (var ev in pastEvents)
            {
                ev.Status = "Completed";
            }

            // 2. Update Tickets related to past events
            var pastEventIds = pastEvents.Select(e => e.Id).ToList();

            var relatedTickets = await _context.Tickets
                .Where(t => pastEventIds.Contains(t.EventId) && t.Status != "Expired")
                .ToListAsync();

            foreach (var ticket in relatedTickets)
            {
                ticket.Status = "Expired";
            }

            var upcomingEvent = await _context.Events
                .Where(e => e.EventDate > today && e.Status == "Approved")
                .ToListAsync();
            var upcomingEventIds = upcomingEvent.Select(e => e.Id).ToList();
            var validTickets = await _context.Tickets
                .Where(t => upcomingEventIds.Contains(t.EventId) && t.Status != "Expired")
                .ToListAsync();
            foreach (var ticket in validTickets)
            {
                ticket.Status = "Valid";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                UpdatedEvents = pastEvents.Count,
                ExpiredTickets = relatedTickets.Count,
                ValidTickets = validTickets.Count
            });
        }









    }
}
