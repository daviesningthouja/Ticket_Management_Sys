using System.Security.Claims;

namespace server.Services
{
    public interface ICurrentUserService
    {
        int GetUserId();
        string GetUserRole();

         bool IsInRole(string role);
         bool IsAdmin();
         bool IsOrganizer();
    }

}