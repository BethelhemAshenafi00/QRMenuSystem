using QRMenu.Api.Enums;

namespace QRMenu.Api.DTOs.Order;

public record CreateOrderItemRequest(
    int MenuItemId,
    int Quantity
);

public record CreateOrderRequest(
    OrderType OrderType,
    decimal TotalAmount,
    int? TableId,
    List<CreateOrderItemRequest> Items
);

public record UpdateOrderRequest(
    OrderType OrderType,
    string Status,
    decimal TotalAmount,
    int? TableId
);
public record OrderItemResponse(
    int MenuItemId,
    string ItemName,
    string CategoryName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);

public record OrderResponse(
    int Id,
    string OrderType,
    string Status,
    decimal TotalAmount,
    int? TableId,
    string TableNumber,
    List<OrderItemResponse> Items
);