interface JQuery {
    visible: () => void;
}

$(document).ready(function() {
    $.fn.visible = function() {
        var viewTop = $(window).scrollTop();
        var viewBottom = $(window).height() + viewTop;
        var _top = $(this).offset().top;
        var _bottom = $(this).height() + _top;
        return _top <= viewBottom && _bottom >= viewTop;
      };

      $(window).scroll(function () {
        if ($(document.documentElement).scrollTop() > 100) {
            $('.header_top').addClass('header_top__visible nav-animate');
        } else {
            $('.header_top').removeClass('header_top__visible nav-animate');
        }
    
        $('.sliding_text').each(function() {
            var el = $(this);
            if (el.visible()) {
              el.addClass('sliding_text-animate');
            //   el.addClass('sliding_right-animate');
            }
          });

          $('.sliding_text-alt').each(function() {
            var el = $(this);
            if (el.visible()) {
              el.addClass('sliding_text-animate-right');
            //   el.addClass('sliding_right-animate');
            }
          });
    });
})

// function c1_text(obj){
//     var inner = obj.parentNode.getElementsByTagName("div");
// }

// $('.fc_creator .img').each(function() {
//     $(this).hover(function() {
//       var attr = $(this).attr('alt');
//       $(attr).removeClass('show');
//     })
//   });
