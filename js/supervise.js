var vm=new Vue({
	el:"#supervise",
	data:{
		//页面导航列表
		navList:"",
		selNavName:"亩产效益智能大屏",
		selNavId:"one",
		pageChange:false,
		userId:"",
		//季度选择
		selNavIndex:0,	//季度选择
	},
	created:function(){
		this.url1=url1;
		this.url2=_url;
		this.navList=navlist;
		this.colorList=[
			{color1:"#de8a82",color2:"#ff6669"},
			{color1:"#a0de96",color2:"#74dfc2"},
			{color1:"#2875cc",color2:"#2775c8"},
			{color1:"#de8cc0",color2:"#cb64ac"},
			{color1:"#01c9d9",color2:"#0394a5"},
			{color1:"#feca0c",color2:"#fed700"},
			{color1:"#5c4bd5",color2:"#634fdd"},
			{color1:"#1a4de0",color2:"#1c4fe0"},
			{color1:"#e88cec",color2:"#89b8fc"},
			{color1:"#fc9d2f",color2:"#fc812f"},
			{color1:"#5998fc",color2:"#4463dd"},
			{color1:"#01c263",color2:"#01bd56"},
		]
		this.login();
		this.windowHeight=window.innerHeight-80-40;
	},
	mounted:function(){
		this.$refs.main.style.height=this.windowHeight+"px";
		name1=["杭州","湖州","绍兴","宁波","嘉兴","丽水","台州","温州","金华","衢州","舟山"];
		name2=["婺城","金东","兰溪","义务","东阳","永康","浦江","武义","磐安","开发区"];
		this.barShow();
		this.barShowRight(name1,"rightTopEchart");
		this.barShowRight(name2,"rightBottomEchart");
	},
	watch:{
		token:function(value){
			
		},
	},
	methods:{
		/**
		 * @页面切换
		 */
		pageTogo:function(url){
			window.location.href =url
		},
		/**
		 * @页面切换选择触发
		 */
		navSel:function(){
			this.pageChange=!this.pageChange;
		},
		/**
		  * @画统计图
		  * @右侧2个
		  * @param {*} time  时间轴  
		  * @param {*} revenue  柱轴数据集合
		  */
		barShowRight:function(name,classNmae){
			var name=name,
				revenue=["1000","300","400","600","500","450","500","800","700","300","450"],
				increase=["2000","600","800","1200","1000","1000","1100","1700","1500","700","1000"],
				revenueL=["120","140","150","120","140","150","120","140","150","120","140"],
				increaseL=["125","145","160","125","145","160","125","145","160","125","145"],
				type=["服务业增加值","GDP","服务业占比","服务业可比增速"],
				unit="(万元)";
			let myChart = echarts.init(this.$refs[classNmae]);
			var option = {
					grid: {
					left: '3%',
					right: '3%',
					bottom: '5%',
					top: '15%',
					containLabel: true
				},
				tooltip:{
					trigger: 'axis',
					backgroundColor:"#004662",
					padding:[5,10],
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#004662'
						}
					},
					textStyle:{
						fontSize:"14"
					},
					formatter:function(params){
						console.log(params)
						var value=params[0].name+"年度<br>服务业增加值："+params[0].value+"<br>GDP："+params[1].value+"<br>服务业占比："+params[2].value+"%<br>服务业可比增速:"+params[3].value;
						return value
					}
				},
				legend: {
					left: "right",
					top:"top",
					tooltip:{
						show : true
					},
					textStyle:{
						color:"#fff",
					},
					data: type
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						show: true,
						interval:0,
						textStyle:{
							color:"#a1b6be",
						}
					},
					axisTick: {
						show: false//隐藏x坐标轴刻度
					},
					splitLine:{
						show:false
					},
					//x轴颜色
					axisLine: {
						lineStyle: {
							color: "#1d4a62",
						}
					},
					data: name
				},
				yAxis: [
					{
						type: 'value',
						position: 'left',      // 位置
						nameLocation: 'end',
						name: "单位："+unit,
						//y轴字体样式
						axisLabel: {
							show: true,
							textStyle: {
								color: '#a1b6be',
								fontSize:'12'
							}
						},
						nameTextStyle:{
							color:"#fff", 
							fontSize:12,
						},
						splitLine:{
							show:true,
							lineStyle:{
								color:"#044056"
							}
						},
						axisLine: {
							lineStyle: {
								color: "#1d4a62",
							}
						},
						axisTick: {
							show: false//隐藏y坐标轴刻度
						}
					},
					{
						type: 'value',
						position: 'right',      // 位置
						nameLocation: 'end',
						//y轴字体样式
						axisLabel: {
							show: false,
						},
						splitLine:{
							show:false,
						},
						axisLine: {
							show:false,
						},
						axisTick: {
							show: false//隐藏y坐标轴刻度
						}
					}
				],
				series: [{
						name: '服务业增加值',
						type: 'bar',
						yAxisIndex: 0,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#fcc454'
						}, {
							offset: 1,
							color: '#fde38c'
						}]),
						barWidth : 12,//柱体宽度
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#00d7e8',
										fontSize: 12
									}
								},
								color:function(params) {
									let color= new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#fcc454'
									}, {
										offset: 1,
										color: '#fde38c'
									}])
									let colorList = [color];
									for(var i=0;i<revenue.length;i++){
										colorList.push(color)
									}
									return colorList[params.dataIndex];
								}
							}
						},
						data:revenue,
					},
					{
						name: 'GDP',
						type: 'bar',
						yAxisIndex: 0,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#1dc7fd'
						}, {
							offset: 1,
							color: '#7cfdcb'
						}]),
						barWidth : 12,//柱体宽度
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#00d7e8',
										fontSize: 12
									}
								},
								color:function(params) {
									let color= new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#1dc7fd'
										}, {
											offset: 1,
											color: '#7cfdcb'
										}])
									let colorList = [color];
									for(var i=0;i<revenue.length;i++){
										colorList.push(color)
									}
									return colorList[params.dataIndex];
								}
							}
						},
						data:increase,
						// data: revenue
					},
					{
						name:'服务业占比',
						type:'line',
						yAxisIndex: 1,    //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
						color:['red'],
						data:revenueL,
						symbol:'circle',
						symbolSize:4,
						itemStyle:{
							normal:{
								color:"#ec393a"
							}
						}
					},
					{
						name:'服务业可比增速',
						type:'line',
						yAxisIndex: 1,    //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
						symbol:'circle',
						color:'#52e5e1',
						data:increaseL,
						symbolSize:4,
						itemStyle:{
							normal:{
								color:"#1559b5"
							}
						}
					},
				]
			};
			myChart.setOption(option);
	  	},
		/**
		  * @画统计图
		  * @左侧的
		  * @param {*} time  时间轴  
		  * @param {*} revenue  柱轴数据集合
		  */
		barShow:function(){
			var name=["2018","2019","2020"],
				revenue=["200","300","400"],
				increase=["250","350","450"],
				type=["规上企业营收","增加值","相关增速"],
				unit="(万元)";
			let myChart = echarts.init(this.$refs.leftEchart);
			var option = {
					grid: {
					left: '3%',
					right: '3%',
					bottom: '5%',
					top: '15%',
					containLabel: true
				},
				tooltip:{
					trigger: 'axis',
					backgroundColor:"#004662",
					padding:[5,10],
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#004662'
						}
					},
					textStyle:{
						fontSize:"14"
					},
					formatter:function(params){
						console.log(params)
						var value=params[0].name+"年度<br>规上企业营收："+params[0].value+"<br>增加值："+params[1].value+"<br>增速："+params[2].value+"%";
						return value
					}
				},
				legend: {
					left: "right",
					top:"top",
					tooltip:{
						show : true
					},
					textStyle:{
						color:"#fff",
					},
					data: type
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						show: true,
						interval:0,
						textStyle:{
							color:"#a1b6be",
						}
					},
					axisTick: {
						show: false//隐藏x坐标轴刻度
					},
					splitLine:{
						show:false
					},
					//x轴颜色
					axisLine: {
						lineStyle: {
							color: "#1d4a62",
						}
					},
					data: name
				},
				yAxis: [
					{
						type: 'value',
						position: 'left',      // 位置
						nameLocation: 'end',
						name: "单位："+unit,
						//y轴字体样式
						axisLabel: {
							show: true,
							textStyle: {
								color: '#a1b6be',
								fontSize:'12'
							}
						},
						nameTextStyle:{
							color:"#fff", 
							fontSize:12,
						},
						splitLine:{
							show:true,
							lineStyle:{
								color:"#044056"
							}
						},
						axisLine: {
							lineStyle: {
								color: "#1d4a62",
							}
						},
						axisTick: {
							show: false//隐藏y坐标轴刻度
						}
					},
					{
						type: 'value',
						position: 'right',      // 位置
						nameLocation: 'end',
						//y轴字体样式
						axisLabel: {
							show: false,
						},
						splitLine:{
							show:false,
						},
						axisLine: {
							show:false,
						},
						axisTick: {
							show: false//隐藏y坐标轴刻度
						}
					}
				],
				series: [{
						name: '规上企业营收',
						type: 'bar',
						yAxisIndex: 0,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#0093fe'
						}, {
							offset: 1,
							color: '#3adfe8'
						}]),
						barWidth : 15,//柱体宽度
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#00d7e8',
										fontSize: 12
									}
								},
								color:function(params) {
									let color= new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#0093fe'
									}, {
										offset: 1,
										color: '#3adfe8'
									}])
									let colorList = [color];
									for(var i=0;i<revenue.length;i++){
										colorList.push(color)
									}
									return colorList[params.dataIndex];
								}
							}
						},
						data:revenue,
					},
					{
						name: '增加值',
						type: 'bar',
						yAxisIndex: 0,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#f93838'
						}, {
							offset: 1,
							color: '#f4c821'
						}]),
						barWidth : 15,//柱体宽度
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#00d7e8',
										fontSize: 12
									}
								},
								color:function(params) {
									let color= new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#f93838'
										}, {
											offset: 1,
											color: '#f4c821'
										}])
									let colorList = [color];
									for(var i=0;i<revenue.length;i++){
										colorList.push(color)
									}
									return colorList[params.dataIndex];
								}
							}
						},
						data:increase,
						// data: revenue
					},
					{
						name:'相关增速',
						type:'line',
						yAxisIndex: 1,    //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
						data:["125","120","150"],
						symbolSize:2,
						itemStyle:{
							normal:{
								color:"#f00",
								lineStyle:{  
									color:'#683945'  
								}  
							}
						}
					},
				]
			};
			myChart.setOption(option);
	  	},
		/**
		 * @数据请求获取token
		 * @param {*} type 
		 */
		login:function(){
			var _this=this;
			axios.post(this.url2+"/Token/GetToken",
                {
                	"LOGIN_NAME": "TEST",
  					"PASSWORD": "123456"
                })
                .then(res => {
                   	if(res.data.Code==0){
						_this.token=res.data.Data.AccessToken.TokenContent;
						var expdate = new Date();   //初始化时间
						expdate.setTime(expdate.getTime() + 30 * 60 * 1000);   //时间单位毫秒
						document.cookies = "bigToken"+"="+_this.token+";expires="+expdate.toGMTString()+";path=/";
                   	}
                })
		},
	}
})