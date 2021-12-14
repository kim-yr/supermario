const mainUL = $("#main #itemList");
const lnbUL = $("#main #lnb");
let itemSlider = null;
let itemTweener = null;
let total = 0;
const zAmount = 5000;
const wheelStep = zAmount / 10;
let _z = 0;

loadJson("../data/mario.json");
function loadJson(jasonFile) {
  $.ajax({
    url: jasonFile,
    success: function (res) {
      const viewItem = res.items;
      let output = "";
      let lnbOutput = "";
      total = viewItem.length;
      _z = 0;
      $.each(viewItem, function (idx, item) {
        // console.log(item.img);
        lnbOutput += `<li>${item.title}</li>`;
        output += `
        <li id="section" style="background: ${item.bg}; transform:translateZ(${-zAmount * idx}px); z-index: ${total - idx} ">
          <div class="imgBox"><img src="${item.img}" alt=""></div>
          <div class="info">
            <h2 class="title">${item.title}</h2>
            <p class="desc">${item.desc}</p>
            <a href="${item.link}" class="more" target="${item.target}">MORE</a>
          </div>
        </li>
          `;
      });
      mainUL.html(output);
      lnbUL.html(lnbOutput);
      // gsap.from("#itemList li", { z: "+=5000", y: -1000, stagger: { from: "end", each: 0.1 } }); //원래 z값에 기호랑 같이 넣을 땐 따옴표 안에 넣으면 됨
      $("#lnb li").eq(0).addClass("on");
    },
    error: function (err) {
      // console.log(err);
      alert(err.statusText);
      location.href = "error.html"; //자바스크립트로 페이지 이동할 때
    },
  });
}
//ajax비동기
const gnbList = $("#gnb li");
gnbList.on("click", function (e) {
  e.preventDefault();
  const jsonFile = $(this).data("json");
  if ($(this).hasClass("selected")) return;
  $(this).addClass("selected").siblings("li").removeClass("selected");
  loadJson(jsonFile);
});

//이벤트 위임, event delegation
const lnbList = $("#lnb li");
let oldIndex = 0;
$("#lnb").on("click", "li", function (e) {
  // console.log("aaa");
  if ($(this).hasClass("on")) return;
  $(this).addClass("on").siblings("li").removeClass("on");
  _z = zAmount * $(this).index();
  //조건문을 이렇게 줄이다니..!
  const _duration = Math.min(1.5, Math.abs($(this).index() - oldIndex) * 0.5);
  $("#itemList #section").each(function (idx, item) {
    // console.log(idx);
    gsap.to(item, { z: _z - zAmount * idx, duration: _duration });
    // console.log(_duration, "33");
  });
  oldIndex = $(this).index();
});

$(window).on("mousewheel", function (e) {
  const wheel = e.originalEvent.deltaY;
  if (wheel > 0) {
    // console.log("아래");
    _z += wheelStep;
    if (_z > zAmount * (total - 1)) {
      _z = zAmount * (total - 1);
      return;
    }
  } else {
    // console.log("위");
    _z -= wheelStep;
    if (_z < 0) {
      _z = 0;
      return;
    }
  }
  // console.log(_z);
  $("#itemList #section").each(function (idx, item) {
    // console.log(idx);
    gsap.to(item, { z: _z - zAmount * idx });
  });
  const lnbSelected = Math.floor(_z / zAmount);
  $("#lnb li").eq(lnbSelected).addClass("on").siblings("li").removeClass("on");
});
