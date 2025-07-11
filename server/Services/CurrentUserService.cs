using System.Security.Claims;

namespace server.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetUserId()
        {
            var userID = _httpContextAccessor.HttpContext?.User
                        .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userID))
                throw new UnauthorizedAccessException("User ID not found");

            return int.Parse(userID);
        }

        public string GetUserRole()
        {
            var userRole = _httpContextAccessor.HttpContext?.User
                        .FindFirst(ClaimTypes.Role)?.Value;
            return userRole ?? throw new UnauthorizedAccessException("User role not found");
        }

        public bool IsInRole(string role)
        {
            return GetUserRole().Equals(role, StringComparison.OrdinalIgnoreCase);
        }

        public bool IsAdmin() => IsInRole("Admin");
        public bool IsOrganizer() => IsInRole("Organizer");


    }    
}