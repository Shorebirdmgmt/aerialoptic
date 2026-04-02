/* Aerial Optic — Project Gallery Lightbox */
(function() {
  // Create lightbox DOM
  var overlay = document.createElement('div');
  overlay.id = 'ao-lightbox';
  overlay.innerHTML =
    '<div class="ao-lb-backdrop"></div>' +
    '<div class="ao-lb-content">' +
      '<button class="ao-lb-close">&times;</button>' +
      '<img class="ao-lb-img" src="" alt="">' +
      '<p class="ao-lb-caption"></p>' +
    '</div>';
  document.body.appendChild(overlay);

  var backdrop = overlay.querySelector('.ao-lb-backdrop');
  var content = overlay.querySelector('.ao-lb-content');
  var img = overlay.querySelector('.ao-lb-img');
  var caption = overlay.querySelector('.ao-lb-caption');
  var closeBtn = overlay.querySelector('.ao-lb-close');

  function openLightbox(src, alt, captionText) {
    img.src = src;
    img.alt = alt;
    caption.textContent = captionText || alt;
    overlay.classList.add('ao-lb-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('ao-lb-active');
    document.body.style.overflow = '';
    img.src = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  // ESC key closes
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Bind to all gallery images
  var galleryItems = document.querySelectorAll('.ao-gallery-item');
  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var imgEl = this.querySelector('img');
      var captionEl = this.parentElement.querySelector('.ao-gallery-caption');
      openLightbox(imgEl.src, imgEl.alt, captionEl ? captionEl.textContent : imgEl.alt);
    });
  });
})();
