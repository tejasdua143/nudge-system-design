// Code examples component for API documentation
(function () {
    function createCodeExamples(apiEndpoint, method, requestBody, responseBody) {
        const isFormData = method === "POST" && (apiEndpoint.includes("/file") || (apiEndpoint.includes("/document") && !apiEndpoint.includes("/content")));

        // Handle JSON stringified fields - for content/document API, slides needs to be stringified
        const processedBody = { ...requestBody };
        if (processedBody.slides && Array.isArray(processedBody.slides)) {
            // For content/document API, slides must be JSON stringified
            processedBody.slides = JSON.stringify(processedBody.slides);
        }

        const examples = {
            shell: {
                name: "Shell",
                icon: "//",
                code: isFormData
                    ? `curl -X ${method} https://developers.presentations.ai${apiEndpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "topic=${processedBody.topic || "Your Topic"}" \\
  -F "slideCount=${processedBody.slideCount || 10}" \\
  -F "language=${processedBody.language || "en"}" \\
  -F "domain=${processedBody.domain || "presentations.ai"}" \\
  -F "exportType=${processedBody.exportType || "ppt"}"`
                    : `curl -X ${method} https://developers.presentations.ai${apiEndpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(processedBody, null, 2)}'`,
            },
            node: {
                name: "Node",
                icon: "JS",
                code: isFormData
                    ? `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('topic', '${processedBody.topic || "Your Topic"}');
form.append('slideCount', ${processedBody.slideCount || 10});
form.append('language', '${processedBody.language || "en"}');
form.append('domain', '${processedBody.domain || "presentations.ai"}');
form.append('exportType', '${processedBody.exportType || "ppt"}');

const response = await axios.post('https://developers.presentations.ai${apiEndpoint}', form, {
  headers: {
    ...form.getHeaders(),
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

console.log(response.data);`
                    : `const axios = require('axios');

const response = await axios.${method.toLowerCase()}('https://developers.presentations.ai${apiEndpoint}', ${JSON.stringify(processedBody, null, 2)}, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

console.log(response.data);`,
            },
            python: {
                name: "Python",
                icon: "🐍",
                code: isFormData
                    ? `import requests

url = "https://developers.presentations.ai${apiEndpoint}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "topic": "${processedBody.topic || "Your Topic"}",
    "slideCount": ${processedBody.slideCount || 10},
    "language": "${processedBody.language || "en"}",
    "domain": "${processedBody.domain || "presentations.ai"}",
    "exportType": "${processedBody.exportType || "ppt"}"
}

response = requests.${method.toLowerCase()}(url, data=data, headers=headers)
print(response.json())`
                    : `import requests

url = "https://developers.presentations.ai${apiEndpoint}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = ${JSON.stringify(processedBody, null, 2)}

response = requests.${method.toLowerCase()}(url, json=data, headers=headers)
print(response.json())`,
            },
            php: {
                name: "PHP",
                icon: "php",
                code: isFormData
                    ? `<?php
$url = "https://developers.presentations.ai${apiEndpoint}";
$data = [
    'topic' => '${processedBody.topic || "Your Topic"}',
    'slideCount' => ${processedBody.slideCount || 10},
    'language' => '${processedBody.language || "en"}',
    'domain' => '${processedBody.domain || "presentations.ai"}',
    'exportType' => '${processedBody.exportType || "ppt"}'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_API_KEY"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`
                    : `<?php
$url = "https://developers.presentations.ai${apiEndpoint}";
$data = ${JSON.stringify(processedBody, null, 2)};

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`,
            },
            ruby: {
                name: "Ruby",
                icon: "💎",
                code: isFormData
                    ? `require 'net/http'
require 'uri'

uri = URI('https://developers.presentations.ai${apiEndpoint}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri.path)
request['Authorization'] = 'Bearer YOUR_API_KEY'
request.set_form_data({
  'topic' => '${processedBody.topic || "Your Topic"}',
  'slideCount' => ${processedBody.slideCount || 10},
  'language' => '${processedBody.language || "en"}',
  'domain' => '${processedBody.domain || "presentations.ai"}',
  'exportType' => '${processedBody.exportType || "ppt"}'
})

response = http.request(request)
puts response.body`
                    : `require 'net/http'
require 'json'

uri = URI('https://developers.presentations.ai${apiEndpoint}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::${method === "POST" ? "Post" : "Get"}.new(uri.path)
request['Authorization'] = 'Bearer YOUR_API_KEY'
request['Content-Type'] = 'application/json'
request.body = ${JSON.stringify(processedBody, null, 2)}.to_json

response = http.request(request)
puts JSON.parse(response.body)`,
            },
        };

        return examples;
    }

    function renderCodeExampleSection(containerId, apiEndpoint, method, requestBody, responseBody) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const examples = createCodeExamples(apiEndpoint, method, requestBody, responseBody);
        const languages = ["shell", "node", "python", "php", "ruby"];
        let currentLang = "shell";

        function render() {
            const currentExample = examples[currentLang];
            container.innerHTML = `
                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">LANGUAGE</h3>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${languages
                            .map(
                                (lang) => `
                            <button 
                                data-lang="${lang}" 
                                class="lang-tab px-4 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 ${
                                    currentLang === lang ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }"
                            >
                                <span class="text-xs font-semibold">${examples[lang].icon}</span>
                                <span class="text-sm font-medium">${examples[lang].name}</span>
                            </button>
                        `
                            )
                            .join("")}
                        <button class="px-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600">
                            <span class="text-sm">⋯</span>
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    <!-- API Request Section -->
                    <div class="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                            <span class="text-sm font-semibold text-white">API Request</span>
                            <select class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600 hover:bg-gray-600">
                                <option>Examples</option>
                            </select>
                        </div>
                        <div class="relative">
                            <pre class="p-4 overflow-x-auto bg-gray-900"><code class="text-sm text-gray-100 font-mono leading-relaxed" id="request-code-${containerId}">${currentExample.code}</code></pre>
                            <button class="absolute bottom-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors" onclick="copyCode('request-code-${containerId}')" title="Copy">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                            </button>
                            <button class="absolute bottom-3 right-16 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors">
                                Try It!
                            </button>
                        </div>
                    </div>

                    <!-- Response Section -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">RESPONSE</span>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span class="text-xs text-gray-600 dark:text-gray-400">200 - Success</span>
                                </div>
                                <select class="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <option>Example</option>
                                </select>
                            </div>
                        </div>
                        <div class="relative">
                            <pre class="p-4 overflow-x-auto bg-white dark:bg-gray-800"><code class="text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed" id="response-code-${containerId}">${JSON.stringify(responseBody, null, 2)}</code></pre>
                            <button class="absolute bottom-3 right-3 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300 transition-colors" onclick="copyCode('response-code-${containerId}')" title="Copy">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Attach event listeners
            container.querySelectorAll(".lang-tab").forEach((btn) => {
                btn.addEventListener("click", () => {
                    currentLang = btn.getAttribute("data-lang");
                    render();
                });
            });
        }

        render();
    }

    // Copy code function
    window.copyCode = function (codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;

        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback
            const btn = codeElement.parentElement.querySelector("button");
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 2000);
            }
        });
    };

    // Expose API
    window.renderCodeExamples = function (containerId, apiEndpoint, method, requestBody, responseBody) {
        renderCodeExampleSection(containerId, apiEndpoint, method, requestBody, responseBody);
    };
})();
