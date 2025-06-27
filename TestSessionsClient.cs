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

    public TestSessionsClient(string baseUrl)
    {
        _baseUrl = baseUrl.TrimEnd('/');
        _httpClient = new HttpClient();
    }

    public async Task<List<DeviceSession>> GetAllSessionsAsync()
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/test-sessions");
        response.EnsureSuccessStatusCode();
        var sessions = await response.Content.ReadFromJsonAsync<List<DeviceSession>>();
        return sessions ?? new List<DeviceSession>();
    }

    public async Task<DeviceSession?> PostSessionTreeAsync(string deviceKey, object tree)
    {
        var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/test-sessions/{deviceKey}", tree);
        response.EnsureSuccessStatusCode();
        var session = await response.Content.ReadFromJsonAsync<DeviceSession>();
        return session;
    }

    public async Task<JsonElement?> GetSessionTreeAsync(string deviceKey)
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/test-sessions/{deviceKey}");
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