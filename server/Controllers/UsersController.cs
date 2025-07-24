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
using Microsoft.AspNetCore.Authorization;
using server.Services;
using server.DTOs.Users;
namespace server.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class UsersController : Controller
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;

        public UsersController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _mapper = mapper;
            _context = context;
            _currentUser = currentUser;
        }

        [Route("user/profile")]
        [HttpGet]
        public async Task<ActionResult> GetUserProfile()
        {
            var uID = _currentUser.GetUserId();
            var u = await _context.Users
                            .FindAsync(uID);
            var user = _mapper.Map<UserDto>(u);
            return Ok(user);
        }

        [Route("user/profile/edit")]
        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> EditUserProfile([FromForm] EditUserProfile req)
        {
            var uID = _currentUser.GetUserId();
            var u = await _context.Users.FindAsync(uID);
            if (u == null)
                return BadRequest("Please fill the Name");
            if (req.PfpUrl != null && req.PfpUrl.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pfp");
                var unqFileName = $"{Guid.NewGuid()}{Path.GetExtension(req.PfpUrl?.FileName)}";
                var filePath = Path.Combine(uploadsFolder, unqFileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                if (req.PfpUrl != null)
                {
                    await req.PfpUrl.CopyToAsync(stream);
                }
                u.PfpUrl = $"/pfp/{unqFileName}";
            }

            // Update only fields that are not null
            if (!string.IsNullOrEmpty(req.Name))
                u.Name = req.Name;

            if (!string.IsNullOrEmpty(req.Email))
            {
                // Optional: prevent duplicate email update
                var exists = await _context.Users.AnyAsync(u => u.Email == req.Email && u.Id != uID);
                if (exists)
                    return BadRequest("Email already in use.");
                u.Email = req.Email;
            }
            await _context.SaveChangesAsync();
            var profile = _mapper.Map<UserDto>(u);

            return Ok(profile);
        }



        //Admin || Organizer
        [Route("user/acc/delete/{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteUser(int id)
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Unauthorized. Admin action");

            var uID = id;
            var u = await _context.Users.FindAsync(uID);
            if (u == null)
                return BadRequest("invalid user");
            _context.Users.Remove(u);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET /api/events/search?title=xxx&location=yyy
        [HttpGet("user/search")]
        public async Task<ActionResult<IEnumerable<UserDto>>> SearchEvents([FromQuery] string? userName)
        {
            if (userName == null )
                return BadRequest("At least one search parameter is required");
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(userName))
                query = query.Where(u => u.Name.Contains(userName) && u.Role != "Admin");

            var users = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));
        }



        [Route("users/list")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Needs Admin Permission");
            var u = await _context.Users
                        .Where(e => e.Role == "User" || e.Role == "Organizer")
                        .ToListAsync();
            var users = _mapper.Map<IEnumerable<UserDto>>(u);
            return Ok(users);
            //return await _context.Users.ToListAsync();
        }
        [Route("user/{id}")]
        [HttpGet]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (!_currentUser.IsOrganizer() || !_currentUser.IsAdmin())
                return Unauthorized("Needs to be organizer or admin");
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        /*
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
        */

    }
}
