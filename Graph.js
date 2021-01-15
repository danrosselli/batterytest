import { html, Component } from 'https://unpkg.com/htm/preact/standalone.module.js'

export class Graph extends Component {

  constructor() {
    super();
    this.state = { difference: 0 };
    this.coordx = 0;
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {

    // config chart1
    var ctx1 = document.getElementById('chart1');

    this.chart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        datasets:
        [
          {
            label: 'Cycle',
            data: [],
            backgroundColor: '#f050a010',
            borderColor: '#f050a0',
            fill: false,
          },
          {
            label: 'Amps',
            data: [],
            backgroundColor: '#f030f010',
            borderColor: '#40b060',
            fill: false,
          },
        ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            distribution: 'series',
          }],
        }
      }
    });


    var socket = io();

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('connect', (socket) => {
      console.log('user connected');
    });

    // ticker atual, positivo no eixo x
    socket.on('ticker', (data) => {

    });

    // ticker do histórico, negativo no eixo x
    socket.on('ticker_history', (data) => {
      //if (parseInt(data.cycle) > 200)
        this.plot(data);
    });

    // ticker do histórico, negativo no eixo x
    socket.on('ticker', (data) => {
      this.plot(data);
    });

    socket.emit('get_history', 5000);

  }

  plot(data) {

    //console.log(parseInt(data.cycle));

    if (this.coordx == 0) {
      this.chart1.data.datasets[0].data.push({x: this.coordx, y: 0});
      this.coordx++;
    }
    //chart1
    this.chart1.data.datasets[0].data.push({x: this.coordx, y: parseInt(data.cycle)});
    //this.chart1.data.datasets[1].data.push({x: this.coordx, y: data.amp});

    this.chart1.update();
    this.coordx++;

  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    return html`
      <div>
        <canvas id="chart1" width="400" height="120"></canvas>
      </div>
    `
  }

}
