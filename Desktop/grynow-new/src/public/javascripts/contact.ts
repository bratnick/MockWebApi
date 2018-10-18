$(document).ready(function() {
  $('.nav_link').each(function() {
    if (
      $(this)
        .children('a')
        .attr('href') === '/contact'
    ) {
      $(this).removeClass('nav_link');
      $(this).addClass('link_active');
    }
  });

  $('.more-da').click(function() {
    $('html, body').animate(
      {
        scrollTop: $('.section-inquiry').offset().top - 60
      },
      1000
    );
  });

  $(window).scroll(function() {
    if ($(document.documentElement).scrollTop() > 100) {
      $('.header_top').addClass('header_top__visible nav-animate');
      $('.link_active').addClass('link_active__visible');
    } else {
      $('.header_top').removeClass('header_top__visible nav-animate');
      $('.link_active').removeClass('link_active__visible');
    }
  });
});
