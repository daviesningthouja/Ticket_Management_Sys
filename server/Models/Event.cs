using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class Event
{
    [Key]
    public int Id { get; set; }

    [StringLength(150)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(255)]
    public string? Location { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EventDate { get; set; }

    [StringLength(20)]
    public string? Status { get; set; }

    public int OrganizerId { get; set; }

    public string? ImageUrl { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("OrganizerId")]
    [InverseProperty("Events")]
    public virtual User Organizer { get; set; } = null!;

    [InverseProperty("Event")]
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    [NotMapped]
    public decimal TotalRevenue => Tickets?.Sum(t => t.TotalPrice) ?? 0;
}
