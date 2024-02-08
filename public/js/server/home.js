var Home = {};

/* window.ready */
$(document).ready(function () {
  Home.bindFunctions();
});

Home.bindFunctions = function () {
  Home.loadGraph();
};

Home.loadGraph = function () {
  const ctx = document.getElementById("graph").getContext("2d");
  const dataForChart = JSON.parse(
    document.getElementById("chart-wrapper").getAttribute("data-chart")
  );

  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const viewsData = [];

  labels.forEach((e, i) => {
    let done = 0;
    dataForChart.forEach((e) => {
      if (i + 1 === e.month) {
        viewsData.push(e.views);
        done = 1;
      }
    });
    if (done === 0) {
      viewsData.push(0);
    }
  });

  const data = {
    label: "Total de visitas por mes",
    data: viewsData,
    backgroundColor: "rgba(196, 154, 105, 0.2)", // Color de fondo
    borderColor: "rgb(196, 154, 105)", // Color del borde
    borderWidth: 1, // Ancho del borde
  };

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [data],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  });
};
