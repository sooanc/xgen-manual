// toc-active-default.js
// MkDocs Material 9.x scrollspy의 두 가지 문제를 보정:
//
// (1) 초기 로드 시 active 항목 부재 — Material은 사용자가 스크롤하기 전까지
//     어떤 TOC 항목에도 .md-nav__link--active를 부여하지 않는다. 짧은 페이지에서
//     우연히 active가 보이고 긴 페이지에서는 빈 상태가 되는 비일관성을 만든다.
//
// (2) 클릭 시 off-by-one — 사용자가 TOC 항목 N을 클릭하면 브라우저가 #anchor로
//     스크롤하고 Material scrollspy는 "viewport 상단을 막 지나친 헤딩"을 active로
//     잡는데, 이는 클릭한 헤딩 바로 직전 항목(N-1)인 경우가 많다.
//
// 해결:
//   - 페이지 로드 시 active 없으면 첫 항목에 부여
//   - TOC 링크 클릭 시 그 항목을 active로 즉시 설정 + 잠시 동안 Material의
//     덮어쓰기를 막기 위해 짧은 lock window 안에서 active를 유지한다.

(function () {
  var TOC_SELECTOR =
    '.md-sidebar--secondary .md-nav__list[data-md-component="toc"]';
  var LOCK_MS = 900; // 클릭 후 scrollspy 덮어쓰기 방어 시간

  function tocLinks() {
    var toc = document.querySelector(TOC_SELECTOR);
    return toc ? toc.querySelectorAll('.md-nav__link') : [];
  }

  function setOnlyActive(target) {
    var links = tocLinks();
    for (var i = 0; i < links.length; i++) {
      if (links[i] === target) links[i].classList.add('md-nav__link--active');
      else links[i].classList.remove('md-nav__link--active');
    }
  }

  function ensureFirstActive() {
    var links = tocLinks();
    if (links.length === 0) return;
    for (var i = 0; i < links.length; i++) {
      if (links[i].classList.contains('md-nav__link--active')) return;
    }
    links[0].classList.add('md-nav__link--active');
  }

  function attachClickHandlers() {
    var links = tocLinks();
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (link.__tocActiveBound) return;
        link.__tocActiveBound = true;
        link.addEventListener('click', function () {
          setOnlyActive(link);
          // 부드러운 스크롤 + Material scrollspy 의 후속 업데이트를 짧은 시간 무시
          var until = Date.now() + LOCK_MS;
          var iv = setInterval(function () {
            if (Date.now() > until) {
              clearInterval(iv);
              return;
            }
            if (!link.classList.contains('md-nav__link--active')) {
              setOnlyActive(link);
            }
          }, 40);
        });
      })(links[i]);
    }
  }

  function init() {
    ensureFirstActive();
    attachClickHandlers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', function () {
    setTimeout(init, 50);
  });
})();
