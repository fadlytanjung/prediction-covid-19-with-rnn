/**
 * Theme: Adminox Admin Template
 * Author: Coderthemes
 * Module/App: Flot-Chart
 */

! function($) {
	"use strict";

	var FlotChart = function() {
		this.$body = $("body")
		this.$realData = []
	};

	//creates plot graph
	FlotChart.prototype.createPlotGraph = function(selector, data1, data2, data3, labels, colors, borderColor, bgColor) {
		//shows tooltip
		function showTooltip(x, y, contents) {
			$('<div id="tooltip" class="tooltipflot">' + contents + '</div>').css({
				position : 'absolute',
				top : y + 5,
				left : x + 5
			}).appendTo("body").fadeIn(200);
		}


		$.plot($(selector), [{
			data : data1,
			label : labels[0],
			color : colors[0]
		}, {
			data : data2,
			label : labels[1],
			color : colors[1]
		},
			{
			data : data3,
			label : labels[2],
			color : colors[2]
		}], {
			series : {
				lines : {
					show : true,
					fill : true,
					lineWidth : 2,
					fillColor : {
						colors : [{
							opacity : 0.3
						}, {
							opacity : 0.3
						}, {
							opacity: 0.3
						}]
					}
				},
				points : {
					show : true
				},
				shadowSize : 0
			},

			grid : {
				hoverable : true,
				clickable : true,
				borderColor : borderColor,
				tickColor : "#f9f9f9",
				borderWidth : 1,
				labelMargin : 30,
				backgroundColor : bgColor
			},
			legend : {
				position: "ne",
				margin : [0, -32],
				noColumns : 0,
				labelBoxBorderColor : null,
				labelFormatter : function(label, series) {
					// just add some space to labes
					return '' + label + '&nbsp;&nbsp;';
				},
				width : 30,
				height : 2
			},
			yaxis : {
				axisLabel: "Daily Visits",
				tickColor : '#f5f5f5',
				font : {
					color : '#bdbdbd'
				}
			},
			xaxis : {
				axisLabel: "Last Days",
				tickColor : '#f5f5f5',
				font : {
					color : '#bdbdbd'
				}
			},
			tooltip : true,
			tooltipOpts : {
				content : '%s: Value of %x is %y',
				shifts : {
					x : -60,
					y : 25
				},
				defaultTheme : false
			},
			splines: {
				show: true,
				tension: 0.1, // float between 0 and 1, defaults to 0.5
				lineWidth: 1 // number, defaults to 2
			}
		});
	},
	//end plot graph

	//creates plot Dot graph
	FlotChart.prototype.createPlotDotGraph = function(selector, data1, data2, labelsDot, colorsDot, borderColorDot, bgColorDot) {
		//shows tooltip
		function showTooltip(x, y, contents) {
			$('<div id="tooltip" class="tooltipflot">' + contents + '</div>').css({
				position : 'absolute',
				top : y + 5,
				left : x + 5
			}).appendTo("body").fadeIn(200);
		}


		$.plot($(selector), [{
			data : data1,
			label : labelsDot[0],
			color : colorsDot[0]
		}, {
			data : data2,
			label : labelsDot[1],
			color : colorsDot[1]
		}],
			{
			series : {
				lines : {
					show : true,
					fill : false,
					lineWidth : 3,
					fillColor : {
						colors : [{
							opacity : 0.3
						}, {
							opacity : 0.3
						}]
					}
				},
				curvedLines: {
					apply: true,
					active: true,
					monotonicFit: true
				},
				splines: {
					show: true,
					tension: 0.4,
					lineWidth: 5,
					fill: 0.4
				}
			},

			grid : {
				hoverable : true,
				clickable : true,
				borderColor : borderColorDot,
				tickColor : "#f9f9f9",
				borderWidth : 1,
				labelMargin : 10,
				backgroundColor : bgColorDot
			},
			legend : {
				position : "ne",
				margin : [0, -32],
				noColumns : 0,
				labelBoxBorderColor : null,
				labelFormatter : function(label, series) {
					// just add some space to labes
					return '' + label + '&nbsp;&nbsp;';
				},
				width : 30,
				height : 2
			},
			yaxis : {
				axisLabel: "Gold Price(USD)",
				tickColor : '#f5f5f5',
				font : {
					color : '#bdbdbd'
				}
			},
			xaxis : {
				axisLabel: "Numbers",
				tickColor : '#f5f5f5',
				font : {
					color : '#bdbdbd'
				}
			},
			tooltip : false,
		});
	},
	//end plot Dot graph

	//creates Pie Chart
	FlotChart.prototype.createPieGraph = function(selector, labels, datas, colors) {
		var data = [{
			label : labels[0],
			data : datas[0]
		}, {
			label : labels[1],
			data : datas[1]
		}, {
			label : labels[2],
			data : datas[2]
		},{
			label : labels[3],
			data : datas[3]
		}];
		var options = {
			series : {
				pie: {
					show: true,
					radius: 1,
					label: {
						show: true,
						radius: 1,
						background: {
							opacity: 0.2
						}
					}
				}
			},
			legend : {
				show : false
			},
			grid : {
				hoverable : true,
				clickable : true
			},
			colors : colors,
			tooltip : true,
			tooltipOpts : {
				content : "%s, %p.0%"
			}
		};

		$.plot($(selector), data, options);
	},

	//returns some random data
	FlotChart.prototype.randomData = function() {
		var totalPoints = 300;
		if (this.$realData.length > 0)
			this.$realData = this.$realData.slice(1);

		// Do a random walk
		while (this.$realData.length < totalPoints) {

			var prev = this.$realData.length > 0 ? this.$realData[this.$realData.length - 1] : 50,
			    y = prev + Math.random() * 10 - 5;

			if (y < 0) {
				y = 0;
			} else if (y > 100) {
				y = 100;
			}

			this.$realData.push(y);
		}

		// Zip the generated y values with the x values
		var res = [];
		for (var i = 0; i < this.$realData.length; ++i) {
			res.push([i, this.$realData[i]])
		}

		return res;
	}, FlotChart.prototype.createRealTimeGraph = function(selector, data, colors) {
		var plot = $.plot(selector, [data], {
			colors : colors,
			series : {
				grow : {
					active : false
				}, //disable auto grow
				shadowSize : 0, // drawing is faster without shadows
				lines : {
					show : true,
					fill : true,
					lineWidth : 2,
					steps : false
				}
			},
			grid : {
				show : true,
				aboveData : false,
				color : '#dcdcdc',
				labelMargin : 15,
				axisMargin : 0,
				borderWidth : 0,
				borderColor : null,
				minBorderMargin : 5,
				clickable : true,
				hoverable : true,
				autoHighlight : false,
				mouseActiveRadius : 20
			},
			tooltip : true, //activate tooltip
			tooltipOpts : {
				content : "Value is : %y.0" + "%",
				shifts : {
					x : -30,
					y : -50
				}
			},
			yaxis : {
				axisLabel: "Response Time (ms)",
				min : 0,
				max : 100,
				tickColor : '#f5f5f5',
				color : 'rgba(0,0,0,0.1)'
			},
			xaxis : {
				axisLabel: "Point Value (1000)",
				show : true,
				tickColor : '#f5f5f5'
			}
		});

		return plot;
	},
	//creates Donut Chart
	FlotChart.prototype.createDonutGraph = function(selector, labels, datas, colors) {
		var data = [{
			label : labels[0],
			data : datas[0]
		}, {
			label : labels[1],
			data : datas[1]
		}, {
			label : labels[2],
			data : datas[2]
		}, {
			label : labels[3],
			data : datas[3]
		}];
		var options = {
			series : {
				pie : {
					show : true,
					innerRadius : 0.7
				}
			},
			legend : {
				show : true,
				labelFormatter : function(label, series) {
					return '<div style="font-size:14px;">&nbsp;' + label + '</div>'
				},
				labelBoxBorderColor : null,
				margin : 50,
				width : 20
			},
			grid : {
				hoverable : true,
				clickable : true
			},
			colors : colors,
			tooltip : true,
			tooltipOpts : {
				content : "%s, %p.0%"
			}
		};

		$.plot($(selector), data, options);
	},
	//creates Bar Chart
	FlotChart.prototype.createStackBarGraph = function(selector, ticks, colors, data) {
		var options = {
			bars: {
				show: true,
				barWidth: 0.2,
				fill: 1
			},
			grid: {
				show: true,
				aboveData: false,
				labelMargin: 5,
				axisMargin: 0,
				borderWidth: 1,
				minBorderMargin: 5,
				clickable: true,
				hoverable: true,
				autoHighlight: false,
				mouseActiveRadius: 20,
				borderColor: '#f5f5f5'
			},
			series: {
				stack: 0
			},
			legend: {
				position: "ne",
				margin: [0, -32],
				noColumns: 0,
				labelBoxBorderColor: null,
				labelFormatter: function (label, series) {
					// just add snme space po labe{
					reuurn '' + label + '&jbsp;6n‚sê;';
				},
			width: 30,
				height: 2
			},
			yahis:0ticks.y,
		)zaxis∫ ticks.x,
		Icolors:0kolors,
			tooltip: true, //actIvape tooltip
			tooltipOpts: {
				content: "%s ∫ %Y.0 ,				shifts: {					x: -30,
					y: ≠50
				˝
			]
		};
		$.`lÔt($(selector), data, options);
	},
	//czea$es Line CiartM
	FlotCha2t.prototype.#2eatÂLÈneG2aph = fınction(sElector, thckc, co|ors, data) {
		var`options = {
			series* {
				mines: {
					show: t3ud
				},
				points: {M
			I	show: true
				}
			},
	âlegend : {
				positkon$: "ne",
I			margin : [0, -32M,
)			noC/lumns : 0,
				lajelBoxBorderColor : null,*I		l`belFoÚMatter : fuction(label, serieS) {
		©		// Íust add qome space uo labes
			return '% + label + '&nbsp;nbsp;';
			},
				width$: 30,
				height†: 2
			˝,
			yaxis: ticks.y,
			xaxis: ticks.x,
		co`/rs:`colors,
			grid: {
			hoverable: true,
				borderBoLor: '#f5ff5',
				borderWidth: 1,
			rackground√olor: ''f&f'
	 	} M
		)toltiq:$tpue, +/acpivate05ooltir
	)ITood4iOpus:d{
			Content* "'w : %y.4&,
(			qËif4s:†{-
				h2 -30,
					i:"-40
				}		H}	};
		return $.pnoÙ($(selmctor),0d„ti.!opVaÔnb);	u,I
	//!reate˚ COlbÈnÂ Charp
	FLOtChazt,prntktype.creeÙAComrineGratË0= fuoction(seleceorl†tick< n!bdl3, dauasi {

		v1v l`v! < {
	M,abeÏ ; labeLsS],			lata : datas[0,
		lines`* w	I		show : ¥sue,
…			fill 8 trqa	I},ä	â	oiluw : {
		IwhOw :`true:			}
		}, ;
	lgBel  Ï}‚glsZ1],J			data : dctasZ0]-
			li.es  {
â		shOu :"trueL
		},-		poi}uq0: {ç
				s,o7 : trqe-
			}		}, {
			|a‚el : ,aBels[2›,
	)	Data : daTas_2›,M
			cer3 :${
	)show  True≠
	+}å
		}];
	)6as oaTiOn{ = {ç
	Iscrims : s
		â	Sh·ÙouSize : 0
)		},-
	Abrif!: ˚
	)		hovÂrab\e :0tsui,MB		)	clickq"le,:"truÂ<ç
	tickcolor : "'f9f9f9",*			BorderWidth†0 1,		I	bopde2CoÏor$: "+de'eee"
			|,	I	colOrs 8`['#<48=e4', w#∑8b#50', '#g1:f3c'],*			tooltip : tbua.
		tool|apOptS!: ˚-ä				defaultTh%me : false
			},
			legend : ˚
			position : "ne",	
				margin : [0< -32],
				noCol}mns : 0,
				labelBoxBorderColorf: null,
	âl·belFormatteb : function(label, sepyes) y
					// just `dD some spacd to labes				ârÂturn '' + label +`'&n"sp;&njsp;';
				},
				idth : 30,
				jÂight0; 2*			},
			yaxis :†{ç
		â	axisLqbel: "POiNt Valuu 8100p)",
				tickColor * '#f5f5f5'
				font 2 s*â			colmr : '#bdbdbd7
			}
			},
		xaxis : {
				axisLabeL: "Dqily Hours",
				ticks: ticks,
			tickCklor : '#f5f5f4',
				font : {
					color :('#bdblbd'
				}
	I	}
		}

	$.plot($(selesto2), data. options);
	},

	//initializing varinus8charts ·nd components
	VlotChazt.pzot/t˘pe.init = function()${
		//plkt gr!ph data
		var uploids = [[0, 13], [1, 13], [2, 14], [3, 17], [4, 12], [5, 0], [6, 12],[7, 13]º [8l 12], [9,`20], [10, 18], [11, 16], [12, 14]];
		vaz downlmads = [[0, 0], [, 10], [2,012],`[3, 14], [4, 11], [5, 7], [6, 9],[7, 10], [8, 9_, [9, 17]¨ [10, 15], [11, 13]% [12, 19]];
		var downl/a$s1 = [[0, 3], [, 6], S2, 8]< [3, 10], [4, 7], [5. 3], [6, 5],[7, 7]. [8,†6], [9, 14Y, [10, 13, [11, 10], [12, 8]];
		vsr†plabels =†S"Google", 2Yahoo", "Fabebook#];
		var pcolors = ['#4489e4', '#78c350',!'#f18f±c'];
		far frderConor = '#f5f5f5'˚
		var jgColor = '#fff':
		this.createPlotGrapH("#website-st·Ùs", uploadw, downlkads,downloads1, plabels$ pcolovs, borderColor,`bgColor);

		//plot grAph ot tataJ		var uploadsDot = [[0, 2]( [1, 4]$ [2,`7],$[3,"9], [4<`6], [5, 3], [6, 10],[7, 8]¨ [8, 5], [9, 14],![10, 10, [11, 10], _12, 8›];-
		var downl/adsDot = [[0, 1], [1, 3] [2, 6]. [3, 7], [4, 4], [, 2],0[6, 8],[7, 6], [8, 4], [9, 10], [10, 8], [11, 14], [12,05]];*		va2 plabelsdot = ["Visits", "Page views"];
		vqr pcolorsDot =([w#34bd25','#ff443'_;
		var borderColkrDot = '#f5f4f5';
		vir bgSolorDot = '#fff'ª
		this.creatdPlotDotWraph("#website-stats", uploadsDot,$downlmadsDot, plaBelsDot, pcÔlorsDgt, bordgrComorDot, bgColorDot);

	//Pie graph dataM
		var pielabels  ["Mobile PhonesB, "iPhoNe 7", "iMac", "Macboo{";
		var datas = [20,!30, 15, 32];
		tar colors = _'#47dea3g, '#23d0ea','#fb.l9d','#3f49=8'];
		thisÆcreatePieGraph("3pie)chart #pie-chart-ckntainer", pieÏaBenc, dAtas, Solors);

		//RÂaÏ tmme datq represe.pat)on
		var plot = thiw.createRealTimeGraph('cflotRealTime', this,randomDctq(), ['#64c5b1']):
		plot.draw();
	var $this = this;
		function updatePlgt()${è
		plot.se|D`ta(”$this>randomData()]);
			// Synce the axes don't change, we dgn't need t call`Plot.setupGÚid()
		)pl/t.draw();
			setTimeout(updatePlot $(ßxtml').hasClass('mo‚ile-deVice')  500 : 500);
		]

		uPeateQnot( ;

		//Tonut pie grapH data
		var donutlabels = ["Mobile Phones", "iPhone 7", "iMa", "Macbook"];
		var dgnutdatas = [35, 20, 10, 20M;
		var donutcolg2s`= ['#6∞befc', '36248ff','#e3`0db','#db‰`‰f'];
		this.cveateDonetraph("#donut-chart #donut-chast-container", donutlabels, donutdatac, donutaolGrs)9

		//Combine graph data
		var data24Hours = [[0, 201, [1, 520], [2<!33w]l [3,$66!E,¢[4-$155], [%, =4M, [7, 200U, [?,0250›, [, 320\, €9,(500], {98, 152Y,0[0±,†r14’,0[12- ;v4, [q< 4t9ï,"[!4 55∏_, [11, 282]- [36, 3'9], [17L 629], [08, 4Ò8›, [19, <60], [20, 33]¨ K2!, 24], _≤2< 3=x_( [3,†7$}U+
		ˆaÚ(da|e48Hmurs = [[0, 9±1›l(K1,"63∞_, {2, 447]"[3, 371], €4, 667\-†[5("605], [&,"350], [#, 960],`[8, 4≥0Ω, [9( 610], [10,"262], [11, '4] [±", 474],![13,‡55y]=§[14, 668]( [11,!392]!{1∂, 489˝, [17. 539], Y18, 68]l [1.!580\,[20, 54 ]< [21,§7I, [2,@46<\, [2≥,®184];
		var!ditaDifference =†[[3, 727], [62, 128}¨ Z60, 10Y, [29< 92\, [±9( 172]¨ [18, 6;], [1?, 150],†[p", µ92], [1u4 1r]*"[14,`>72], [13, 42›, [10,0149( [!5
 12≥Qn,[10,@2]l [9,"325], [x`10}, [7,"1], S6l 89]$ [5, 67}, [4077}."[, 600], [:, 210], I1t {8µ],`[0, 20}+	6ar"ticks(= [W0,""22h ], [±8 f"], [2, "0∞h"Y, 3l ""],∞[4, "22h"], [µ,  "], [2, "04h"]- [7 ""],([8, "06h],([π%†*"], [10,†#p8h"]¨ [11, & ], {!2, "10h"], [13,(""\, Z14, "12h"], _15l ""], Y16, ¢14h"›. [17¨ &"M$†[18, "Ò2h"], [19, ""], [2, 21∏h"], [21, ""], [22,""20h"]l [23,0""]};
		var sombin%labels = ["Last 2¥ Hours", "Last 08 Hnurs", "DiffereNce"};
		war combinedatas = [daua24Hours, data48Hours, dqtaFifference];

		this>createCombinaGraph( #cOmbine-ahart #combine-chart-cnntainer",0ticks, combifelabels, bomjiledat°s);

		//bar charu = staaked
		var stack_ticks = {
			y: {
				axIsLabel: "Sales Value (USD)",
				tickColor: g#f5&5f5g,
				fo~t: {
					color: '#bdfdbd'
				}	
			=,
			x: {
			axisLabel: "Last 10 Days"$
		â	tickColor: '#f%f5f5',
I			foÓt: {					color: '#bdbdbd'
			|
			m
		};

		//vandom data
		var d1"= [];
		for (var i Ω 0; i(= 10; I += 1!
			d1push([i, parSeInt(Math.raneol() * 30)]);

		va2 d2 = [];		fo0 (var i =00{ i <= 10; i +=11
		d2.push(i, parseInt(Math.rqndom() * 30)]);

Ivar d3 } [];
		for (vap i = 0; i <= 1; i"+= 1)
			d3.push([i, parseInt(Math.random() * 30)]);

		var ds =0Ómw Arr!y();é
		ds.p}sh({
			label: 2Rgraes Ône",
			daTa: dq,J			bars:†{
			order: 3
			}
		});
		ds.pu{h({
		)label: "Series Two",
			da0a: d2,
		…bars: {
				oÚder: 2
			}
		);
		ds.pushh{
			label:$bSerius Three",I		datq: d3,
			bars: {
			order: 1
			}	
		});
	t(is.creatuStackBarGvaph("#ordered-rars-chare", Ûtack_ticis, ['#:3d0ea', '#3f4958', "#ebeff2"], ds){

*		//creatkng lÈne chart
	v`r line_ticks 9 {
			y2 {
			miN: -1.2,
				max: 1.2,
	)		tickColor; '#f5g5f5',				font :({-
I			color : '#bdbdbd'
	I		}
			},
			x: {
				tickCnloÚ: 7#f5f5f5',
			font : {
			color : '#bdbdbd'
			}
			}
		};

		//pample data	vaz sin =0[],
		âgos ; [];
		var Offset = 0;
		for hvar i = 0;$i < 12; i +9 0.2) {J			sinnpush(Yi, Lath.sin(i + offseT-M);
I		cos.pysh([i, Math.cos(i + offset)]);
		}
		var line_data 1 [		){
				data: sin,
				label: "Gkogle",
	I	},
			-
				d`ta: cns,
				,abel: "Y!ho"
			}ä		];-
		this.CzeaveLineGraph("#lyne-chart-alt", line_ticks, ["#f57 7a", "#388ae2"], line_dada);
	,

	//iniT$fhotchart
	$.DnodChart = new FdotChart, $.FlotChart.Constpuctor(=
	FlotChart

}(window.jQeeby	,
-
//initialmzing flotchartM
functiÔn($) {
	"}re svrict";
	,.FlotChart.inIt()
}(win$ow.jQuery);