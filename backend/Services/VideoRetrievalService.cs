using Projet_Sqli.Services;

public class VideoRetrievalService : IHostedService, IDisposable
{
    private Timer _timer;
    private readonly IServiceProvider _serviceProvider;

    public VideoRetrievalService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var runTime = TimeSpan.FromDays(1);
        _timer = new Timer(DoWork, null, TimeSpan.Zero, runTime);
        return Task.CompletedTask;
    }

    public async Task ExecuteAsync()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var videoServices = scope.ServiceProvider.GetRequiredService<VideoServices>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<VideoRetrievalService>>();

            logger.LogInformation("ExecuteAsync method started at {Time}", DateTime.UtcNow);

            try
            {
                foreach (var country in videoServices.countries)
                {

                    logger.LogInformation("Retrieving trending videos for country: {CountryCode}", country.Item1);
                    logger.LogInformation($"Retrieving trending videos for country code: {country.Item1}");

                    var videos = await videoServices.GetTrendingVideosAsync(country.Item1);

                    logger.LogInformation("Retrieved {VideoCount} videos for country: {CountryCode}", videos.Count, country.Item1);
                }

                logger.LogInformation("ExecuteAsync method completed at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while retrieving trending videos.");
            }
        }
    }

    private async void DoWork(object state)
    {
        await ExecuteAsync();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
