import { RequestConfig } from '@/types/api';

export function generateCurl(req: RequestConfig, fullUrl: string, finalHeaders: Record<string, string>): string {
  let curl = `curl --request ${req.method} \\\n  --url '${fullUrl}'`;

  Object.entries(finalHeaders).forEach(([k, v]) => {
    curl += ` \\\n  --header '${k}: ${v}'`;
  });

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    // Escape single quotes in body
    const escapedBody = req.body.replace(/'/g, "'\\''");
    curl += ` \\\n  --data '${escapedBody}'`;
  }

  return curl;
}

export function generateFetch(req: RequestConfig, fullUrl: string, finalHeaders: Record<string, string>): string {
  const options: any = {
    method: req.method,
    headers: finalHeaders,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    try {
      options.body = JSON.parse(req.body);
    } catch {
      options.body = req.body;
    }
  }

  const code = `fetch("${fullUrl}", {
  method: "${req.method}",
  headers: ${JSON.stringify(finalHeaders, null, 4)},
${
  req.method !== 'GET' && req.method !== 'HEAD' && req.body
    ? `  body: JSON.stringify(${JSON.stringify(options.body, null, 4)}),\n`
    : ''
}})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

  return code;
}

export function generateAxios(req: RequestConfig, fullUrl: string, finalHeaders: Record<string, string>): string {
  const methodLower = req.method.toLowerCase();
  let code = `import axios from 'axios';\n\n`;

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    code += `const payload = ${req.body};\n\n`;
    code += `axios.${methodLower}("${fullUrl}", payload, {
  headers: ${JSON.stringify(finalHeaders, null, 4)}
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`;
  } else {
    code += `axios.${methodLower}("${fullUrl}", {
  headers: ${JSON.stringify(finalHeaders, null, 4)}
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`;
  }

  return code;
}

export function generatePython(req: RequestConfig, fullUrl: string, finalHeaders: Record<string, string>): string {
  let code = `import requests\nimport json\n\n`;
  code += `url = "${fullUrl}"\n`;
  code += `headers = ${JSON.stringify(finalHeaders, null, 4)}\n\n`;

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    code += `payload = ${req.body}\n\n`;
    code += `response = requests.${req.method.toLowerCase()}(url, json=payload, headers=headers)\n`;
  } else {
    code += `response = requests.${req.method.toLowerCase()}(url, headers=headers)\n`;
  }

  code += `print("Status Code:", response.status_code)\nprint(response.json())`;
  return code;
}
