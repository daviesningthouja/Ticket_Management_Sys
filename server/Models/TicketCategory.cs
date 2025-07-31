using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

[Table("TicketCategory")]
public partial class TicketCategory
{
    [Key]
    public int Id { get; set; }

    public int EventId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    [ForeignKey("EventId")]
    [InverseProperty("TicketCategories")]
    public virtual Event Event { get; set; } = null!;

    [InverseProperty("Category")]
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    [InverseProperty("Category")]
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
