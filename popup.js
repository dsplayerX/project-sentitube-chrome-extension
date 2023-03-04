const btn = document.getElementById("analyse");

function drawDoughnutChart(data) {
  var ctx = document.getElementById("myChart").getContext("2d");
  var chartData = {
    labels: ["Positive", "Negative", "Neutral", "Sarcastic", "Non-Sarcastic"],
    datasets: [
      {
        label: "Comment Sentiment",
        data: [
          data.positiveCount,
          data.negativeCount,
          data.neutralCount,
          data.sarcasticCount,
          data.nonSarcasticCount,
        ],
        backgroundColor: [
          "#32CD32",
          "#FF6347",
          "#FFFF00",
          "#800080",
          "#4169E1",
        ],
      },
    ],
  };
  var myChart = new Chart(ctx, {
    type: "doughnut",
    data: chartData,
  });
}

btn.addEventListener("click", function () {
  btn.disabled = true;
  btn.innerHTML = "Analysing...";
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "http://127.0.0.1:5000/extensionresults?userinput=" + url,
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var resultDiv = document.getElementById("results");
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            var propDiv = document.createElement("div");
            var nameSpan = document.createElement("span");
            var valueSpan = document.createElement("span");
            nameSpan.innerHTML = prop + ": ";
            valueSpan.innerHTML = data[prop];
            propDiv.appendChild(nameSpan);
            propDiv.appendChild(valueSpan);
            resultDiv.appendChild(propDiv);
          }
        }
      }
      btn.disabled = false;
      btn.innerHTML = "Analyse";
    };
    xhr.send();
  });
});
