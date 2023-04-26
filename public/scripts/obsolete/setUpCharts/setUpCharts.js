function setUpCharts(containerID) {
    const chart = new Highcharts.Chart({
        chart: {
            renderTo: containerID,
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Views in 2016'
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        xAxis: {
            min: 1,
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    function showValues() {
        $('#alpha-value').html(chart.options.chart.options3d.alpha);
        $('#beta-value').html(chart.options.chart.options3d.beta);
        $('#depth-value').html(chart.options.chart.options3d.depth);
    }

    $("#updateChart").click(function () {
        updateChart();
    });

    function getScope(ctrlName) {
        const sel = `div[ng-controller="${ctrlName}"]`;
        return angular.element(sel).scope();
    }
}
