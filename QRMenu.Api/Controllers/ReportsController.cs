using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // DAILY SALES REPORT
    // GET /api/reports/daily-sales?date=2026-08-06
    // ==========================================

    [HttpGet("daily-sales")]
    public async Task<IActionResult> GetDailySales(
        [FromQuery] DateTime? date)
    {
        var selectedDate = date?.Date ?? DateTime.UtcNow.Date;

        var nextDate = selectedDate.AddDays(1);

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o =>
                o.CreatedAt >= selectedDate &&
                o.CreatedAt < nextDate)
            .ToListAsync();

        var totalOrders = orders.Count;

        var completedOrders = orders.Count(o =>
            o.Status == "Delivered" ||
            o.Status == "Completed");

        var cancelledOrders = orders.Count(o =>
            o.Status == "Cancelled");

        var totalSales = orders
            .Where(o =>
                o.Status != "Cancelled")
            .Sum(o => o.TotalAmount);

        var averageOrderValue = totalOrders > 0
            ? totalSales / totalOrders
            : 0;

        return Ok(new
        {
            date = selectedDate.ToString("yyyy-MM-dd"),
            totalOrders,
            totalSales,
            averageOrderValue,
            completedOrders,
            cancelledOrders
        });
    }
}
