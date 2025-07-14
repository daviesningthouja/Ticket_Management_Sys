using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

[Index("Email", Name = "UQ__Users__A9D10534DF0AD529", IsUnique = true)]
public partial class User
{
    [Key]
    public int Id { get; set; }

    public string? PfpUrl { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    [StringLength(20)]
    public string Role { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [InverseProperty("Organizer")]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    [InverseProperty("User")]
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
