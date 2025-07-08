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

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    public class EventsController : Controller
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        public EventsController(TmsContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: Events
        [Route("events")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
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
                .FirstOrDefaultAsync(e => e.Id == id);

            if (!EventExists(id))
                return NotFound();
            var eventDto = _mapper.Map<EventDto>(eventItem);
            return Ok(eventDto);  
        }

        /*_________________________________________*/
        //ROLE: Organizer
        /*_________________________________________*/


        [Route("event/create")]
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] CreateEventRequest dto)
        {
            var organizer = await _context.Users.FindAsync(dto.OrganizerId);
            if (organizer == null)
                return BadRequest("Organizer not found");
                
            var eventItem = _mapper.Map<Event>(dto);
            if (eventItem == null)
                return BadRequest("Event data is null");
            
            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();
            await _context.Entry(eventItem)
                .Reference(e => e.Organizer)
                .LoadAsync(); // Load the organizer after saving

            var eventDto = _mapper.Map<EventDto>(eventItem);

            return CreatedAtAction(nameof(GetEvent), new { id = eventDto.Id }, eventDto);
        }
        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
