async function runResearch() {
  const button = document.getElementById("run");
  const resultEl = document.getElementById("result");

  button.disabled = true;
  button.textContent = "⏳ Running...";
  resultEl.textContent = "Calling API... This may take 20-30 seconds.";
  resultEl.className = "loading";

  const payload = {
    brand_config: {
      brand_name: document.getElementById("brand_name").value,
      markets: document.getElementById("markets").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: document.getElementById("languages").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      platforms: document.getElementById("platforms").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      cutoff_time: document.getElementById("cutoff_time").value,
      tone_keywords: document.getElementById("tone_keywords").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      risk_level: document.getElementById("risk_level").value,
    },
    campaign_brief: {
      title: document.getElementById("title").value,
      objectives: document.getElementById("objectives").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      primary_audience: document.getElementById("primary_audience").value,
      product_description: document.getElementById("product_description").value,
      key_messages_from_client: document.getElementById("key_messages").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      references: document.getElementById("references").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
  };

  try {
    const res = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    resultEl.textContent = JSON.stringify(data, null, 2);
    resultEl.className = "";
  } catch (err) {
    resultEl.textContent = `❌ Error: ${err.message}`;
    resultEl.className = "";
    console.error("API Error:", err);
  } finally {
    button.disabled = false;
    button.textContent = "▶ Run Research";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("run").addEventListener("click", runResearch);
});
