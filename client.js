'use strict';


DS.controller('chart-bar', [function () {
  debugger
  function Constructor(el) {
    this.el = el;
    this.data = window[this.el.dataset.uri];
    this.xTitle = this.el.getAttribute('data-xTitle');
    this.yTitle = this.el.getAttribute('data-yTitle');
    this.title = this.el.getAttribute('data-title');
    this.height = this.el.getAttribute('data-height');
    this.barPadding = this.el.getAttribute('data-barPadding');
    this.width = 500;
    this.margin = 50;
    this.svg = this.createSVG();
    this.parsedData = this.parseData(this.data);
    console.log(this.parsedData);
    this.appendScales();
    this.plotData();
  }

  Constructor.prototype = {
    createSVG: function () {
      debugger
      var svg = d3.select('.chart-bar')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('class', 'svg-chart');

      return svg;
    },
    // parse data
    parseData: function (data) {
      debugger
      var d = [], i = 0;

      if (data.length % 2 == 0) {
        for (i = 0; i < data.length; i = i + 2) {
          d[i / 2] = {x: data[i], y: data[i + 1]};
        }
      }
      return d;
    },
    appendScales: function () {
      debugger
      var maxY = 1.5 * d3.max(this.parsedData, function (d) { return d.y; });

      this.xScale = d3.scaleBand()
        .domain(this.parsedData.map(function (d) { return d.x; }))
        .range([this.margin, this.width - this.margin]);
      this.yScale = d3.scaleLinear()
          .domain([0, maxY])
          .range([this.height - this.margin, this.margin]);
      this.svg.append('g')
        .attr('transform', 'translate(0,' + (this.height - this.margin) + ')')
        .attr('class', 'x axis')
        .call(d3.axisBottom(this.xScale)
              .tickSize(0));
      this.svg.append('g')
        .attr('transform', 'translate(' + this.margin + ', 0)')
        .attr('class', 'y axis')
        .call(d3.axisLeft(this.yScale)
          .tickSize(0)
          .tickFormat(function (d, i) {
            return i == 0 || i == maxY || i == maxY / 2 ? d : '';
            console.log(i);
          }));

      // // We only want ticks to show up on the 1/4, 2/4, 3/4, 4/4 of the way up
      // d3.selectAll('g.y.axis .tick line')
      //   .attr('x1', function (d) {
      //     if (d == maxY / 4 || d == maxY / 2 || d == 3 * maxY / 4 || d == maxY) {
      //       return 1;
      //     }
      //   })
      //   .attr('x2', function (d) {
      //     if (d == maxY / 4 || d == maxY / 2 || d == 3 * maxY / 4 || d == maxY) {
      //       return 400;
      //     }
      //   });

      if (this.title != '') {
        this.svg.append('text')
          .attr('x', this.width / 2)
          .attr('y', this.margin / 3)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'text-before-edge')
          .attr('class', 'title')
          .text(this.title);
      }
      if (this.xTitle != '') {
        this.svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate(' + this.width / 2 + ', ' + (this.height - this.margin / 3) + ')')
          .attr('class', 'axis-title')
          .text(this.xTitle);
      }
      if (this.yTitle != '') {
        this.svg.append('text')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate(' + this.margin / 2 + ', ' + this.height / 2 + ')rotate(-90)')
          .attr('class', 'axis-title')
          .text(this.yTitle);
      }
    },
    plotData: function () {
      debugger
      var self = this;

      this.svg.selectAll('rect')
        .data(this.parsedData)
        .enter()
        .append('rect')
        .attr('class', 'rect')
        .attr('x', function (d) { return self.xScale(d.x) + 1 * self.barPadding;})
        .attr('y', function (d) { return self.yScale(d.y);})
        .attr('width', (this.width - 2 * this.margin) / this.parsedData.length - 2 * this.barPadding)
        .attr('height', function (d) { return self.height - self.margin - self.yScale(d.y);});
    }
  };

  return Constructor;
}]);
