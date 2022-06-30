// const ctx = document.getElementById('myChart');
// const myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: 'My First Dataset',
//             data: [65, 59, 80, 81, 56, 55, 40],
//             fill: false,
//             borderColor: 'rgb(12, 147, 68, 255)',
//             tension: 0.1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// const { cp } = require("original-fs");

// // document.getElementById('btn').addEventListener('click', () => {
    
// //     addData(myChart, 'new', '35')
// // })

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

// function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }

// // window.addEventListener('DOMContentLoaded',getCPU)


// import osutils from('os-utils');

// setInterval(() => {
//     osutils.cpuUsage(function(v){
//       // mainWindow.webContents.send('platform', osutils.platform());
//       // mainWindow.webContents.send('cpu',v*100);
//       // mainWindow.webContents.send('free-mem',osutils.freememPercentage()*100);
//       // mainWindow.webContents.send('total-mem',osutils.totalmem()/1024);
    
      

//     window.addEventListener('DOMContentLoaded', addData(myChart, 'new', 'v'))
      
//     });
//   },1000);


//data function
let data = 0;

// window.electronAPI.handleCPU((event, value) => {
//     data = value;
//     event.sender.send('cpu', data)
// })

window.addEventListener('DOMContentLoaded', () => {
   
        cpu =  getcpuUsage();
        console.log(cpu)
        data = cpu;

})

var getcpuUsage = async () => {
    const cpuUsage = await window.electronAPI.getcpuUsage('graph-cpu')
    console.log(cpuUsage)
    return cpuUsage;
}


//graphs
// inspired by
// https://bl.ocks.org/pjsier/fbf9317b31f070fd540c5523fef167ac
var D3_CHART = {
    selector: '#d3_chart',

    dataSource:[],
    data:[],
    svg: null,
    mainGroup: null,
    scaleX: null,

    options:{
        width: 640,
        height: 480,
        margins: {
            top: 20,
            right: 40,
            bottom: 20,
            left: 40,
        },
        MAX_LENGTH:100,
        duration:500,
        color: d3.schemeCategory10
    },

    init: function(){
        var el = d3.select(this.selector);
        if(el.empty()){
            console.warn('init(): Element for "'+this.selector+'" selector not found');
            return;
        }

        console.log('d3 version: ', d3.version);

        this.seedData();

        this.draw();

        window.setInterval(this.updateData, D3_CHART.options.duration);
    },

    updateData: function(){
        var now = new Date();
        var lineData = {
            time: now,
            x: D3_CHART.randomNumberBounds(),
        };
        D3_CHART.dataSource.push(lineData);
        if (D3_CHART.dataSource.length > 30) {
            D3_CHART.dataSource.shift();
        }
        D3_CHART.draw();
    },

    draw: function(){
        var self = this;

        // Based on https://bl.ocks.org/mbostock/3884955
        self.data = ["x"].map(function(c) {
            return {
                label: c,
                values: self.dataSource.map(function(d) {
                    return {
                        time: +d.time,
                        value: d[c]
                    };
                })
            };
        });

        var transition = d3.transition().duration(this.options.duration).ease(d3.easeLinear),
            xScale = d3.scaleTime().rangeRound([0, this.options.width-this.options.margins.left-this.options.margins.right]),
            yScale = d3.scaleLinear().rangeRound([this.options.height-this.options.margins.top-this.options.margins.bottom, 0]),
            zScale = d3.scaleOrdinal(this.options.color);

        var xMin = d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
        var xMax = new Date(new Date(d3.max(self.data, function(c) {
            return d3.max(c.values, function(d) { return d.time; })
        })).getTime() - 2*this.options.duration);
        //})).getTime());

        xScale.domain([xMin, xMax]);
        yScale.domain([0, 100]);
        zScale.domain(self.data.map(function(c) { return c.label; }));

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d.time); })
            .y(function(d) { return yScale(d.value); });

        var svg = d3.select(this.selector).selectAll("svg").data([this.data]);
        var gEnter = svg.enter().append("svg")
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .append("g")
            .attr('transform', 'translate(' + this.options.margins.left + ',' + this.options.margins.top + ')');
        gEnter.append("g").attr("class", "axis x");
        gEnter.append("g").attr("class", "axis y");

        gEnter.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
            .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

        gEnter.append("g")
            .attr("class", "lines")
            .attr("clip-path", "url(#clip)")
            .selectAll(".data")
            .data(this.data)
            .enter()
            .append("path")
            .attr("class", "data");

        var legendEnter = gEnter.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (this.options.width-this.options.margins.right-this.options.margins.left-75) + ",25)");
        legendEnter.append("rect")
            .attr("width", 50)
            .attr("height", 75)
            .attr("fill", "#ffffff")
            .attr("fill-opacity", 0.7);
        legendEnter.selectAll("text")
            .data(this.data)
            .enter()
            .append("text")
            .attr("y", function(d, i) { return (i*20) + 25; })
            .attr("x", 5)
            .attr("fill", function(d) { return zScale(d.label); });

        var g = svg.select("g");

        g.select("g.axis.x")
            .attr("transform", "translate(0," + (this.options.height-this.options.margins.bottom-this.options.margins.top) + ")")
            .transition(transition)
            .call(d3.axisBottom(xScale).ticks(5));

        g.select("g.axis.y")
            .transition(transition)
            .attr("class", "axis y")
            .call(d3.axisLeft(yScale));

        g.select("defs clipPath rect")
            .transition(transition)
            .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
            .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

        g.selectAll("g path.data")
            .data(this.data)
            .style("stroke", function(d) { return zScale(d.label); })
            .style("stroke-width", 1)
            .style("fill", "none")
            .transition()
            .duration(this.options.duration)
            .ease(d3.easeLinear)
            .on("start", tick);

        g.selectAll("g .legend text")
            .data(this.data)
            .text(function(d) {
                return d.label.toUpperCase() + ": " + d.values[d.values.length-1].value;
            });

        // For transitions https://bl.ocks.org/mbostock/1642874
        function tick() {
            // Redraw the line.
            d3.select(this)
                .attr("d", function(d) { return line(d.values); })
                .attr("transform", null);

            // Slide it to the left.
            var xMinLess = new Date(new Date(xMin).getTime() - D3_CHART.options.duration);
            d3.active(this)
                .attr("transform", "translate(" + xScale(xMinLess) + ",0)")
                .transition();
        }
    },



    clearChart: function(){
        var el = d3.select(this.selector);
        if(el.empty()){
            console.warn('clearChart(): Element for "'+this.selector+'" selector not found');
            return;
        }

        // clear element
        el.html("");
    },

    seedData: function() {
        var now = new Date();
        for (var i = 0; i < this.options.MAX_LENGTH; ++i) {
            this.dataSource.push({
                time: new Date(now.getTime() - ((this.options.MAX_LENGTH - i) * this.options.duration)),
                x: this.randomNumberBounds(),
                // y: this.randomNumberBounds(0, 2.5),
                // z: this.randomNumberBounds(0, 10)
            });
        }
    },

    //function data
    randomNumberBounds: function () {
        return data;
        //return Math.floor(Math.random() * max) + min;
    }
};



