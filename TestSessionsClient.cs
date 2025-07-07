using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

public class TestSessionsClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _apiKey;

    public TestSessionsClient(string baseUrl, string apiKey)
    {
        _baseUrl = baseUrl.TrimEnd('/');
        _apiKey = apiKey;
        _httpClient = new HttpClient();
    }

    private void AddApiKeyHeader(HttpRequestMessage request)
    {
        request.Headers.Remove("x-api-key");
        request.Headers.Add("x-api-key", _apiKey);
    }

    public async Task<List<DeviceSession>> GetAllSessionsAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/test-sessions");
        AddApiKeyHeader(request);
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var sessions = await response.Content.ReadFromJsonAsync<List<DeviceSession>>();
        return sessions ?? new List<DeviceSession>();
    }

    public async Task<DeviceSession?> PostSessionTreeAsync(string deviceKey, object tree)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/test-sessions/{deviceKey}")
        {
            Content = JsonContent.Create(tree)
        };
        AddApiKeyHeader(request);
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var session = await response.Content.ReadFromJsonAsync<DeviceSession>();
        return session;
    }

    public async Task<JsonElement?> GetSessionTreeAsync(string deviceKey)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/test-sessions/{deviceKey}");
        AddApiKeyHeader(request);
        var response = await _httpClient.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;
        response.EnsureSuccessStatusCode();
        var tree = await response.Content.ReadFromJsonAsync<JsonElement>();
        return tree;
    }
}

public class DeviceSession
{
    public string deviceKey { get; set; } = string.Empty;
    public JsonElement tree { get; set; }
} 