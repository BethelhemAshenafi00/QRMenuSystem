using QRMenu.Api.Enums;

namespace QRMenu.Api.Entities;

public class Order
{
    public int Id { get; set; }

    public OrderType OrderType { get; set; }

    public string Status { get; set; } = "Pending";

    public decimal TotalAmount { get; set; }

    // When the order was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Nullable because takeaway orders don't have a table
    public int? TableId { get; set; }

    public Table? Table { get; set; }

    // Order -> OrderItems
    public ICollection<OrderItem> OrderItems { get; set; }
        = new List<OrderItem>();
}