using AutoMapper;
using server.Models;
using server.DTOs;

namespace server.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Event, EventDto>();
            CreateMap<User, OrganizerDto>();
            CreateMap<CreateEventRequest, Event>();
        }
    }
}
