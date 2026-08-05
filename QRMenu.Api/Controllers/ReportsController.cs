using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.DTOs.Reports;

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

        var completedOrders = orders
            .Where(o => o.Status.Equals(
                "Completed",
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        var cancelledOrders = orders
            .Count(o => o.Status.Equals(
                "Cancelled",
                StringComparison.OrdinalIgnoreCase));

        var totalSales = completedOrders
            .Sum(o => o.TotalAmount);

        var averageOrderValue = completedOrders.Count > 0
            ? totalSales / completedOrders.Count
            : 0;

        var response = new DailySalesReportResponse
        {
            Date = selectedDate,
            TotalOrders = orders.Count,
            TotalSales = totalSales,
            AverageOrderValue = averageOrderValue,
            CompletedOrders = completedOrders.Count,
            CancelledOrders = cancelledOrders
        };

        return Ok(response);
    }
}