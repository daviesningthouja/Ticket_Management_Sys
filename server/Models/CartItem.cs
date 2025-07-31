using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

[Table("CartItem")]
public partial class CartItem
{
    [Key]
    public int Id { get; set; }

    public int CartId { get; set; }

    public int SeatId { get; set; }

    [ForeignKey("CartId")]
    [InverseProperty("CartItems")]
    public virtual Cart Cart { get; set; } = null!;

    [ForeignKey("SeatId")]
    [InverseProperty("CartItems")]
    public virtual Seat Seat { get; set; } = null!;
}
