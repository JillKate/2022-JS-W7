let data = [];

/* Week 6 程式碼開始 */
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (res) {
        data = res.data.data;
        init();
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

/* Week 6 程式碼結束 */

/*** 套票卡片區開始 ***/
const ticketCardArea = document.querySelector('.ticketCard-area');
const searchResultText = document.querySelector('#searchResult-text');

/* 渲染卡片功能 */
function render(data) {
    // 宣告字串變數
    let str = '';
    // 跑 forEach 組成完整字串內容
    data.forEach(function (obj) {
        str += `
        <li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${obj.imgUrl}"
                        alt="">
                </a>
                <div class="ticketCard-region">${obj.area}</div>
                <div class="ticketCard-rank">${obj.rate}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${obj.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                    ${obj.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${obj.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${obj.price}</span>
                    </p>
                </div>
            </div>
        </li>
        `
    });
    // 寫入完成的字串及筆數
    ticketCardArea.innerHTML = str;
    searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
};

/* 篩選特定卡片功能 */
// 欲監聽的 DOM
const searchArea = document.querySelector('.search-area');

// 加入 change 監聽事件
searchArea.addEventListener('change', function (e) {
    const area = e.target.value;

    if (!area) {
        render(data);
    } else {
        const matchData = data.filter(item => item.area === area);
        render(matchData);
    };
});

/*** 套票卡片區結束 ***/

/*** 新增卡片開始 ***/

// 欲監聽的 DOM
const addTicketBtn = document.querySelector('.addTicket-btn')
// 加入 click 監聽事件
addTicketBtn.addEventListener('click', function (e) {

    const newData = {
        "id": data.length,
        "name": document.querySelector('#ticketName').value,
        "imgUrl": document.querySelector('#ticketImgUrl').value,
        "area": document.querySelector('#ticketRegion').value,
        "description": document.querySelector('#ticketDescription').value,
        "group": parseInt(document.querySelector('#ticketNum').value),
        "price": parseInt(document.querySelector('#ticketPrice').value),
        "rate": parseInt(document.querySelector('#ticketRate').value)
    };

    /* 防呆條件設定開始 */
    const mustNotice = `
        <i class="fas fa-exclamation-circle"></i>
        <span>必填!</span>
    `;
    let isVailable = true;

    if (!newData.name) {
        document.querySelector('#ticketName-message').innerHTML = `${mustNotice}`;
        isVailable = false;
    };
    if (!newData.imgUrl) {
        document.querySelector('#ticketImgUrl-message').innerHTML = `${mustNotice}`;
        isVailable = false;
    };
    if (!newData.area) {
        document.querySelector('#ticketRegion-message').innerHTML = `${mustNotice}`;
        isVailable = false;
    };
    if (!newData.price) {
        document.querySelector('#ticketPrice-message').innerHTML = `${mustNotice}`;
        isVailable = false;
        if (newData.price <= 0) {
            document.querySelector('#ticketPrice-message').innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>需大於零!</span>
            `
        };
    };
    if (!newData.group) {
        document.querySelector('#ticketNum-message').innerHTML = `${mustNotice}`;
        isVailable = false;
        if (newData.group <= 0) {
            document.querySelector('#ticketNum-message').innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>需大於零!</span>
            `
        };
    };
    if (!newData.rate) {
        document.querySelector('#ticketRate-message').innerHTML = `${mustNotice}`;
        isVailable = false;
        if (newData.rate < 1 || newData.rate > 10) {
            document.querySelector('#ticketRate-message').innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>星級區間是 1-10 分</span>
            `
        };
    };
    if (!newData.description) {
        document.querySelector('#ticketDescription-message').innerHTML = `${mustNotice}`;
        isVailable = false;
    };
    /* 防呆條件設定結束 */

    /* 條件達成將資料新增至陣列、重新渲染、清空表單資料 */
    if (isVailable) {
        const addTicketForm = document.querySelector('.addTicket-form');
        data.push(newData);
        init();
        addTicketForm.reset();
    };

});

/*** 新增卡片結束 ***/

/* Week 7 程式碼開始 */
function renderC3(data) {
    let areaNum = {};
    let areaArray = [];
    let c3Data = [];

    data.forEach(function (item) {
        if (!areaNum[item.area]) {
            areaNum[item.area] = 1;
            areaArray.push(item.area)
        } else {
            areaNum[item.area] += 1;
        };
    });

    areaArray.forEach(area => {
        let arr = [];
        arr.push(area);
        arr.push(areaNum[area])
        c3Data.push(arr)
    });

    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            columns: c3Data, // 資料存放
            type: 'donut',
            colors: {
                高雄: "#E68618",
                台北: "#26C0C7",
                台中: "#5151D3"
            }
        },
        donut: {
            title: "套票地區比重",
            label: {
                show: false
            },
            width: 10
        },
        size: {
            width: 160,
            height: 160
        }
    });
};

/* Week 7 程式碼結束 */

// 初始化
function init() {
    render(data);
    renderC3(data)
};