using Microsoft.AspNetCore.Http;

namespace QRMenu.Api.Services
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file, string folderName);
    }
}
