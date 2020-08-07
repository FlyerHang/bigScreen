var vm=new Vue({
	el:"#portraits",
	data:{
        windowHeight:"",    //当前窗口高度
        token:"",   //请求数据token
		//页面导航列表
		navList:"",
		selNavName:"企业画像",
		selNavId:"one",
		pageChange:false,
        userId:"",
        comName:"",     //输入的搜索名称
        zdShow:false,   //诊断是否显示
        //下拉显示状态
        areaList:"",    //区域列表
        chyList:"",     //产业-行业名称集合
        chyListShow:[], //产业-行业选中展示
        cyList:"",      //产业列表
        hyList:"",      //行业列表
        otherList:"",   //分类列表
        areaName:"请选择区域",
        areaIndex:"",
        areaShow:false,
        areaGrade:"",

        tdName:"请选择土地性质",
        tdIndex:"",
        tdShow:false,
        pfName:"请选择评分分档",
        pfIndex:"",
        pfShow:false,

        cyName:"请选择",
        cyIndex:"",
        cyShow:false,
        cyCName:"请选择",
        cyCIndex:"",
        cyCShow:false,
        otherName:"请选择",
        otherIndex:"",
        otherShow:false,
        otherCName:"请选择",
        otherCIndex:"",
        otherCShow:false,

        //企业列表
        companyList:[], //查询到的企业列表
        companyShow:false,
        companyNews:"", //公司信息
        selCompanyId:"",    //选中的公司id
        selCompanyName:"",  //选中公司的名称
        selCompanyNews:"",  //选中的公司详细信息
        zdNews:[],  //诊断信息
        pages:0,    //总页数
        nowPage:1,  //当前显示页面
        pageSize:18,    //页面大小
        selPage:"", //输入框页面
        //企业信息
        selConNewsindex:1,
        shareholder:[],     //最终持股人
        patentNews:"",      //专利信息
        trademarkNews:"",   //商标信息
        softwareNews:"",    //软件信息
        selNavId:"four",
	},  
	created:function(){
		this.url1=url1;
		this.url2=_url;
		this.navList=navlist;
		this.login();
        this.windowHeight=window.innerHeight-80-40;
        if(userId!=""&&userId!==null&&userId!="undefined"){
			this.userId=userId;
		}else{
			this.userId="330700";
		}
	},
	mounted:function(){
		this.$refs.main.style.height=this.windowHeight+"px";
	},
	watch:{
		token:function(value){
			this.getselList();
        },
        cyIndex:function(value){
            this.cyCName="请选择";
            this.cyCIndex="";
            if(value=="CYXX"){
                this.chyListShow=this.cyList;
            }else if(value=="HYXX"){
                this.chyListShow=this.hyList;
            }
        }
	},
	methods:{
        /**
         * @公司信息切换
         */
        selConNewsTab(num){
            this.selConNewsindex=num;
            var args=JSON.stringify({
                entInfo:this.selCompanyName
            })
            if(num==1){

            }else if(num==2){

            }else if(num==3){
                var num="100151";
                this.joggle(num,args);
            }else if(num==4){
                // 105100  专利信息查询接口
                this.joggle(105100,args);
                // 105101  商标信息查询接口
                this.joggle(105101,args);
                // 105102  软件著作查询接口
                this.joggle(105102,args);
            }
        },
        /**
         * @诊断触发
         * @param {*} url 
         */
        zdShowNews:function(){
            this.zdShow=true;
            var _this=this;
            axios.post(
				this.url1+"/BigScreenComm/Get06_04List",{
                    DEP_ID:this.userId,
                    UNI_ID: this.selCompanyId
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
                        _this.zdNews=_data.Data;
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
         * @查看公司信息
         */
        companyNewsShow(index,comPanyId,companyName){
            this.companyShow=true;
            this.selCompanyId=comPanyId;
            this.selCompanyName=companyName;
            this.selCompanyNews=this.companyList[index];
            this.getCompanyNews(comPanyId);
        },
        /**
         * @获取公司的基本信息
         */
        getCompanyNews:function(companyId){
            var num="100119";
            var args=JSON.stringify({
                entInfo:companyId
            })
            this.joggle(num,args);
        },
        /**
         * @后台代理有数接口
         * @num:接口编号 args:参数
         */
        joggle:function(num,args){
            var _this=this;
            axios.get(//100119//151
                this.url1+"/BigScreenComm/Get06_03List?api="+num+"&args="+args,
                {
                    headers:{
                        // contentType: 'application/json;charset=UTF-8',
                        Authorization:"Bearer "+this.token,
                    }
                }
            )
            .then(res => {
                var _data=res.data;
                if(_data.code!="0000"){
                    layer.msg(_data.Msg,{time:2000})
                }else{
                    if(_data.data){
                        if(num==100119){
                            _this.companyNews=_data.data;
                        }else if(num==100151){
                            _this.shareholder=_data.data;
                        }else if(num==105100){
                            _this.patentNews=_data.data;
                        }else if(num==105101){
                            _this.trademarkNews=_data.data;
                        }else if(num==105102){
                            _this.softwareNews=_data.data;
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
         * @开始搜索
         */
        submitAll:function(){
            var _this=this;
            var obj={};
            if(this.cyIndex!="HYXX"){
                obj={
                    DEP_ID:this.userId,
                    PageSize: this.pageSize,
                    CurrentPage: this.nowPage,
                    XZDQLX: this.areaGrade,
                    XZDQ: this.areaIndex,
                    HYID: this.cyCIndex,
                    CYID: "",
                    YSGM: this.otherCIndex,
                    NAME: this.comName,
                    TDLX: "",
                    PJFL: "",
                }
            }else{
                obj={
                    DEP_ID:this.userId,
                    PageSize: this.pageSize,
                    CurrentPage: this.nowPage,
                    XZDQLX: this.areaGrade,
                    XZDQ: this.areaIndex,
                    HYID: "",
                    CYID: this.cyCIndex,
                    YSGM: this.otherCIndex,
                    NAME: this.comName,
                    TDLX: "",
                    PJFL: "",
                }
            }
            if(this.areaIndex==""){
                layer.msg("请选择要查询的区域！",{time:2000})
            }else{
                axios.post(
                    this.url1+"/BigScreenComm/Get06_02List",obj,
                    {
                        headers:{
                            // contentType: 'application/json;charset=UTF-8',
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
                            _this.companyList=_data.Data;
                            _this.pages=_data.TotalCount;
                            // let html="";
                            // if(page>4){
                            //     html="<ul><li @click='prevPage()'> < </li><li class='select' @click='goPage(1)'>1</li><li @click='goPage(1)'>2</li><li>...</li><li @click='goPage("+page+")'>"+page+"</li><li @click='nextPage()'> > </li><li><input type='text' v-model='selPage'></li><li @click='toPage()'>跳转</li></ul>"
                            // }else{
                            //     html+="<ul><li @click='prevPage()'> < </li>";
                            //     for(let i=1;i<page+1;i++){
                            //         html+="<li class='select'>"+i+"</li>";
                            //     }
                            //     html+="<li @click='nextPage()'> > </li></ul>";
                            // }
                            // $('.pageBox').empty().append(html);
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
            }
        },
        /**
         * @翻页
         */
        prevPage:function(){
            this.nowPage-=1;
            if(this.nowPage<1){
                layer.msg("当前是第一页",{time:2000})
                this.nowPage=1;
            }else{
                this.submitAll();
            }
        },
        nextPage:function(){
            this.nowPage+=1;
            if(this.nowPage>this.pages){
                layer.msg("当前是最后一页",{time:2000})
                this.nowPage=this.pages;
            }else{
                this.submitAll();
            }
        },
        goPage:function(num){
            this.nowPage=num;
            this.submitAll();
        },
        toPage:function(){
            if(this.selPage<1||this.selPage>this.pages){
                layer.msg("请输入有效的页数",{time:2000})
            }else{
                this.nowPage==this.selPage;
                this.submitAll();
            }
        },
        /**
         * @清空搜索条件
         */
        clearAll:function(){
            this.comName="";
            this.areaName="请选择区域";
            this.areaIndex="";
            this.areaGrade="";
            this.cyName="请选择";
            this.cyIndex="";
            this.cyCName="请选择";
            this.cyCIndex="";
            this.otherName="请选择";
            this.otherIndex="";
            this.otherCName="请选择";
            this.otherCIndex="";
        },
        /**
         * @搜索条件查询
         */
        getselList:function(){
            var _this=this;
            axios.post(
				this.url1+"/BigScreenComm/Get06_01List",{
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
                        var lists=_data.Data,
                            yList=[];
                        for(let i=0;i<lists.length;i++){
                            var _list=lists[i];
                            if(_list.CSLX=="QXZJXX"){
                                _this.areaList=_list.Data;
                            }else if(_list.CSLX=="HYXX"){
                                yList.push({Id:"HYXX",Name:"行业"})
                                _this.hyList=_list.Data;
                            }else if(_list.CSLX=="CYXX"){
                                yList.push({Id:"CYXX",Name:"产业"})
                                _this.cyList=_list.Data;
                            }else if(_list.CSLX=="YYSR"){
                                _this.otherList=_list.Data;
                            }
                        }
                        _this.chyList=yList;
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
         * @区域选择
         */
        areaChange:function(index,name,grade){
            this.areaIndex=index;
            this.areaName=name;
            this.areaGrade=grade;
            this.areaShow=false;
        },
        /**
         * @按产业选择
         */
        cyChange:function(index,name){
            this.cyIndex=index;
            this.cyName=name;
            this.cyShow=false;
        },
        /**
         * @细分产业选择选择
         */
        cyCChange:function(index,name){
            this.cyCIndex=index;
            this.cyCName=name;
            this.cyCShow=false;
        },
        /**
         * @其他选择
         */
        otherChange:function(index,name){
            this.otherIndex=index;
            this.otherName=name;
            this.otherShow=false;
        },
        /**
         * @其他细分选择
         */
        otherCChange:function(index,name){
            this.otherCIndex=index;
            this.otherCName=name;
            this.otherCShow=false;
        },
        /**
         * @土地性质选择
         */
        tdChange:function(index,name){
            this.tdIndex=index;
            this.tdName=name;
            this.tdShow=false;
        },
        /**
         * @评分选择
         */
        pfChange:function(index,name){
            this.pfIndex=index;
            this.pfName=name;
            this.pfShow=false;
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
						// var expdate = new Date();   //初始化时间
						// expdate.setTime(expdate.getTime() + 30 * 60 * 1000);   //时间单位毫秒
						// document.cookies = "bigToken"+"="+_this.token+";expires="+expdate.toGMTString()+";path=/";
                   	}
                })
		},
	}
})