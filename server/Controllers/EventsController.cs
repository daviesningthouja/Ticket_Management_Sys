﻿using System;
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
        [Route("events")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
                .Where(e => e.Status == "Approved")
                .ToListAsync();
            var eventDtos = _mapper.Map<IEnumerable<EventDto>>(events);
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


        // GET /api/events/search?title=xxx&location=yyy
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<EventDto>>> SearchEvents([FromQuery] string? title, [FromQuery] string? location)
        {
            if (title == null && location == null)
                return BadRequest("At least one search parameter is required");
            var query = _context.Events.Include(e => e.Organizer).AsQueryable();

            if (!string.IsNullOrEmpty(title))
                query = query.Where(e => e.Title.Contains(title) && e.Status == "Approved");

            if (!string.IsNullOrEmpty(location))
                query = query.Where(e => e.Location != null && e.Location.Contains(location) && e.Status == "Approved");

            var events = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<EventDto>>(events));
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

        [HttpGet("my")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult<IEnumerable<AdminDto>>> GetMyEvents()
        {
            var userId = _currentUser.GetUserId();

            var events = await _context.Events
                .Where(e => e.OrganizerId == userId)
                .Include(e => e.Organizer)
                .Include(e => e.Tickets)
                .ToListAsync();

            var adminDtos = _mapper.Map<IEnumerable<AdminDto>>(events);
            return Ok(adminDtos);
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

            var eventItem = _mapper.Map<Event>(dto);
            var user = await _context.Users.FindAsync(oID);
            dto.OrganizerId = oID;
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
            else
            {
                eventItem.EventDate = eventItem.EventDate;
            }

            // Only update price if it is not 0 (you can change this logic as per your requirement)
            if (dto.Price != 0)
                eventItem.Price = dto.Price;

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
        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }

        [Route("event/delete/{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteEvent(int id)
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Need to be Admin");
            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
                return NotFound();

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();
            return Ok();
        }
        

        //new
        [HttpGet("event/{eventId}/latest-ticket")]
        public async Task<ActionResult<TicketDto>> GetLatestTicketForEvent(int eventId)
        {
            var userId = _currentUser.GetUserId(); // Assuming you're injecting current user context

            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Event)
                .Where(t => t.EventId == eventId)
                //.OrderByDescending(t => t.BookingTime)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    TicketNumber = t.TicketNo,
                    UserId = t.UserId,
                    EventId = t.EventId,
                    BookingTime = t.BookingTime ?? DateTime.MinValue,
                    UserName = t.User.Name,
                    EventTitle = t.Event.Title,
                    Quantity = t.Quantity,
                    TotalPrice = t.TotalPrice
                })
                .ToListAsync();

            if (ticket == null)
                return NotFound("No ticket found for this event.");

            return Ok(ticket);
        }
        [HttpGet("latest-buyers/{eventId}")]
        public async Task<IActionResult> GetLatestBuyersForEvent(int eventId)
        {
            var buyers = await _context.Tickets
                .Where(t => t.EventId == eventId)
                .Include(t => t.User)
                .GroupBy(t => new { t.UserId, t.User.Name })
                .Select(g => new LatestTicketSummaryDto
                {
                    UserId = g.Key.UserId,
                    UserName = g.Key.Name,
                    Quantity = g.Count(),
                    TotalPrice = g.Sum(t => t.TotalPrice ?? 0),
                    LatestBookingTime = g.Max(t => t.BookingTime ?? DateTime.MinValue)
                })
                .OrderByDescending(x => x.LatestBookingTime)
                .ToListAsync();

            return Ok(buyers);
        }

        
    }
}
