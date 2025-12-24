
let serverlist_img_1 = "./res/serverlist/泰式古法.png";
let serverlist_img_2 = "./res/serverlist/精油开背.png";
let serverlist_img_3 = "./res/serverlist/全身精油SPA.png";
let serverlist_img_4 = "./res/serverlist/精油SPA加热炙.png";
let serverlist_img_5 = "./res/serverlist/特殊服务.png";
const svg_user = `
<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#B7B7B7"><path d="M226-262q59-42.33 121.33-65.5 62.34-23.17 132.67-23.17 70.33 0 133 23.17T734.67-262q41-49.67 59.83-103.67T813.33-480q0-141-96.16-237.17Q621-813.33 480-813.33t-237.17 96.16Q146.67-621 146.67-480q0 60.33 19.16 114.33Q185-311.67 226-262Zm253.88-184.67q-58.21 0-98.05-39.95Q342-526.58 342-584.79t39.96-98.04q39.95-39.84 98.16-39.84 58.21 0 98.05 39.96Q618-642.75 618-584.54t-39.96 98.04q-39.95 39.83-98.16 39.83ZM480.31-80q-82.64 0-155.64-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.51T80-480.18q0-82.82 31.5-155.49 31.5-72.66 85.83-127Q251.67-817 324.51-848.5T480.18-880q82.82 0 155.49 31.5 72.66 31.5 127 85.83Q817-708.33 848.5-635.65 880-562.96 880-480.31q0 82.64-31.5 155.64-31.5 73-85.83 127.34Q708.33-143 635.65-111.5 562.96-80 480.31-80Zm-.31-66.67q54.33 0 105-15.83t97.67-52.17q-47-33.66-98-51.5Q533.67-284 480-284t-104.67 17.83q-51 17.84-98 51.5 47 36.34 97.67 52.17 50.67 15.83 105 15.83Zm0-366.66q31.33 0 51.33-20t20-51.34q0-31.33-20-51.33T480-656q-31.33 0-51.33 20t-20 51.33q0 31.34 20 51.34 20 20 51.33 20Zm0-71.34Zm0 369.34Z"/></svg>
`;
const svg_alipy=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#1097fe" d="M377.7 32L70.3 32C31.4 32 0 63.4 0 102.3L0 409.7C0 448.6 31.4 480 70.3 480l307.5 0c38.5 0 69.8-31.1 70.3-69.6-46-25.6-110.6-60.3-171.6-88.4-32.1 44-84.1 81-148.6 81-70.6 0-93.7-45.3-97-76.4-4-39 14.9-81.5 99.5-81.5 35.4 0 79.4 10.2 127.1 25 16.5-30.1 26.5-60.3 26.5-60.3l-178.2 0 0-16.7 92.1 0 0-31.2-109.4 0 0-19 109.4 0 0-50.4 50.9 0 0 50.4 109.4 0 0 19-109.4 0 0 31.2 88.8 0s-15.2 46.6-38.3 90.9c48.9 16.7 100 36 148.6 52.7l0-234.4c.2-38.7-31.2-70.3-69.9-70.3zM47.3 323c1 20.2 10.2 53.7 69.9 53.7 52.1 0 92.6-39.7 117.9-72.9-44.6-18.7-84.5-31.4-109.4-31.4-67.4 0-79.4 33.1-78.4 50.6z"></path></svg>`;


const CL_productdeposit = 212.04;



const COLOR_maincolor = "#00bfa5";
const home_page="home_frame.html"

const ff_useraddress="useraddress";
const ff_userphone="userphone";
const ff_userLocation="userLocation";




const cc_server_1={title:"泰式古法",count: "超277658人选择",duration:"60分钟",price:219,image:serverlist_img_1,id:1};
const cc_server_2={title:"精油开背",count: "超440438人选择",duration:"80分钟",price:289,image:serverlist_img_2,id:2};
const cc_server_3={title:"全身精油SPA",count: "超353538人选择",duration:"90分钟",price:389,image:serverlist_img_3,id:3};
const cc_server_4={title:"精油SPA+热灸",count: "超194819人选择",duration:"100分钟",price:489,image:serverlist_img_4,id:4};
const cc_server_5={title:"特殊服务",count: "超194819人选择",duration:"30分钟",price:500,image:serverlist_img_5,id:5};

const cc_all_server=[cc_server_1,cc_server_2,cc_server_3,cc_server_4];
const cc_all_server_se=[cc_server_1,cc_server_2,cc_server_3,cc_server_4,cc_server_5];


let jishidata =
    [
        {
            "id": 1,
            "introduce": "您的身体在呼唤疗愈放松，别让它等太久，得闲按一按是对自己最好的搞赏！疲劳会累积、放松要趁早，享受美好时光，期待您的关注与下单",
            "name": "陈美琳",
            "image": "./jishi/1.png",
            "distance": "1.97km",
            "rating": "5.0",
            "orderCount": 645,
            "favoriteCount": "50+",
            "reviewCount": 4760,
            "isFavorite": false
        },
        {
            "id": 2,
            "name": "江素素",
            "image": "./jishi/2.png",
            "introduce": "本人手法专业擅长各种精油SPA,你给我一份信任，我还你一份健康，期待为您服务！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 874,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 5745
        },
        {
            "id": 3,
            "name": "李楠若",
            "image": "./jishi/3.png",
            "introduce": "拥有5年丰富经验的按摩技师，擅长中式推掌及深层肌肉放松技巧。以精湛的手法、细致的服务致力于帮助每一位客人缓解身体疲劳，恢复身心平衡。在轻松愉悦的环境中，小女将为您带来一次难忌的按摩体验。",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 659,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 7183
        },
        {
            "id": 4,
            "name": "陈恋依",
            "image": "./jishi/4.png",
            "introduce": "本人温柔大方，气质高雅，服务热情，技术一流，有多年养生SPA经验，下单选我让您体验最专业，最热情的服务。",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 404,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 1569
        },
        {
            "id": 5,
            "name": "唐娇娇",
            "image": "./jishi/5.png",
            "introduce": "资深SPA技师，擅长运用精油按摩与面部护理技巧，为每一位顾客带来身心的极致放松与焕新体验。手法细腻，服务贴心，致力于在繁忙生活中为您打造一片宁静的绿洲",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 712,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2229
        },
        {
            "id": 6,
            "name": "林听",
            "image": "./jishi/6.png",
            "introduce": "高端养生spa，手法精细，工作认真，体贴，大方，稳重。欢迎您来下单哟··",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 923,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2790
        },
        {
            "id": 7,
            "name": "艾微微",
            "image": "./jishi/7.png",
            "introduce": "本人性格开朗，为人真诚，从事美容美体行业五年以上，擅长精油推掌，泰式按摩，欢迎您来下单！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 684,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2423
        },
        {
            "id": 8,
            "name": "韩语婷",
            "image": "./jishi/8.png",
            "introduce": "本人性格奔放，热情似火，技术一流，最热情的服务，选择我你绝不后悔，专业手法缓解您的疲劳，愿给您带去一份健康，期望与您的相遇！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 594,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 7371
        },
        {
            "id": 9,
            "name": "尹夏沫",
            "image": "./jishi/9.png",
            "introduce": "正规绿色服务从事美容养生行业三年多，性格温柔随和手法专业娴熟。照片视频真实可靠，放心下单颜值技术均在线！感谢您的支持和关注欢迎您的预约！愿我的服务给您带来好心情！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 747,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 7104
        },
        {
            "id": 10,
            "name": "林柒鱼",
            "image": "./jishi/10.png",
            "introduce": "本人性格奔放，热情似火，技术一流，最热情的服务，选我你绝不后悔，专业手法缓解您的疲劳，愿给您带去一份健康，期望与您的相遇！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 825,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 3174
        },
        {
            "id": 11,
            "name": "张丽娜",
            "image": "./jishi/11.png",
            "introduce": "90后小姐姐。性格外向。活波开朗。拥有5年养生经验，专业知识丰富，擅长精油SPA，唱歌，跳舞，打麻将，欢迎各位老板下单预约",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 725,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2254
        },
        {
            "id": 12,
            "name": "李安馨",
            "image": "./jishi/12.png",
            "introduce": "本人从事高端养生spa多年，手法好，技术专业对工作认真负责，性格温柔，体贴，大方，稳重。欢迎您来下单哟",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 284,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 6958
        },
        {
            "id": 13,
            "name": "王绵绵",
            "image": "./jishi/13.png",
            "introduce": "我是一名高级香熏师，手法渗透有力，抚慰您一天的疲惫。您是青灯不归客，我是深夜芳疗师，您刚好需要，我刚好在，感恩与您相遇！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 886,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 1320
        },
        {
            "id": 14,
            "name": "张泌泌",
            "image": "./jishi/14.png",
            "introduce": "本人温柔大方，气质高雅，服务热情，技术一　流，有多年养生SPA经验，下单选我让你体验最专业，最热情的服务。",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 425,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2417
        },
        {
            "id": 15,
            "name": "陈欣",
            "image": "./jishi/15.png",
            "introduce": "提供正规绿色服务!专业基础扎实。手法熟练,按摩力度适中有力道。擅长全身经络推拿和经络SPA。期待您的关注和预约.",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 332,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 7241
        },
        {
            "id": 16,
            "name": "林玉琪",
            "image": "./jishi/16.png",
            "introduce": "本人温柔大方,气质高雅,服务热情,技术一流,有多年养生SPA经验,下单选我让你体验最专业，最热情的服务",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 874,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 4542
        },
        {
            "id": 17,
            "name": "李菲儿",
            "image": "./jishi/17.png",
            "introduce": "开朗又爱笑的小姐姐，温婉大方，柔情似水，能歌善舞！手法高端又专业，照片只是入你眼，手法才能入你心！下单就是主者风范！",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 312,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 7239
        },
        {
            "id": 18,
            "name": "白若溪",
            "image": "./jishi/18.png",
            "introduce": "贵州女孩，性格火辣，敢作敢当，擅长精油spa 选择我您不会后悔的",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 749,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 3981
        },
        {
            "id": 19,
            "name": "向也",
            "image": "./jishi/19.png",
            "introduce": "本人从事高端养生spa多年，手法好，技术专业，对工作认真负责，性格温柔，体贴，大方，稳重。欢迎您来下单哟",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 400,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 2486
        },
        {
            "id": 20,
            "name": "刘星辰",
            "image": "./jishi/20.png",
            "introduce": "嘿，我是一个既专业又带着点小可爱的按摩技师！我可是入“不按套路出牌”的主，但请放心，我的手法绝对靠谱，保证让你笑中带泪，别看我平时嘻嘻哈哈，一到按摩时刻，我可就秒变“认真脸”。中式推拿、泰式、精油spa·…这些对我来说，不过是“小菜一碟”。我的独家秘籍？嘿嘿，那就是把每一次按摩都当作是在给客人写一封“身体情书”，既温柔又精准，直击痛点，让你的每一寸肌肤都感受到爱的呵护。",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 759,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 3100
        },
        {
            "id": 21,
            "name": "黄玉婷",
            "image": "./jishi/21.png",
            "introduce": "本人90后，照片真实性格随和温柔，服务热情工作态度认真负责手法柔软细腻，欢迎下单体验最专业的服务",
            "distance": "1.98km",
            "rating": "5.0",
            "badge": "银牌",
            "orderCount": 714,
            "favoriteCount": 13,
            "tag": "",
            "isFavorite": false,
            "reviewCount": 4199
        }
    ]
    ;

function getRandomDistance(min = 0.5, max = 5) {
    // 生成 min-max 之间的随机浮点数
    const distance = Math.random() * (max - min) + min;
    // 保留两位小数并返回带单位的字符串
    return distance.toFixed(2) + "km";
}



for (let i = 0; i < jishidata.length; i++) {
    jishidata[i].id = i + 1;
    jishidata[i].reviewCount = Math.floor(Math.random() * (143 - 20 + 1)) + 20;
    jishidata[i].orderCount = Math.floor(Math.random() * (333 - 40 + 1)) + 40;
    jishidata[i].favoriteCount = Math.floor(Math.random() * (333 - 40 + 1)) + 40;
    jishidata[i].rating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;



    jishidata[i].distance = getRandomDistance();



    jishidata[i].tag = "";

    let cc = i + 1;
    jishidata[i].image = "./jishi/" + cc + ".png"
}

// console.log(JSON.stringify(jishidata, null, 2));


jishidata = jishidata.slice(0, 11);


jishidata[0].reviewCount = 455;
jishidata[0].orderCount = 200;
jishidata[0].favoriteCount = 777;
jishidata[0].rating = 5




function getJiShiInfo(id) {
    for (let i = 0; i < jishidata.length; i++) {
        if (jishidata[i].id == id) {
            return jishidata[i];
        }
    }
    return null;
}



function getServerInfo(id) {
    for (let i = 0; i < cc_all_server_se.length; i++) {
        if (cc_all_server_se[i].id == id) {
            return cc_all_server_se[i];
        }
    }
    return null;
}














// 1. 服务地址图标 - 地图定位标记
const svg_address = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
`;

// 2. 技师招募图标 - 添加用户/招聘
const svg_recruit = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="8.5" cy="7" r="4"/>
  <line x1="20" y1="8" x2="20" y2="14"/>
  <line x1="23" y1="11" x2="17" y2="11"/>
</svg>
`;

// 3. 退出登录图标 - 登出箭头
const svg_logout = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
  <polyline points="16 17 21 12 16 7"/>
  <line x1="21" y1="12" x2="9" y2="12"/>
</svg>
`;

// 4. 客服图标 - 耳机
const svg_service = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
</svg>
`;

// 5. 投诉举报图标 - 警告标志
const svg_report = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
  <line x1="12" y1="9" x2="12" y2="13"/>
  <line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>
`;

// 6. 设置图标 - 齿轮
const svg_settings = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
  <path d="M19.07 4.93l-4.24 4.24M9.17 14.83l-4.24 4.24M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24"/>
</svg>
`;

// 7. 订单图标 - 文件列表
const svg_order = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="9" y1="13" x2="15" y2="13"/>
  <line x1="9" y1="17" x2="15" y2="17"/>
</svg>
`;

// 8. 钱包图标 - 钱包
const svg_wallet = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
</svg>
`;