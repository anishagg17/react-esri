import React from 'react';
import axios from 'axios';
import CanvasJSReact from './canvasjs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dataPoints = [];
class Chart extends React.Component {
  render() {
    const options = {
      theme: 'light2',
      title: {
        text: 'Anual Bank Balance'
      },
      axisY: {
        title: 'Bank Balance',
        prefix: '',
        includeZero: false
      },
      data: [
        {
          type: 'line',
          xValueFormatString: 'MMM YYYY',
          yValueFormatString: '$#,##0.00',
          dataPoints: dataPoints
        }
      ]
    };
    return (
      <div>
        <CanvasJSChart options={options} onRef={ref => (this.chart = ref)} />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }

  componentDidMount() {
    var chart = this.chart;
    axios.get('/bankAccount').then(function(response) {
      const { data } = response;
      for (var i = 0; i < data.length; i++) {
        let y = data[i]['Balance AMT'];
        y = y.replace(/,/g, '');
        console.log(y);
        dataPoints.push({
          x: new Date(data[i].Date),
          y: +y
        });
      }
      chart.render();
    });
  }
}

export default Chart;
