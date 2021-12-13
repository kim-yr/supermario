const main = $("#main #itemList");
let itemSlider = null;
let itemTweener = null;
loadJson("../data/mario.json");
function loadJson(jasonFile) {
  $.ajax({
    url: jasonFile,
    success: function (res) {
      const viewItem = res.items;
      let output = "";
      $.each(viewItem, function (idx, item) {
        // console.log(item.img);
        output += `
        <li class="swiper-slide" id="section" style="${item.bg}">
          <div class="imgBox"><img src="${item.img}" alt=""></div>
          <div class="info">
            <h2 class="title">${item.title}</h2>
            <p class="desc">${item.desc}</p>
            <a href="${item.link}" class="more" target="${item.target}">MORE</a>
          </div>
        </li>
          `;
      });
      main.html(output);
      if (itemSlider !== null) {
        itemSlider.destroy();
      }
      itemSlider = new Swiper("#main", {
        slidesPerView: "auto",
        loop: true,
        effect: "coverflow",
        centeredSlides: true,
        hideOnClick: false,
        coverflowEffect: {
          rotate: -10,
          slideShadows: false,
          depth: 1000,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        mousewheel: true,
      });
      //{}안에 css속성, margin-left: 300 -> marginLeft: 300, 전용 문법 있으니 확인
      //   gsap.to("#itemList li .imgBox", {
      //     x: -100,
      //     y: -50,
      //     duration: Math.random() + 0.5,
      //     onComplete: function () {
      //       gsap.to("#itemList li .imgBox", {
      //         x: 200,
      //         y: 50,
      //         duration: Math.random() + 0.5,
      //         onComplete: function () {},
      //       });
      //     },
      //   });
      if (itemTweener != null) {
        itemTweener.kill();
        itemTweener = null;
      }
      moveMario("#itemList .swiper-slide-active .imgBox");
    },
  });
}
function moveMario(moveItem) {
  itemTweener = gsap.to(moveItem, {
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    duration: Math.random() + 0.5,
    onComplete: moveMario, //끝나는 시점에 재귀함수 호출
    onCompleteParams: [moveItem], //끝나는 시점에 전달되는 매개변수도 이렇게 써야 함
  });
}
moveMario();

const gnbList = $("#gnb li");
gnbList.on("click", function (e) {
  e.preventDefault();
  const jsonFile = $(this).data("json");
  if ($(this).hasClass("selected")) return;
  $(this).addClass("selected").siblings("li").removeClass("selected");
  loadJson(jsonFile);
});

function factorial(num) {
  if (num < 1) {
    return 1;
  }
  return num * factorial(num - 1);
}
console.log(factorial(5));
