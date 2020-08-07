var vm=new Vue({
	el:"#trade",
	data:{
		barType:"trade",
		barTypeNum:0,
		url:"",
		token:"",
		listType:"all",
		ratioType:"trade",
		ratioTypeNum:0,
		windowHeight:"",
		chooseListShow:false,
		leftChooseShow:false,
		rightChooseShow:false,
		colorList:[],	//饼图渐变列表
		//左侧各种总量指标
		totalList:"",	//左侧返回总数据
		totalShowList:"",	//左侧要展示的数据
		totalName:"",	//左侧下拉集合
		selTotalName:"",	//下拉选中的名称
		selTotalId:"",	//下拉选中的id
		//中上土地性质
		landType:"trade",
		landList:"",	//左上后台返回的全部数据
		landShowList:"",	//当前选中要展示数据
		landShowNum:0,
		landOptions:"",	//下拉选项集合
		selLandName:"",		//当前统计图展示的内容名称
		selLandZBID:"",		//当前统计图展示内容的id
		//中下规上指标
		aggreList:"",	//返回的数据
		aggreShowList:"",	//当前选中展示的数据
		selAggreList:"",
		sortName:"",	//当前排序所依据的id
		//右侧各行业
		meritsList:"",	//右侧绩效返回的数据
		meritsName:"",
		selMeritsName:"",
		selMeritsId:"",
		meritsShowList:"",	//要展示数据聚合
		//页面导航列表
		navList:"",
		selNavName:"行业（产业）绩效分析",
		selNavId:"three",
		pageChange:false,
		userId:"",
	},
	created:function(){
		this.url1=url1;
		this.url2=_url;
		this.navList=navlist;
		this.windowHeight=window.innerHeight-80-40;

		if(postToken==""||postToken==null||postToken==undefined){
			layer.msg("登录失效，请重新登录",{time:2000})
			window.location.href='/';
		}else{
			this.token=postToken;
		}
		if(userId!=""&&userId!==null&&userId!="undefined"){
			this.userId=userId;
		}else{
			this.userId="330700"
		}
		// this.login();
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
	},
	mounted:function(){
		this.$refs.main.style.height=this.windowHeight+"px";
		// this.echartShow("leftEchart");
		// this.echartShow("rightEchart");
		// this.barShow();
	},
	watch:{
		token:function(value){
			this.getTotal();
			this.getLandList();
			this.getaggreList();
			this.getRightList();
		}
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
		 * @右侧各行业产业指标对比
		 */
		getRightList:function(){
			var _url="/BigScreenComm/Get04_04List",
				type="right";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @中下指标数据汇总
		 */
		getaggreList:function(){
			var _url="/BigScreenComm/Get04_03List",
				type="centerBottom";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @中上土地性质对比
		 */
		getLandList:function(){
			var _url="/BigScreenComm/Get04_02List",
				type="centerTop";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @左侧各行业产业总量指标对比数据
		 */
		getTotal:function(){
			var _url="/BigScreenComm/Get04_01List",
				type="left";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @右侧侧绩效展示数据获取
		 */
		rightEchart:function(num){
			for(let j=0;j<this.meritsList.length;j++){
				if(this.meritsList[j].LXID==2){
					this.meritsShowList=this.meritsList[j].Data;
				}
			}
			var options=[];
			for(let i=0;i<this.meritsShowList.length;i++){
				var _list=this.meritsShowList[i];
				options.push({ZBID:_list.ZBID,ZBMC:_list.ZBMC})
			}
			this.meritsName=options;
			this.selMeritsThis(options[0].ZBID,options[0].ZBMC,0);
		},
		/**
		 * @右侧下拉触发
		 */
		selMeritsThis:function(ZBID,ZBMC,num){
			var city=[],
				data=[];
			this.selMeritsName=ZBMC;
			this.selMeritsId=ZBID;
			this.rightChooseShow=false;
			var selOptionData=this.meritsShowList[num].Data;
			for(let j=0;j<selOptionData.length;j++){
				var list=selOptionData[j];
				city.push(list.HYMC);
				if(list.VALUE<0){
					data.push(0)
				}else{
					data.push(list.VALUE)
				}
				// if(list.VALUE<0){
				// 	data.push({value:0,name:list.HYMC,itemStyle:{color:new echarts.graphic.LinearGradient(
				// 		0, 0, 0, 0.5,
				// 		[
				// 			{offset: 1, color: this.colorList[j].color1},
				// 			{offset: 0, color: this.colorList[j].color2},
				// 		]
				// 	)}})
				// }else{
				// 	data.push({value:list.VALUE,name:list.HYMC,itemStyle:{color:new echarts.graphic.LinearGradient(
				// 		0, 0, 0, 0.5,
				// 		[
				// 			{offset: 1, color: this.colorList[j].color1},
				// 			{offset: 0, color: this.colorList[j].color2},
				// 		]
				// 	)}})
				// }
			}
			var unit="";
			if(num==0){
				unit="万元";
			}else if(num==1){
				unit="人";
			}else if(num==2){
				unit="万元";
			}else if(num==3){
				unit="万元";
			}else if(num==4){
				unit="万元";
			}else if(num==5){
				unit="百分比";
			}
			this.barShowRight(city,data,unit)
			// this.echartShow("rightEchart",city,data);
		},
		/**
		 * @中下
		 * @统计部分获取要展示的集合数据
		 */
		aggreShow:function(num,type){
			this.selAggreList=this.aggreList[num].Data;
			this.sortName=type;
			this.aggreShowList=this.selAggreList.sort(this.compare(type))
		},
		/**
		 * @排序，降序
		 * @param {要排序的变量名} property 
		 */
		compare:function(property){
			return function(a,b){
				var value1 = a[property];
				var value2 = b[property];
				return value2 - value1;
			}
		},
		/**
		 * @页面降序触发
		 * @param {*} type 
		 */
		downSort:function(type){
			this.sortName=type;
			this.aggreShowList=this.selAggreList.sort(this.compare(type))
		},
		/**
		 * @中上
		 * @获取类别数据（行业/产业）
		 */
		centerDataLand:function(num){
			let options=[];
			this.landShowList=this.landList[num].Data;
			for(let i=0;i<this.landShowList.length;i++){
				let _list=this.landShowList[i];
				options.push({ZBID:_list.ZBID,ZBMC:_list.ZBMC})
			}
			this.landOptions=options;
			this.selLandThis(options[0].ZBID,options[0].ZBMC,0)
		},
		/**
		 * @中上
		 * @统计图数据处理
		 */
		selLandThis:function(ZBID,ZBMC,num){
			this.selLandName=ZBMC;
			this.selLandZBID=ZBID;
			this.chooseListShow=false;
			var landLists=[],
				name=[],
				type=["非自有土地企业","自有土地企业"],
				revenue=[],
				increase=[],
				haveList="",
				nohavelist="";
			for(let i=0;i<this.landShowList.length;i++){
				var list=this.landShowList[i];
				if(ZBID==list.ZBID){
					landLists=list.Data;
					for(let j=0;j<landLists.length;j++){
						var _handList=landLists[j];
						if(_handList.TDLX==1001){
							haveList=_handList.Data;
						}else{
							nohaveList=_handList.Data;
						}
					}
				}
			}
			for(let a=0;a<haveList.length;a++){
				let item=haveList[a];
				name.push(item.HYMC);
				revenue.push(item.VALUE);
			}
			for(let b=0;b<nohaveList.length;b++){
				let item=nohaveList[b];
				increase.push(item.VALUE);
			}
			var unit="";
			if(num==0){
				unit="万元";
			}else if(num==1){
				unit="万元";
			}else if(num==2){
				unit="人";
			}else if(num==3){
				unit="万元";
			}else if(num==4){
				unit="亩";
			}
			this.barShow(name,revenue,increase,type,unit);
		},
		/**
		 * @获取左侧要展示的数据
		 */
		leftDataHandle:function(num){
			this.totalShowList=this.totalList[num].Data;
			var options=[];
			for(let i=0;i<this.totalShowList.length;i++){
				var _list=this.totalShowList[i];
				options.push({ZBID:_list.ZBID,ZBMC:_list.ZBMC})
			}
			this.totalName=options;
			this.selTotalThis(options[0].ZBID,options[0].ZBMC,0);
		},
		/**
		 * @左侧
		 * @检索出统计图使用的数据
		 */
		selTotalThis:function(ZBID,ZBMC,num){
			var city=[],
				data=[];
			this.selTotalName=ZBMC;
			this.selTotalId=ZBID;
			this.leftChooseShow=false;
			var selOptionData=this.totalShowList[num].Data;
			for(let j=0;j<selOptionData.length;j++){
				var list=selOptionData[j];
				city.push(list.HYMC);
				if(list.VALUE<0){
					data.push({value:0,name:list.HYMC,itemStyle:{color:new echarts.graphic.LinearGradient(
						0, 0, 0, 0.5,
						[
							{offset: 1, color: this.colorList[j].color1},
							{offset: 0, color: this.colorList[j].color2},
						]
					)}})
				}else{
					data.push({value:list.VALUE,name:list.HYMC,itemStyle:{color:new echarts.graphic.LinearGradient(
						0, 0, 0, 0.5,
						[
							{offset: 1, color: this.colorList[j].color1},
							{offset: 0, color: this.colorList[j].color2},
						]
					)}})
				}
			}
			this.echartShow("leftEchart",city,data,"left");
		},
		/**
		 * @公共接口
		 */
		getDataJoggle:function(url,type){
			var _this=this;
			axios.post(
				this.url1+""+url,{
					DEP_ID:this.userId
				},
				{
					headers:{
						Authorization:"Bearer "+this.token,
					}
				}
			)
            .then(res => {
				var _data=res.data;
				if(_data.Code>0){
					layer.msg(_data.Msg,{time:2000})
				}else{
					if(_data.Data.length>0){
						if(type=="left"){
							_this.totalList=_data.Data;
							_this.leftDataHandle(0);
						}else if(type=="centerTop"){
							_this.landList=_data.Data;
							_this.centerDataLand(0);
						}else if(type=="centerBottom"){
							_this.aggreList=_data.Data;
							_this.aggreShow(0,"QYSL");
						}else if(type=="right"){
							_this.meritsList=_data.Data;
							_this.rightEchart(0)
						}
					}
				}
			})
			.catch(error=>{
				var status=error.response.status;
				if(status==401){
					layer.msg("登录已失效，请重新登录！",{time:2000})
					window.location.href='/';
				}
			})
		},
		/**
		 * @右侧指标对比
		 */
		ratioChange:function(type,num){
			this.ratioType=type;
			this.rightEchart(num)
		},
		/**
		 * @中下统计表改变
		 */
		listChange:function(type,num){
			this.listType=type;
			this.aggreShow(num,"QYSL");
		},
		/**
		  * @右一柱状图
		  */
		barShowRight:function(name,revenue,unit){
			let myChart = echarts.init(this.$refs.leftEchartBox);
			var option = {
				   grid: {
				   left: '3%',
				   right: '3%',
				   bottom: '5%',
				   top: '20%',
				   containLabel: true
			   },
			//    legend: {
			// 	   left: "right",
			// 	   top:"top",
			// 	   textStyle:{
			// 		   color:"#fff",
			// 	   },
			// 	   data: type
			//    },
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
			   yAxis: [{
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
			   }],
			   series: [{
					   name: '非自有土地企业',
					   type: 'bar',
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
									   color: '#f5da37'
								   }, {
									   offset: 1,
									   color: '#fe725d'
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
			   ]
		   };
		   myChart.setOption(option);
	   	},
		/**
		  * @中上柱状图
		  */
		barShow:function(name,revenue,increase,type,unit){
			let myChart = echarts.init(this.$refs.barShow);
			let dataZoom=true,
				endNum=17;
			if(this.landShowNum==0){
				dataZoom=true,
				endNum=17;
			}else{
				dataZoom=false,
				endNum=100;
			}
			var option = {
				   grid: {
				   left: '3%',
				   right: '3%',
				   bottom: '12%',
				   top: '15%',
				   containLabel: true
			   },
			   dataZoom: [
				{
					id: 'dataZoomX',
					type: 'slider',
					show:dataZoom,
					start: 0,
					end: endNum,
					height: 8, //组件高度
					bottom: 3, //右边的距离
					handleSize: 0, //滑动条的 左右2个滑动条的大小
					handleStyle: {
						borderColor: "#CBBCDB",
						borderWidth: "1",
						shadowBlur: 2,
						background: "#CBBCDB",
						shadowColor: "#CBBCDB",
					},
					showDataShadow: false, //是否显示数据阴影 默认auto
 					showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
				 }
			   ],
			   legend: {
				   left: "right",
				   top:"top",
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
			   yAxis: [{
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
			   }],
			   series: [{
					   name: '非自有土地企业',
					   type: 'bar',
					   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						   offset: 0,
						   color: '#ff8989'
						}, {
							offset: 1,
							color: '#ff6166'
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
									   color: '#ff8989'
									}, {
										offset: 1,
										color: '#ff6166'
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
					   name: '自有土地企业',
					   type: 'bar',
					   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						   offset: 0,
						   color: '#5a9adc'
					   }, {
						   offset: 1,
						   color: '#4361db'
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
										   color: '#5a9adc'
									   }, {
										   offset: 1,
										   color: '#4361db'
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
				   }
			   ]
		   };
		   myChart.setOption(option);
		},
		/**
		  * @两侧散饼图
		  */
		echartShow:function(name,city,data,visit){
			let myChart = echarts.init(this.$refs[name]);
			let radius=[],center=[],itemGap="";
			if(visit=="left"){
				if(this.barType=="trade"){
					radius=['10%','40%'];
					if(name=="leftEchart"){
						center=["50%", "32%"];
					}else{
						center=["50%", "40%"];
					}
					itemGap=3;
				}else{
					radius=['15%','60%'];
					center=["50%", "45%"];
					itemGap=20;
				}
			}else{
				if(this.ratioType=="trade"){
					radius=['10%','40%'];
					if(name=="leftEchart"){
						center=["50%", "32%"];
					}else{
						center=["50%", "40%"];
					}
					itemGap=3;
				}else{
					radius=['15%','60%'];
					center=["50%", "45%"];
					itemGap=20;
				}
			}
            var option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
                legend: {
                    left: 50,
                    top: 'bottom',
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
					itemGap: itemGap,
					data: city,
                },
                series : [
                    {
                        name: '总量指标对比图',
                        type: 'pie',
						radius: radius,
						center: center,
						roseType: 'angle',
						label:{            //饼图图形上的文本标签
                            normal: {
								textStyle : {
									color:"#00d5e6"
								},
								// formatter: '{b|{b}} \n {c}({d}%)',       //图形外文字上下显示
								// // borderWidth: 20,
								// rich: {
								// 	b: {                        //name 文字样式
								// 		fontSize: 12,
								// 		lineHeight: 14,
								// 		color: '#00d5e6',
								// 	},
								// 	d: {                   //value 文字样式
								// 		fontSize: 12,
								// 		lineHeight: 14,
								// 		color: '#00d5e6',
								// 		align:"left"
								// 	}
								// }
							}
                        },
						data:data,
                    }
                ]
            };
            myChart.setOption(option);
		},
		/**
		 * @统计图切换
		 * @param {*} type 
		 */
		barChange:function(type,num){
			this.barType=type;
			this.leftDataHandle(num);
		},
		/**
		 * @中间上方下拉触发
		 */
		chooseShow:function(){
			this.chooseListShow=!this.chooseListShow;
		},
		/**
		 * @左侧下拉触发
		 */
		leftChoose:function(){
			this.leftChooseShow=!this.leftChooseShow;
		},
		/**
		 * @右侧下拉触发
		 */
		rightChoose:function(){
			this.rightChooseShow=!this.rightChooseShow;
		},
		/**
		 * @中上行业、产业切换
		 */
		landChange:function(type,num){
			this.landType=type;
			this.landShowNum=num;
			this.centerDataLand(num)
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
						document.cookie = "bigToken"+"="+_this.token+";expires="+expdate.toGMTString()+";path=/";
                   	}
                })
		},
	}
})