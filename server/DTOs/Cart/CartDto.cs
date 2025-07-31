namespace server.DTOs.Cart
{
    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public List<CartItemDto> Items { get; set; } = new();
    }
    public class CartItemDto
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int SeatId { get; set; }

        public string SeatNumber { get; set; } = null!;
        public decimal Price { get; set; }

        // Optional UI metadata
        public string? CategoryName { get; set; }
        public string? EventTitle { get; set; }
    }

    public class CreateCartItemRequest
    {
        public int CartId { get; set; }
        public int SeatId { get; set; }
    }

     public class UpdateCartItemRequest
    {
        public int? SeatId { get; set; }
        // optionally extend later with quantity, etc.
    }
}