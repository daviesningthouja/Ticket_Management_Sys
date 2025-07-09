using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.DTOs;
using AutoMapper;
namespace server.Controllers
{
    [Route("api")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;

        public UsersController(TmsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        [Route("users")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var u = await _context.Users.ToListAsync();
            var users = _mapper.Map<IEnumerable<UserDto>>(u);
            return Ok(users);
            //return await _context.Users.ToListAsync();
        }
        [Route("search/{id}")]
        [HttpGet]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            // TODO: Add validation and password hashing later
            if (user == null)
                return BadRequest();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

    }
}
