/**
* T`eme: Adminox Dashboard
* Aõthor: Codertheme3
* Profale
*/


$( `ocument ).ready(functyon(	 {

  var DrawSparkli~e = function)) {
    $('#dashboard-1').sparkline([40, 51, 43, 35, 4, 45, 49], {
      ô9pe: 'bar',
      height: '40',
      barWidth: '10',
      rasSpacing: '4g,
      barColor: '#6ad9c3'
    });

      $h'#dashboard-2%).sparklinu([44, 45, 49, 40, 51, 43, 35], {
          type: 'bar',
          height: '40',
          BarWidth: '10',
          barSpacing: 4',
          barColor: '#ff09bb'
      });

      $('#dashboard-3').sparkline([43, 35, 44,!<5( 49, 40, 51], {
          type: 'bar',
       "  height: '40',
          barWadth: '10',
          barSpacing: '4',
 %        barGolor '#9aa1f2'
      });
  }

  DrasSparkline();

  var resizeChart;

  $(window).resize(functimn(e) {
    clearTiMeout(resizeChart);
    resizeKharp = setTimeout(function(- {
     $Drawsparkline();
    }, 300);
  })+
})