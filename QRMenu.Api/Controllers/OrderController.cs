using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.DTOs.Order;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/order")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly AppDbContext _context;

    public OrderController(
        IOrderService orderService,
        AppDbContext context)
    {
        _orderService = orderService;
        _context = context;
    }

    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetAllAsync();

        return Ok(
            orders.Select(ToResponse)
        );
    }

    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetByIdAsync(id);

        if (order is null)
            return NotFound();

        return Ok(ToResponse(order));
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrderRequest request)
    {
        // --------------------------------------
        // VALIDATE TABLE
        // --------------------------------------

        if (request.OrderType == QRMenu.Api.Enums.OrderType.DineIn)
        {
            if (!request.TableId.HasValue)
            {
                return BadRequest(new
                {
                    message = "Table is required for dine-in orders."
                });
            }

            var tableExists = await _context.Tables
                .AnyAsync(t => t.Id == request.TableId.Value);

            if (!tableExists)
            {
                return BadRequest(new
                {
                    message = "The selected table does not exist."
                });
            }
        }

        // --------------------------------------
        // VALIDATE ITEMS
        // --------------------------------------

        if (request.Items is null || request.Items.Count == 0)
        {
            return BadRequest(new
            {
                message = "Order must contain at least one item."
            });
        }

        // --------------------------------------
        // GET MENU ITEMS
        // --------------------------------------

        var menuItemIds = request.Items
            .Select(i => i.MenuItemId)
            .Distinct()
            .ToList();

        var menuItems = await _context.MenuItems
            .Include(m => m.Category)
            .Where(m => menuItemIds.Contains(m.Id))
            .ToListAsync();

        // Check missing menu items
        var missingIds = menuItemIds
            .Except(menuItems.Select(m => m.Id))
            .ToList();

        if (missingIds.Count > 0)
        {
            return BadRequest(new
            {
                message = "One or more menu items do not exist."
            });
        }

        // --------------------------------------
        // CREATE ORDER
        // --------------------------------------

        var order = new Order
        {
            OrderType = request.OrderType,
            TotalAmount = request.TotalAmount,
            TableId = request.TableId,
            Status = "Pending"
        };

        // --------------------------------------
        // CREATE ORDER ITEMS
        // --------------------------------------

        foreach (var requestItem in request.Items)
        {
            var menuItem = menuItems
                .First(m => m.Id == requestItem.MenuItemId);

            if (requestItem.Quantity <= 0)
            {
                return BadRequest(new
                {
                    message =
                        $"Invalid quantity for {menuItem.Name}."
                });
            }

            var orderItem = new OrderItem
            {
                MenuItemId = menuItem.Id,

                Quantity = requestItem.Quantity,

                // Save price at order time
                UnitPrice = menuItem.Price
            };

            order.OrderItems.Add(orderItem);
        }

        // --------------------------------------
        // SAVE ORDER
        // --------------------------------------

        var created = await _orderService.CreateAsync(order);

        // --------------------------------------
        // LOAD COMPLETE ORDER
        // --------------------------------------

        var completeOrder =
            await _orderService.GetByIdAsync(created.Id);

        if (completeOrder is null)
            return NotFound();

        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return CreatedAtAction(
            nameof(GetById),
            new { id = completeOrder.Id },
            ToResponse(completeOrder)
        );
    }

    // ==========================================
    // UPDATE ORDER
    // ==========================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateOrderRequest request)
    {
        var order = new Order
        {
            OrderType = request.OrderType,
            Status = request.Status,
            TotalAmount = request.TotalAmount,
            TableId = request.TableId
        };

        var updated = await _orderService.UpdateAsync(
            id,
            order
        );

        if (updated is null)
            return NotFound();

        return Ok(ToResponse(updated));
    }

    // ==========================================
    // DELETE ORDER
    // ==========================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _orderService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    // ==========================================
    // ENTITY -> RESPONSE
    // ==========================================

    private static OrderResponse ToResponse(Order order)
    {
        var items = order.OrderItems?
            .Select(item => new OrderItemResponse(
                item.MenuItemId,

                item.MenuItem?.Name ?? "",

                item.MenuItem?.Category?.Name ?? "",

                item.Quantity,

                item.UnitPrice,

                item.Quantity * item.UnitPrice
            ))
            .ToList()
            ?? new List<OrderItemResponse>();

        return new OrderResponse(
            order.Id,

            order.OrderType.ToString(),

            order.Status,

            order.TotalAmount,

            order.TableId,

            order.Table?.TableNumber?.ToString() ?? "",

            items
        );
    }
}