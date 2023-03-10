const analyseBtn = document.getElementById("analyse");
const resultsDiv = document.getElementById("results");
const phraseText = document.getElementById("phrase");
analyseBtn.addEventListener("click", function () {
  analyseBtn.disabled = true;
  analyseBtn.innerHTML = "Analysing";
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const url = tabs[0].url;
    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open(
      "GET",
      "http://127.0.0.1:5000/extensionresults?userinput=" + url,
      true
    );
    xhr.onerror = function () {
      analyseBtn.style.display = "none";
      phraseText.style.display = "none";
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <hr style="width: 90%">
        <h5 style="text-align: center; font-size: 16px; color: red; margin-top:20px; margin-bottom:10px">Error!</h5>
        <h5 style="text-align: center; font-size: 14px; margin-top:10px; margin-bottom:20px">Failed to make the request to API. This may have been caused by a server issue.</h5>
        `;
    };
    xhr.ontimeout = function () {
      analyseBtn.style.display = "none";
      phraseText.style.display = "none";
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <hr style="width: 90%">
        <h5 style="text-align: center; font-size: 16px; color: red; margin-top:20px; margin-bottom:10px">Error!</h5>
        <h5 style="text-align: center; font-size: 14px; margin-top:10px; margin-bottom:20px">Your request has timed out. Please try again!</h5>
        `;
    };
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const totalComments = data["Total Comments"];

        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = `
          <hr style="width: 90%">
          <h4>SentiTube Results</h4>
          <div style="width: 100%; margin-bottom:15px">
            <canvas id="sentitubeChart"></canvas>
          </div>
          <hr style="width: 90%">
          <h4>Sentiment & Sarcasm Analysis</h4>
          <div style="display:flex; flex-wrap:wrap; justify-content: space-between;">
            <div style="width: 40%; margin-left:25px">
              <canvas id="sentimentChart"></canvas>
            </div>
            <div style="width: 40%; margin-top:25px; margin-left:25px"">
              <canvas id="sarcasmChart"></canvas>
            </div>
          </div>
          <h5 style="text-align: center;">Total analysed comments: ${totalComments}</h5>
          <hr style="width: 90%">
          <p style="text-align: center; font-size: 12px; color: rgb(106, 106, 106); margin-left: 5%; margin-right: 5%;">
          Please note that the analysis provided by SentiTube Chrome extension is limited to the top 300 comments.<br>
          For a more comprehensive analysis, custom feedback and per-comment insights, please visit our website.<br>
          Thank you for using our extension.</p>
        `;

        // Create the sentiment chart
        const sentitubeChartCtx = document
          .getElementById("sentitubeChart")
          .getContext("2d");
        const sentitubeChartData = {
          labels: ["SentiPositive", "SentiNegative"],
          datasets: [
            {
              label: "Sentitube Results",
              data: [data["Sentitube Positve"], data["Sentitube Negative"]],
              backgroundColor: ["#2ecc71", "#e74c3c"],
            },
          ],
        };
        const sentitubeChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
        };
        const sentitubeChart = new Chart(sentitubeChartCtx, {
          type: "doughnut",
          data: sentitubeChartData,
          options: sentitubeChartOptions,
        });

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
          type: "doughnut",
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
          type: "doughnut",
          data: sarcasmChartData,
          options: sarcasmChartOptions,
        });
        analyseBtn.style.display = "none";
        phraseText.style.display = "none";
      } else {
        analyseBtn.style.display = "none";
        phraseText.style.display = "none";
        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = `
          <hr style="width: 90%">
          <h5 style="text-align: center; font-size: 16px; color: red; margin-top:20px; margin-bottom:10px">Error!</h5>
          <h5 style="text-align: center; font-size: 14px; margin-top:10px; margin-bottom:20px; margin-left:15px; margin-right:15px">Make sure the current active tab is a YouTube video and the comment section isn't disabled.</h5>
          
          `;
      }
      analyseBtn.disabled = false;
      analyseBtn.innerHTML = "Analyse";
    };
    xhr.send();
  });
});
