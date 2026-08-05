namespace QRMenu.Api.DTOs.Reports;

public class DailySalesReportResponse
{
    public DateTime Date { get; set; }

    public int TotalOrders { get; set; }

    public decimal TotalSales { get; set; }

    public decimal AverageOrderValue { get; set; }

    public int CompletedOrders { get; set; }

    public int CancelledOrders { get; set; }
}