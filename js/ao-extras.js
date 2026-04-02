/* Aerial Optic — Instagram carousel + Scroll reveal */
document.addEventListener('DOMContentLoaded', function() {

	// Instagram carousel — CSS-driven continuous scroll
	var instaWrap = document.querySelector('#footer-instagram .swiper-wrapper');
	if (instaWrap) {
		// Remove swiper classes, use pure CSS animation
		var parent = instaWrap.parentElement;
		parent.classList.remove('swiper', 'insta-swiper');
		parent.classList.add('insta-scroll');
		instaWrap.classList.remove('swiper-wrapper');
		instaWrap.classList.add('insta-scroll-track');

		// Remove swiper-slide classes
		var slides = instaWrap.querySelectorAll('.swiper-slide');
		slides.forEach(function(s) {
			s.classList.remove('swiper-slide');
			s.classList.add('insta-scroll-item');
		});

		// Duplicate items for seamless loop
		var clone = instaWrap.innerHTML;
		instaWrap.innerHTML += clone;
	}

	// Scroll reveal
	var srEls = document.querySelectorAll('.sr');
	if (srEls.length) {
		var srObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('sr-visible');
					srObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });
		srEls.forEach(function(el) { srObserver.observe(el); });
	}
});
