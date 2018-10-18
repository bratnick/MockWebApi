/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

interface JQuery {
  visible: () => void;
}

$(document).ready(function() {
  $('.composition__photo').hover(function() {
    var alt = $(this).attr('alt');
    $('.composition__photo')
      .not(this)
      .each(function() {
        if ($(this).attr('alt') === alt) $(this).toggleClass('notHoverPhoto');
      });
  });

  $.fn.visible = function() {
    var viewTop = $(window).scrollTop();
    var viewBottom = $(window).height() + viewTop;
    var _top = $(this).offset().top;
    var _bottom = $(this).height() + _top;
    return _top <= viewBottom && _bottom >= viewTop;
  };

  $(window).scroll(function() {
    if ($(document.documentElement).scrollTop() > 100) {
      $('.header_top').addClass('header_top__visible nav-animate');
    } else {
      $('.header_top').removeClass('header_top__visible nav-animate');
    }

    $('.info-content').each(function() {
      var el = $(this);
      if (el.visible()) {
        el.find('.info-abt').addClass('conFadeInLeft');
        el.find('.info-pics__photo--p2').addClass('fadeIn');
        el.find('.info-pics__photo--p1').addClass('picFadeInLeft');
        el.find('.info-abt__alt').addClass('conFadeInRight');
        el.find('.info-pics__photo--p1-alt').addClass('picFadeInRight');
      }
    });

    $('.count').each(function() {
      var el = $(this);
      if (el.visible() && el.attr('firstTime') == '0') {
        el.prop('Counter', 0).animate(
          {
            Counter: el.text()
          },
          {
            duration: 1000,
            easing: 'swing',
            step: function(now: number) {
              el.text(Math.ceil(now));
            },
            complete: function() {
              el.text('+' + el.attr('data-count'));
            }
          }
        );
        el.attr('firstTime', '1');
      }
    });
  });
});
