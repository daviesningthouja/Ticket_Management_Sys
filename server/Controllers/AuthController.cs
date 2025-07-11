using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs.Auths;
using server.DTOs;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(TmsContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already registered.");
            }
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }
            if (request.Role == null)
                request.Role = "User";
            
            var user = _mapper.Map<User>(request);
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password ?? "");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User registered successfully." }); 

        }
        
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var u = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (u == null)
                return Unauthorized("Invalid email.");
            
            var ps = u.PasswordHash;

            if (ps ==  request.Password)
            {
                var token = GenerateJwtToken(u);
                var authResponse = _mapper.Map<AuthResponse>(u);
                authResponse.Token = token;
                return Ok(authResponse);
            }else {

            var result = _passwordHasher.VerifyHashedPassword(u, u.PasswordHash, request.Password ?? "");
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid password.");
            
            var token = GenerateJwtToken(u);

            var authResponse = _mapper.Map<AuthResponse>(u);
            authResponse.Token = token;
            return Ok(authResponse);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
        
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));      
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}