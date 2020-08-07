var _url="http://139.196.93.63:9007/api";//线上
var url1="http://127.0.0.1:8888/loc/api";
// var url1="/apiBigScreen";

var navlist=[
    {name:"亩产效益智能大屏",url:"bigS.html",id:"one"},
    {name:"区域绩效分析",url:"areaAnalyse.html",id:"two"},
    {name:"行业（产业绩效分析）",url:"trade.html",id:"three"},
    {name:"企业画像",url:"portraits.html",id:"four"},
    ];
// function setCookie(name, value) {  
//     var exp = new Date();  
//     exp.setTime(exp.getTime() + 60 * 60 * 1000);  
//     document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";  
// }
// setCookie("Admin-Token","123456");
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return '';
}
var postToken=getCookie("Admin-Token");
var userId=getCookie("Admin-DEP-ID");
if(userId==""||userId==null||userId=="undefined"){
    userId="330700";
}
// if(postToken==""||postToken==null||postToken==undefined){
//     layer.msg("登录失效，请重新登录",{time:2000})
//     window.location.href='/';
// }else{
//     this.token=postToken;
// }
/**
 * @区县轮廓
 */
var areaListArray=[
    {id:"330702",name:"婺城区",lat:"119.65",lng:"29.08"},
    {id:"330703",name:"金东区",lat:"119.70",lng:"29.08"},
    {id:"330781",name:"兰溪市",lat:"119.45",lng:"29.22"},
    {id:"330782",name:"义乌市",lat:"120.07",lng:"29.30"},
    {id:"330783",name:"东阳市",lat:"120.23",lng:"29.28"},
    {id:"330784",name:"永康市",lat:"120.03",lng:"28.90"},
    {id:"330726",name:"浦江县",lat:"119.88",lng:"29.45"},
    {id:"330723",name:"武义县",lat:"119.82",lng:"28.90"},
    {id:"330727",name:"磐安县",lat:"120.43",lng:"29.05"}
];
console.log(postToken,userId)