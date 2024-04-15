import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export function Chart() {
  const [currency, setCurrency] = useState();
  const [data, setData] = useState({});

  async function GetLastMonth() {
    const data = [];
    for (let i = 1; i <= 30; i++) {
      const resp = await fetch(
        `https://cbu.uz/uz/arkhiv-kursov-valyut/json/all/2024-03-${i}/`
      );
      let valuta = await resp.json();
      const cur = {
        id: Date.now(),
        date: valuta[0].Date,
        amount: valuta[0].Rate,
      };
      data.push(cur);
    }
    return data;
  }

  useEffect(() => {
    GetLastMonth()
      .then((res) => {
        setCurrency(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setData({
      series: [
        {
          name: "Desktops",
          data: currency ? currency.map((el) => el.amount) : [],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Product Trends by Month",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: currency ? currency.map((el) => el.date) : [],
        },
      },
    });
  }, [currency]);

  return (
    <div>
      <div id="chart">
        {data.series && (
          <ReactApexChart
            options={data.options}
            series={data.series}
            type="line"
            height={350}
          />
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
