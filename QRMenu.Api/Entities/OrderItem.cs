namespace QRMenu.Api.Entities;

public class OrderItem
{
    public int Id { get; set; }

    // Order relationship
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Menu item relationship
    public int MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;

    // How many were ordered
    public int Quantity { get; set; }

    // Price at the time the order was placed
    // This is important because menu prices can change later.
    public decimal UnitPrice { get; set; }
}