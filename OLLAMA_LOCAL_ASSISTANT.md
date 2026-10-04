# Local Ollama assistant

The Life Tracker assistant can use a model running on this computer. Ollama is optional; with it disabled, the built-in tracker agents continue to answer locally in the browser.

## Set up Ollama on Windows

1. Install Ollama from the [official Windows download page](https://ollama.com/download/windows), then start it.
2. In PowerShell, download a model. For example, the current Ollama chat API documentation uses `gemma4`:

   ```powershell
   ollama pull gemma4
   ```

3. Allow only the deployed Life Tracker origin to call the local Ollama API. In PowerShell, append the origin to any existing user-level `OLLAMA_ORIGINS` entries:

   ```powershell
   $existingOrigins = [Environment]::GetEnvironmentVariable('OLLAMA_ORIGINS', 'User')
   $siteOrigin = 'https://eaglelife.netlify.app'
   $origins = @($existingOrigins -split ',' | Where-Object { $_ }) + $siteOrigin | Select-Object -Unique
   [Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', ($origins -join ','), 'User')
   ```

4. Quit and restart Ollama so it reads the new setting.
5. Open the Life Tracker assistant, select **Local AI**, choose **Check Ollama / load models**, choose a model, and enable **Use the selected local model**.

The app calls Ollama's local `GET /api/tags` and `POST /api/chat` endpoints at `http://localhost:11434`. When local mode is enabled, the current question and the relevant subset of tracker data are sent to that local endpoint. The app does not send those prompts to a hosted AI service. Disable local mode to return to the browser-based agents. If Ollama is unavailable, the assistant falls back to those agents.

Keep the `OLLAMA_ORIGINS` value restricted to the exact site origin. Do not expose Ollama on `0.0.0.0`, add a wildcard origin, or use a network tunnel for this integration.

## Official references

- [Ollama Windows downloads](https://ollama.com/download/windows)
- [Ollama API introduction](https://docs.ollama.com/api/introduction)
- [Ollama chat API](https://docs.ollama.com/api/chat)
- [Allowing browser origins](https://docs.ollama.com/faq#how-can-i-allow-additional-web-origins-to-access-ollama)
