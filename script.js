async function scanToken() {
  const token = document.getElementById("token").value.trim();
  const resultBox = document.getElementById("result");

  if (!token) {
    resultBox.innerText = "❌ Please enter token address";
    return;
  }

  resultBox.innerText = "🔍 Scanning token...";

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${token}`
    );
    const data = await res.json();

    if (!data.pairs || data.pairs.length === 0) {
      resultBox.innerText = "❌ No DEX pairs found (High Risk Token)";
      return;
    }

    const pair = data.pairs[0];

    let report = `Token: ${pair.baseToken.name}\n`;
    report += `Symbol: ${pair.baseToken.symbol}\n\n`;

    // Fake price detection
    const price = parseFloat(pair.priceUsd);
    report += price > 10
      ? "⚠️ Suspicious High Price Detected\n"
      : "✅ Price looks normal\n";

    // Liquidity check
    report += pair.liquidity?.usd < 5000
      ? "❌ Very Low Liquidity\n"
      : "✅ Liquidity OK\n";

    // Volume check
    report += pair.volume.h24 < 1000
      ? "⚠️ Low Trading Volume\n"
      : "✅ Active Trading\n";

    // Risk summary
    report += "\n🔎 Risk Level: ";
    report += price > 10 || pair.liquidity?.usd < 5000
      ? "HIGH 🚨"
      : "LOW 🟢";

    resultBox.innerText = report;

  } catch (e) {
    resultBox.innerText = "❌ Error fetching token data";
  }
}
