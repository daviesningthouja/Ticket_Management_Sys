using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

[Table("Seat")]
public partial class Seat
{
    [Key]
    public int Id { get; set; }

    public int CategoryId { get; set; }

    [StringLength(10)]
    public string SeatNumber { get; set; } = null!;

    public bool? IsBooked { get; set; }

    public int? TicketId { get; set; }

    public int RowNumber { get; set; }

    public int ColumnNumber { get; set; }

    [InverseProperty("Seat")]
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    [ForeignKey("CategoryId")]
    [InverseProperty("Seats")]
    public virtual TicketCategory Category { get; set; } = null!;

    [InverseProperty("Seat")]
    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
