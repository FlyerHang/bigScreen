var vm=new Vue({
	el:"#areaAnalyse",
	data:{
		barType:"have",
		url1:"",	//代理IP
		url2:"",	//限上IP
		token:"",
		listType:"all",	//左侧模块
		ratioType:"have",	//中间
		windowHeight:"",	//窗口高度
		chooseListShow:false,	//中间下拉显示
		leftChooseShow:false,	//左侧下拉
		rightChooseShow:false,	//右侧下拉
		colorList:[],	//饼图渐变列表
		//左侧
		targetList:"",	//左侧返回数据列表
		targetShowList:"",	//左侧展示的数据
		leftOptionsList:"",	//左侧下拉列表
		leftOptionsData:"",	//左侧下拉图标数据集合
		selTargetName:"",	//当前图标展示的属性名
		selTargetId:"",
		//中上
		landList:"",	//返回的总数据
		landShowList:"",	//选中展示的数据
		landOptions:"",		//下拉列表
		selLandName:"",		//当前统计图展示的内容名称
		selLandZBID:"",		//当前统计图展示内容的id
		//中下
		aggreList:"",	//返回的数据
		aggreShowList:"",	//当前选中展示的数据
		selAggreList:"",
		sortName:"",	//当前排序所依据的id
		//右侧数据
		meritsList:"",	//右侧绩效返回的数据
		meritsName:"",
		selMeritsName:"",
		selMeritsId:"",
		meritsShowList:"",	//要展示数据聚合
		//页面导航列表
		navList:"",
		selNavName:"区域绩效分析",
		selNavId:"two",
		pageChange:false,
		userId:"",
	},
	created:function(){
		this.url1=url1;
		this.url2=_url;
		this.navList=navlist;
		this.windowHeight=window.innerHeight-80-40;
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
		]
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
	},
	mounted:function(){
		this.$refs.main.style.height=this.windowHeight+"px";
		// this.echartShow("rightEchart");
		// this.barShow();
	},
	watch:{
		token:function(value){
			this.getTarget();
			this.getLandList();
			this.getAggregate();
			this.getMerits();
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
		 * @右侧绩效指标对比图
		 */
		getMerits:function(){
			var _url="/BigScreenComm/Get03_04List",
				type="right";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @获取中下规上企业数据汇总
		 */
		getAggregate:function(){
			var _url="/BigScreenComm/Get03_03List",
				type="centerBottom";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @获取中上土地性质指标对比图
		 */
		getLandList:function(){
			var _url="/BigScreenComm/Get03_02List",
				type="centerTop";
			this.getDataJoggle(_url,type);
		},
		/**
		 * @获取左侧总量指标对比图
		 */
		getTarget:function(){
			var _url="/BigScreenComm/Get03_01List",
				type="left";
			this.getDataJoggle(_url,type);
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
							_this.targetList=_data.Data;
							_this.leftDatahand(0);
						}else if(type=="centerTop"){
							_this.landList=_data.Data;
							_this.centerEchart(0)
						}else if(type=="centerBottom"){
							_this.aggreList=_data.Data;
							_this.aggreShow(0,"QYSL");
						}else if(type=="right"){
							_this.meritsList=_data.Data;
							_this.rightEchart(0)
						}
					}else{
						layer.msg("当前查询无数据！",{time:2000})
					}
				}
			})
			.catch(error=>{
				var status=error.response.status;
				if(status==401){
					layer.msg("登录已失效，请重新登录！",{time:2000});
					window.location.href='/';
				}
			})
		},
		/**
		 * @右侧侧绩效展示数据获取
		 */
		rightEchart:function(num){
			this.meritsShowList=this.meritsList[num].Data;
			var options=[];
			for(let i=0;i<this.meritsShowList.length;i++){
				var _list=this.meritsShowList[i];
				options.push({ZBID:_list.ZBID,ZBMC:_list.ZBMC})
			}
			this.meritsName=options;
			this.selMeritsThis(options[0].ZBID,options[0].ZBMC,0);
		},
		/**
		 * @中下统计部分获取要展示的集合数据
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
		 * @中上数据提取下拉
		 */
		centerEchart:function(){
			var options=[];
			for(let i=0;i<this.landList.length;i++){
				var list=this.landList[i]
				options.push({ZBID:list.ZBID,ZBMC:list.ZBMC});
			}
			this.landOptions=options;
			this.selLandThis(options[0].ZBID,options[0].ZBMC,0)
		},
		/**
		 * @中上获取统计图数据
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
			for(let i=0;i<this.landList.length;i++){
				var list=this.landList[i];
				if(ZBID==list.ZBID){
					landLists=list.Data;
					for(let j=0;j<landLists.length;j++){
						var _handList=landLists[j];
						if(_handList.LXID==1){
							haveList=_handList.Data;
						}else{
							nohaveList=_handList.Data;
						}
					}
				}
			}
			for(let a=0;a<haveList.length;a++){
				let item=haveList[a];
				name.push(item.DQMC);
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
		 * @左侧数据处理
		 */
		leftDatahand:function(num){
			this.targetShowList=this.targetList[num].Data;
			var options=[];
			for(let i=0;i<this.targetShowList.length;i++){
				var _list=this.targetShowList[i];
				options.push({ZBID:_list.ZBID,ZBMC:_list.ZBMC})
			}
			this.leftOptionsList=options;
			this.selThis(options[0].ZBID,options[0].ZBMC,0);
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
				city.push(list.DQMC);
				if(list.VALUE<0){
					data.push(0)
				}else{
					data.push(list.VALUE)
				}
				// if(list.VALUE<0){
				// 	data.push({value:0,name:list.DQMC,itemStyle:{color:new echarts.graphic.LinearGradient(
				// 		0, 0, 0, 0.5,
				// 		[
				// 			{offset: 1, color: this.colorList[j].color1},
				// 			{offset: 0, color: this.colorList[j].color2},
				// 		]
				// 	)}})
				// }else{
				// 	data.push({value:list.VALUE,name:list.DQMC,itemStyle:{color:new echarts.graphic.LinearGradient(
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
				if(this.meritsShowList.length>2){
					unit="人";
				}else{
					unit="万元";
				}
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
		 * @左侧下拉选中触发
		 */
		selThis:function(ZBID,ZBMC,num){
			var city=[],
				data=[];
			this.selTargetName=ZBMC;
			this.selTargetId=ZBID;
			this.leftChooseShow=false;
			var selOptionData=this.targetShowList[num].Data;
			for(let j=0;j<selOptionData.length;j++){
				var list=selOptionData[j];
				city.push(list.DQMC);
				if(list.VALUE<0){
					data.push({value:0,name:list.DQMC,itemStyle:{color:new echarts.graphic.LinearGradient(
						0, 0, 0, 0.5,
						[
							{offset: 1, color: this.colorList[j].color1},
							{offset: 0, color: this.colorList[j].color2},
						]
					)}})
				}else{
					data.push({value:list.VALUE,name:list.DQMC,itemStyle:{color:new echarts.graphic.LinearGradient(
						0, 0, 0, 0.5,
						[
							{offset: 1, color: this.colorList[j].color1},
							{offset: 0, color: this.colorList[j].color2},
						]
					)}})
				}
			}
			this.echartShow("leftEchart",city,data);
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
				   top: '17%',
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
		  * @右二柱状图
		  */
		barShow:function(name,revenue,increase,type,unit){
		 	let myChart = echarts.init(this.$refs.barShow);
		 	var option = {
	                grid: {
		            left: '3%',
		            right: '3%',
		            bottom: '5%',
		            top: '15%',
		            containLabel: true
				},
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
		  * @散饼图
		  */
		echartShow:function(name,city,data){
			let myChart = echarts.init(this.$refs[name])
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
					itemGap: 20,
					data: city,
                },
                series : [
                    {
                        name: '指标对比图',
                        type: 'pie',
						radius: ['15%','55%'],
						center: ['50%','45%'],
						roseType: 'angle',
						label:{            //饼图图形上的文本标签
                            normal: {
								textStyle : {
									color:"#00d5e6"
								},
								formatter: '{b|{b}} \n {c}({d}%)',       //图形外文字上下显示
								// borderWidth: 20,
								// padding: [0,50],
								rich: {
									b: {                        //name 文字样式
										fontSize: 12,
										lineHeight: 14,
										color: '#00d5e6',
									},
									c:{
										fontSize: 12,
										lineHeight: 14,
										color: '#00d5e6',
										align:"left"
									},
									d: {                   //value 文字样式
										fontSize: 12,
										lineHeight: 14,
										color: '#00d5e6',
										align:"left"
									}
								}
							}
                        },
						data:data,
                    }
                ]
            };
            myChart.setOption(option);
		},
		/**
		 * @饼图切换
		 */ 
		barChange:function(type,num){
			this.barType=type;
			this.leftDatahand(num);
		},
		/**
		 * @获取cookie中的token
		 */
		getCookie:function(name){
			var arr = document.cookies.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null) return unescape(arr[2]); return '';
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
		 * @指标对比
		 */
		ratioChange:function(type,num){
			this.ratioType=type;
			this.rightEchart(num);
		},
		/**
		 * @统计表改变
		 */
		listChange:function(type){
			this.listType=type;
			if(type=="all"){
				this.aggreShow(0,"QYSL")
			}else if(type=="have"){
				this.aggreShow(1,"QYSL")
			}else if(type=="nohave"){
				this.aggreShow(2,"QYSL")
			}
		},
	}
})