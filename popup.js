const analyseBtn = document.getElementById("analyse");
analyseBtn.addEventListener("click", function () {
  analyseBtn.disabled = true;
  analyseBtn.innerHTML = "Analysing...";
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const url = tabs[0].url;
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "http://127.0.0.1:5000/extensionresults?userinput=" + url,
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const totalComments = data["Total Comments"];
        const resultsDiv = document.getElementById("results");
        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = `
          <h4>Sentiment Analysis:</h4>
          <div style="width: 100%">
            <canvas id="sentimentChart"></canvas>
          </div>
          <h4>Sarcasm Analysis:</h4>
          <div style="width: 100%">
            <canvas id="sarcasmChart"></canvas>
          </div>
          <h5>Total comments: ${totalComments}</h5>
        `;

        // Create the sentiment chart
        const sentimentChartCtx = document
          .getElementById("sentimentChart")
          .getContext("2d");
        const sentimentChartData = {
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Sentiment Analysis",
              data: [
                data["Positive Comments"],
                data["Neutral Comments"],
                data["Negative Comments"],
              ],
              backgroundColor: ["#2ecc71", "#3498db", "#e74c3c"],
            },
          ],
        };
        const sentimentChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
        };
        const sentimentChart = new Chart(sentimentChartCtx, {
          type: "pie",
          data: sentimentChartData,
          options: sentimentChartOptions,
        });

        // Create the sarcasm chart
        const sarcasmChartCtx = document
          .getElementById("sarcasmChart")
          .getContext("2d");
        const sarcasmChartData = {
          labels: ["Sarcastic", "Non-Sarcastic"],
          datasets: [
            {
              label: "Sarcasm Analysis",
              data: [data["Sarcastic Comments"], data["Nonsarcastic Comments"]],
              backgroundColor: ["#f1c40f", "#9b59b6"],
            },
          ],
        };
        const sarcasmChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
        };
        const sarcasmChart = new Chart(sarcasmChartCtx, {
          type: "pie",
          data: sarcasmChartData,
          options: sarcasmChartOptions,
        });
      }
      analyseBtn.disabled = false;
      analyseBtn.innerHTML = "Analyse";
    };
    xhr.send();
  });
});
