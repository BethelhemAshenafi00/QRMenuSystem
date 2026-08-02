namespace QRMenu.Api.DTOs.Table;

public record CreateTableRequest(string TableNumber, string QrCodeUrl);

public record UpdateTableRequest(string TableNumber, string QrCodeUrl);

public record TableResponse(int Id, string TableNumber, string QrCodeUrl);