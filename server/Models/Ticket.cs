using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class Ticket
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string TicketNo { get; set; } = null!;

    public int UserId { get; set; }

    public int EventId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? BookingTime { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? TotalPrice { get; set; }

    [StringLength(20)]
    public string? Status { get; set; }

    public int? SeatId { get; set; }

    public int? CategoryId { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("Tickets")]
    public virtual TicketCategory Category { get; set; } = null!;

    [ForeignKey("EventId")]
    [InverseProperty("Tickets")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("SeatId")]
    [InverseProperty("Tickets")]
    public virtual Seat Seat { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Tickets")]
    public virtual User User { get; set; } = null!;
}
