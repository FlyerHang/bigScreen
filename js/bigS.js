var vm=new Vue({
	el:"#bigS",
	data:{
		title:"金华市服务业亩产效益智能大屏",
		echartType:"A",
		gdpType:"all",
		meritsType:"all",
		url1:"",	//代理IP
		url2:"",	//限上IP
		token:"",	//token;
		windowHeight:"",
		assessList:"",	//后端返回综合评价
		economicList:"",	//经济指标
		totalList:"",	//中间总计
		achieList:"",	//绩效指标
		enterpriseList:"",	//企业效益
		assessShowList:"",	//当前展示综合评价
		economicShowList:"",	//经济指标
		achieShowList:"",	//绩效指标
		//页面导航列表
		navList:"",
		selNavName:"亩产效益智能大屏",
		selNavId:"one",
		pageChange:false,
		userId:"",
		areaListArray:"",
		areaList:"",
		map:"",
		mapShowType:"",
		markers:[],
		areaType:"",
	},
	created:function(){
		this.url1=url1;
		this.url2=_url;
		this.navList=navlist;
		this.areaListArray=areaListArray;
		this.login();
		this.windowHeight=window.innerHeight-80-40;
		// if(postToken==""||postToken==null||postToken==undefined){
		// 	layer.msg("登录失效，请重新登录",{time:2000})
		// 	window.location.href='/';
		// }else{
		// 	this.token=postToken;
		// }
		this.userId=userId;
	},
	mounted:function(){
		this.$refs.allMap.style.height=(this.windowHeight+40)+"px";
		this.$refs.main.style.height=this.windowHeight+"px";
		this.map = new BMapGL.Map("allMap");
		var point = new BMapGL.Point(119.722, 29.222);
		this.map.centerAndZoom(point, 10);
		this.map.setTilt(50);
		this.map.enableScrollWheelZoom();
		var styleJson = styleItem;
		this.map.setMapStyleV2({styleJson: styleJson});
	},
	watch:{
		token:function(value){
			this.getAssess();
			this.getEconomic();
			this.getTotal();
			this.getAchie();
			this.getEnterprise();
			if(this.userId.slice(4)>0){
				this.areaType=1;
				this.polygonShow("330702",1);
			}else{
				this.areaType=2;
				this.polygonShow(this.userId,2);
			}
		},
	},
	methods:{
		/**
		 * @轮廓图
		 */
		polygonShow:function(id,type){
			if(type==1){
				this.areaList=[];
				for(let i=0;i<this.areaListArray.length;i++){
					let _list=this.areaListArray[i];
					if(_list.id==id){
						this.areaList.push(_list);
					}
				}
				this.getCompanyNews(id)
			}else{
				if(id.slice(4)>0&&this.areaList.length>1){
					this.areaList=[];
					for(let i=0;i<this.areaListArray.length;i++){
						let _list=this.areaListArray[i];
						if(_list.id==id){
							this.areaList.push(_list);
						}
					}
					this.getCompanyNews(id)
				}else{
					this.areaList=[];
					this.areaList=this.areaListArray;
					this.getCompanyNews(this.userId)
				}
			}
			this.map.clearOverlays();
			for(let i=0;i<this.areaList.length;i++){
				this.getBoundary(this.areaList[i]);
			}
		},
		/**
		 * @企业类型筛选
		 */
		mapChange:function(type){
			if(this.mapShowType==type){
				this.mapShowType="";
			}else{
				this.mapShowType=type;
			}
			for(let i=0;i<this.markers.length;i++){
				var marker=this.markers[i];
				this.map.removeOverlay(marker);
			}
			this.mapShow(this.companyNews);
		},
		/**
		 * @地图描点
		 */
		mapShow:function(list){
			this.markers=[];
			for(let i=0;i<list.length;i++){
				var _list=list[i];
				var _img="";
				var point = new BMapGL.Point(_list.Longitude,_list.Latitude);
				if(this.mapShowType==""){
					if(_list.ZHFL=="A"){
						_img="../img/mark_1.png";
					}else if(_list.ZHFL=="B"){
						_img="../img/mark_2.png";
					}else if(_list.ZHFL=="C"){
						_img="../img/mark_3.png";
					}else if(_list.ZHFL=="D"){
						_img="../img/mark_4.png";
					}
					var myIcon = new BMapGL.Icon(_img, new BMapGL.Size(10,14));
					var marker = new BMapGL.Marker(point,{icon:myIcon});
					this.markers.push(marker)
					this.map.addOverlay(marker)
				}else{
					if(_list.ZHFL==this.mapShowType){
						if(_list.ZHFL=="A"){
							_img="../img/mark_1.png";
						}else if(_list.ZHFL=="B"){
							_img="../img/mark_2.png";
						}else if(_list.ZHFL=="C"){
							_img="../img/mark_3.png";
						}else if(_list.ZHFL=="D"){
							_img="../img/mark_4.png";
						}
						var myIcon = new BMapGL.Icon(_img, new BMapGL.Size(10,14));
						var marker = new BMapGL.Marker(point,{icon:myIcon});
						this.markers.push(marker)
						this.map.addOverlay(marker)
					}
				} 
			}
		},
		/**
		 * @画轮廓图
		 * @param {*} url 
		 */
		getBoundary:function(list){
			var _this=this;
			var bdary = new BMapGL.Boundary();
			bdary.get(list.name, function(rs){       //获取行政区域 
				var count = rs.boundaries.length; //行政区域的点有多少个
				if (count === 0) {
					alert('未能获取当前输入行政区域');
					return ;
				}
				// var pointArray = [];
				for (var i = 0; i < count; i++) {
					var ply = new BMapGL.Polygon(rs.boundaries[i], {strokeWeight: 3, strokeColor: "#0a29b1"}); //建立多边形覆盖物
					ply.addEventListener('click', function(e) {
						if(_this.areaType==2){
							_this.polygonShow(list.id,2);
						}
					});
					_this.map.addOverlay(ply); 
				}
			});
			if(this.areaList.length==1){
				var point = new BMapGL.Point(list.lat, list.lng);
				this.map.centerAndZoom(point, 11);
			}else{
				var point = new BMapGL.Point(119.722, 29.222);
				this.map.centerAndZoom(point, 10);
			}
		},
		/**
		 * @获取公司的经纬度坐标
		 */
		getCompanyNews:function(id){
			var _url="/BigScreenComm/Get01_06List";
			var _this=this;
			axios.post(
				this.url1+""+_url,{
					DEP_ID:id
				},
				{
					headers:{
						Authorization:"Bearer "+this.token,
					}
				}
			)
			.then(res => {
				var _data=res.data;
				if(_data.code>0){
						layer.msg(_data.Msg,{time:2000})
				}else{
					if(_data.Data.length>0){
						_this.companyNews=_data.Data;
						_this.mapShow(_this.companyNews)
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
				if(_data.code>0){
					layer.msg(_data.Msg,{time:2000})
				}else{
					if(_data.Data.length>0){
						if(type=="assess"){
							_this.assessList=_data.Data;
							_this.echartDataHand();
						}else if(type=="economic"){
							_this.economicList=_data.Data;
							_this.economicShowList=_this.economicList[0];
						}else if(type=="total"){
							_this.totalList=_data.Data[0];
						}else if(type=="achie"){
							_this.achieList=_data.Data;
							_this.achieShowList=_this.achieList[0];
						}else if(type=="enterprise"){
							_this.enterpriseList=_data.Data[0];
						}else if(type=="map"){
							_this.companyNews=_data.Data;
							_this.mapShow(_this.companyNews)
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
		 * @获取右下角企业效益
		 */
		getEnterprise:function(){
			var _url="/BigScreenComm/Get01_05List",
				_type="enterprise";
			this.getDataJoggle(_url,_type)
		},
		/**
		 * @获取右上角绩效指标
		 */
		getAchie:function(){
			var _url="/BigScreenComm/Get01_04List",
				_type="achie";
			this.getDataJoggle(_url,_type)
		},
		/**
		 * @获取中间统计数据
		 */
		getTotal:function(){
			var _url="/BigScreenComm/Get01_03List",
				_type="total";
			this.getDataJoggle(_url,_type)
		},
		/**
		 * @左下角经济指标
		 */
		getEconomic:function(){
			var _url="/BigScreenComm/Get01_02List",
				_type="economic";
			this.getDataJoggle(_url,_type)
		},
		/**
		 * @左上角效益综合评价
		 */
		getAssess:function(){
			var _url="/BigScreenComm/Get01_01List",
				_type="assess";
			this.getDataJoggle(_url,_type);
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
		 *@规上企业绩效指标切换
		 */
		meritsChange:function(type){
			this.meritsType=type;
			if(this.meritsType=="all"){
				this.achieShowList=this.achieList[0];
			}else if(this.meritsType=="have"){
				this.achieShowList=this.achieList[1];
			}else if(this.meritsType=="nohave"){
				this.achieShowList=this.achieList[2];
			}
		},
		/**
		  *@总量经济指标切换
		  */
		gdpChange:function(type){
			this.gdpType=type;
			if(this.gdpType=="all"){
				this.economicShowList=this.economicList[0];
			}else if(this.gdpType=="have"){
				this.economicShowList=this.economicList[1];
			}else if(this.gdpType=="have"){
				this.economicShowList=this.economicList[2];
			}
		},
		/**
		 * @echart数据处理
		 */
		echartDataHand:function(){
			let _this=this,
				showList=[],
				time =[],
				revenue=[],
				percentage=[];
			for(let i=0;i<_this.assessList.length;i++){
				let list=_this.assessList[i];
				if(list.ZHFL==this.echartType){
					showList=list.Data;
				}
			}
			for(let j=showList.length-1;j>=0;j--){
				let _list=showList[j];
				time.push(_list.NF);
				if(j==showList.length-1){
					percentage.push(0);
					if(_list.MJSS<0){
						revenue.push(0);
					}else{
						revenue.push(_list.MJSS);
					}
				}else{
					var prev=showList[j+1]
					if(_list.MJSS>0&&prev.MJSS>0){
						percentage.push(_list.MJSS/prev.MJSS);
					}else{
						if(_list.MJSS>0){
							percentage.push(100);
						}else{
							percentage.push(0);
						}
					}
					if(_list.MJSS<0){
						revenue.push(0);
					}else{
						revenue.push(_list.MJSS);
					}
				}
			}
			_this.echartShow(time,revenue,percentage);
		},
		/**
		  * @画统计图
		  * @param {*} time  时间轴  
		  * @param {*} revenue  柱轴数据集合
		  */
		echartShow:function(time,revenue,percentage){
		 	var time=time,
		 		revenue=revenue;
		 	let myChart = echarts.init(this.$refs.echartShow);
		 	var option = {
	                grid: {
		            left: '3%',
		            right: '3%',
		            bottom: '5%',
		            top: '15%',
		            containLabel: true
		        },
		        xAxis: {
					type: 'category',
		            axisTick: {
		                show: true//隐藏x坐标轴刻度
		            },
		            splitLine:{
                        show:false
					},
					axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
						show: true,
						rotate: 0,
						margin: 8,
						// formatter: null,
						textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
							color: '#fff'
						}
					},
		            //x轴颜色
		            axisLine: {
		                lineStyle: {
		                    color: "#e4e4e4",
		                }
		            },
		            data: time
		        },
		        yAxis: [
					{
						type: 'value',
						//y轴字体样式
						position: 'left',      // 位置
						nameLocation: 'end',
						name: "亩均税收",
						axisLabel: {
							show: true,
							textStyle: {
								color: '#9495ab',
								fontSize:'12'
							}
						},
						splitLine:{
							show:true,
							lineStyle:{
								color:"#044056"
							}
						},
						axisLine: {
							lineStyle: {
								color: "#e4e4e4",
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
		                name: '亩均税收',
						type: 'bar',
						yAxisIndex: 0,
		                barWidth : 20,//柱体宽度
		                itemStyle: {
		                    normal: {
		                    	label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#00d7e8',
										fontSize: 16
									}
								},
		                    	color:function(params) {
                                    let colorList = [
                                        new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                        offset: 0,
					                        color: '#072fe0'
					                    }, {
					                        offset: 1,
					                        color: '#00b0fb'
										}]),
					                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                        offset: 0,
					                        color: '#fe735e'
					                    }, {
					                        offset: 1,
					                        color: '#fddd38'
										}]),
										new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                        offset: 0,
					                        color: '#fa6164'
					                    }, {
					                        offset: 1,
					                        color: '#fd8989'
					                    }]),
                                    ];
                                    return colorList[params.dataIndex];
                                }
		                    }
						},
						data:revenue
		            },
		            {
			            name:'增幅',
			            type:'line',
			            yAxisIndex: 1,   //这里要设置哪个y轴，默认是最左边的是0，然后1，2顺序来。
			            data:percentage,
						symbolSize:2,
			            itemStyle:{
				            normal:{
				            	color:"#0068dd"
				            }
			            }
			        },
		        ]
            };
            myChart.setOption(option);
		},
		// 统计图切换
		echartChange:function(type){
			this.echartType=type;
			this.echartDataHand();
		},
		/**
		 * @获取cookie中的token
		 */
		getCookie:function(name){
			var arr = document.cookies.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null) return unescape(arr[2]); return '';
		},
	}
})