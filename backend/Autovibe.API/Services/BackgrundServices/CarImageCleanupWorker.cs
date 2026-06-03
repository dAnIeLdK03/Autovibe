

using Autovibe.API.Data;
using Autovibe.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Autovibe.API.Services.BackgroundSevices
{
    public class CarImageCleanupWorker : BackgroundService
    {
        private readonly ILogger<CarImageCleanupWorker> _logger;
        private readonly IWebHostEnvironment _env;
        private readonly IServiceProvider _serviceProvider;

        public CarImageCleanupWorker(ILogger<CarImageCleanupWorker> logger, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _env = env;
            _serviceProvider = serviceProvider;
        }

        
        private DateTime _lastRun = DateTime.MinValue;
        
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Car image cleanup worker started successfully");
            
            while (!stoppingToken.IsCancellationRequested)
            {

                var now = DateTime.UtcNow;

                if(now.Hour == 3 && _lastRun.Date < now.Date)
                {
                    try
                    {
                        await CleanOrphanedImagesAsync();
                        _lastRun = now;
                    }catch(Exception ex)
                    {
                        _logger.LogError(ex, "Error during cleaning images");
                    }
                }
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task CleanOrphanedImagesAsync()
        {
            _logger.LogInformation("Scanning for orphaned images started...");

            var carsFolder = Path.Combine(_env.WebRootPath, "images", "cars");
            if(!Directory.Exists(carsFolder)) return;

            var filePaths = Directory.GetFiles(carsFolder);

            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var allActiveImageUrls = await context.Cars
                    .AsNoTracking()
                    .SelectMany(c => c.ImageUrls)
                    .ToListAsync();

                var activeFileNamesInDb = allActiveImageUrls
                    .Select(url => Path.GetFileName(url))
                    .ToHashSet();

                    int deletedCount = 0;

                    foreach (var filePath in filePaths)
                {
                    var fileName = Path.GetFileName(filePath);

                    if (!activeFileNamesInDb.Contains(fileName))
                    {
                        var fileInfo =  new FileInfo(filePath);

                        if(fileInfo.CreationTimeUtc < DateTime.UtcNow.AddHours(-2))
                        {
                            File.Delete(filePath);
                            deletedCount++;
                            _logger.LogInformation($"Deleted orphanded file: {fileName}");
                        }
                    }
                }
                if(deletedCount > 0)
                {
                    _logger.LogInformation($"The cleaning ended. Deleted files: {deletedCount}");
                }
            }
        }
        
    }
}