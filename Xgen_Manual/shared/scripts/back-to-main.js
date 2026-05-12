/*
 * back-to-main.js
 * 고객사 매뉴얼 페이지에 "← 전체 매뉴얼" 헤더 링크를 동적으로 주입한다.
 *
 * 동작:
 *   - URL 경로에서 ".../docs/<customer-id>/" 패턴을 찾아 site root를 추정
 *   - site root 아래의 깊이를 계산해 ../를 반복한 상대 경로로 index.html 링크 생성
 *   - file://, HTTP 서버, 서브디렉토리 호스팅 모두에서 동작
 *
 * 매칭이 되지 않는 경우(예: 단일 고객사 mkdocs serve, base 미리보기 serve)에는 링크를 주입하지 않는다.
 */
(function () {
  function init() {
    var pathname = window.location.pathname;
    var match = pathname.match(/^(.*?)\/docs\/[^/]+\//);
    if (!match) return;

    var sitePath = match[1] + '/';
    var afterSite = pathname.substring(sitePath.length);
    var depth = afterSite.split('/').length - 1;
    if (depth < 1) return;

    var backUrl = new Array(depth + 1).join('../') + 'index.html';

    var header = document.querySelector('.md-header__inner');
    if (!header) return;

    var link = document.createElement('a');
    link.href = backUrl;
    link.title = '전체 매뉴얼 목록으로';
    link.setAttribute('aria-label', '전체 매뉴얼 목록으로');
    link.className = 'md-header__back-to-main';
    link.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'width:32px',
      'height:32px',
      'margin:0 0.4rem',
      'background:#f4f4f5',
      'border:1px solid #e4e4e7',
      'border-radius:6px',
      'color:#52525b',
      'text-decoration:none',
      'transition:background 0.15s, color 0.15s, border-color 0.15s',
    ].join(';');
    // Material-style home icon (18x18 SVG, currentColor fill)
    link.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' +
      '</svg>';
    link.addEventListener('mouseenter', function () {
      link.style.background = '#eef2ff';
      link.style.color = '#4f46e5';
      link.style.borderColor = '#4f46e5';
    });
    link.addEventListener('mouseleave', function () {
      link.style.background = '#f4f4f5';
      link.style.color = '#52525b';
      link.style.borderColor = '#e4e4e7';
    });

    var title = header.querySelector('.md-header__title');
    if (title && title.parentNode) {
      title.parentNode.insertBefore(link, title.nextSibling);
    } else {
      header.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
