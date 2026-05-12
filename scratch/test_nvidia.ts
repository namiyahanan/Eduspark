async function testNvidia() {
  const apiKey = "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";
  const model = "qwen/qwen-2.5-coder-32b";
  const url = "https://integrate.api.nvidia.com/v1/chat/completions";

  try {
    console.log("Testing NVIDIA API...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

testNvidia();
