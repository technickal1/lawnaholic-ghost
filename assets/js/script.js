//****************************************
// Website scripts
//****************************************

// Event DOM ready
var callback = function(){

  // ========================================
  // fitvids
  // ========================================
  fitvids();

  // ========================================
  // Lazy load images
  // ========================================
  lazyLoad = newLazyLoad();

  // ========================================
  // Modify scroll icon
  // ========================================
  const scrollTop = document.querySelector('.scroll-top');

  if (scrollTop && config.scroll_to_top) {
    const progressPath = document.querySelector('.scroll-top path');
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
    const updateProgress = () => {
      const scroll = window.scrollY || window.scrollTop || document.documentElement.scrollTop;
  
      const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
  
      const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
      const height = docHeight - windowHeight;
      var progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    }
  
    updateProgress();
    const offset = 50;
  
    if (scrollTop) {
      scrollTop.onclick = (evt) => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        // scrollToTop();
      }
    }
      
    window.addEventListener('scroll', (event) => {
      updateProgress();
      
      //Scroll back to top
      const scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName('html')[0].scrollTop;
      scrollPos > offset ? addClass('.scroll-top', 'active-progress') : removeClass('.scroll-top', 'active-progress');
    
    }, false);
  }

  // ========================================
  // Set Header position from config
  // ========================================
  const header = document.querySelector('.header');
  if (header) {
    switch(config.header_position) {
      case 'initial':
        break;
      case 'sticky':
        header.classList.add('is-sticky');
        document.body.setAttribute('data-header-position', 'sticky')
        break;
      case 'fixed':
        header.classList.add('is-fixed');
        document.body.setAttribute('data-header-position', 'fixed')
        break;
      default:
        break;
    }
  }

  // ========================================
  // Notification handling 
  // ========================================
  const notifications = document.querySelectorAll('.js-notify-close');

  if (notifications) {
    notifications.forEach((el) => {
      el.onclick = (evt) => {
        closeNotification(el);
      }
    });
  }

  // ========================================
  // User Menu on hover
  // ========================================
  const userBtn = document.querySelector('.js-user');

  if (userBtn) {
    userBtn.onmouseover = (evt) => {
      addClass('.js-user-menu', 'is-active');
    };
  
    userBtn.onmouseout = (evt) => {
      setTimeout(() => {
        removeClass('.js-user-menu', 'is-active');
      }, 1000);
    };
  }

  // ========================================
  // Members Scripts
  // ========================================
  // Give the parameter a variable name
  const action = getParameterByName('action');
  const stripe = getParameterByName('stripe');

  switch (action) {
    case 'subscribe':
      // addClass('body', 'subscribe-success');
        document.body.classList.add('subscribe-success')
      break;
    case 'signup': 
      window.location = '/signup/?action=checkout';
      break;
    case 'checkout':
      // addClass('body', 'signup-success');
      // addClass('form[data-members-form]', 'success');
      document.body.classList.add('signup-success');
      break;
    case 'signin':
      // addClass('body', 'signin-success');
      // addClass('form[data-members-form]', 'success');
      document.body.classList.add('signin-success');
      break;
    default:
      break;
  }

  if (stripe == 'success') {
    // addClass('body', 'checkout-success');
    document.body.classList.add('checkout-success');
  }

  // =======================================
  // Load More Posts handling
  // =======================================
  const loadMoreBtn = document.querySelector('.js-load-more');

  if (loadMoreBtn && global.max_pages === 1) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add('btn--disabled');
  }

  if (loadMoreBtn) {
    loadMoreBtn.onclick = () => {
      loadMorePosts(loadMoreBtn);
    }
  }

  // =======================================
  // Key press event handling
  // =======================================
  window.onkeydown = (evt) => {
    const sourceClass = evt.srcElement.className;

    switch(evt.key) {
      case 'Escape':
        removeClass('.menu', 'is-active');
        removeClass('.search', 'is-active');
        document.body.style.overflowY = 'auto'; 
        break;
      default:
        break;// nothing to do
    }
  }

  // ========================================
  // Menu actions
  // ========================================
  const menuOpen = document.querySelector('.js-menu-open');
  const menuClose = document.querySelector('.js-menu-close');

  if (menuOpen && menuClose) {
    menuOpen.onclick = () => {
      addClass('.menu', 'is-active');
    }

    menuClose.onclick = () => {
      removeClass('.menu', 'is-active');
    }
  }
  
  // ========================================
  // Search actions
  // ========================================
  const searchOpen = document.querySelector('.js-search-open');
  const searchClose = document.querySelector('.js-search-close');
  const searchForm = document.querySelector('.js-search-form');
  const searchField = document.querySelector('#ghost-search-field');
  const searchByTags = document.querySelectorAll('.js-search-tag');

  if (searchOpen && searchClose) {
    searchOpen.onclick = () => {
      addClass('.search', 'is-active');
      document.body.style.overflowY = 'hidden';
      searchField.focus();
    };

    searchClose.onclick = () => {
      removeClass('.search', 'is-active');
      document.body.style.overflowY = 'auto';
    };
  }

  if ( searchField && searchForm ) {
    searchField.onfocus = () => {
      addClass('.search__form', 'focused');
    };
  
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    }, false);
  
    searchField.onblur = () => {
      removeClass('.search__form', 'focused');
    };
  }

  if ( searchByTags ) {
    searchByTags.forEach((el) => {
      el.onclick = (evt) => {
        searchField.value = evt.srcElement.innerText;
        searchField.dispatchEvent(new Event('keyup'));
      }
    });
  }

  // ========================================
  // Site search
  // ========================================
  let ghostSearch = new GhostSearch({
    key: config.ghost_key,
    url: config.ghost_url,
    version: 'v3',
    // button: '#search-button',
    template: function(result) {
      let postImage = '';
      
      const date = new Date(result.published_at);

      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

      const modifiedDate = `${da} ${mo} ${ye}`;

      result.feature_image ? postImage = `<img class='search-result__image' src='${result.feature_image}'/>` : '';
      return  `<a href='/${result.slug}' class='search-result__post animate fade-in-up border'>
                <div class='search-result__content'>
                  <h5 class='search-result__title'>${result.title}</h5>
                  <p class='search-result__date'>${modifiedDate}</p>
                </div>
                ${postImage}
              </a>`;
    },
    trigger: 'focus',
    options: {
      keys: ['title', 'tags.0.name']
    },
    api: {
      resource: 'posts',
      parameters: {
          limit: 'all',
          fields: ['title', 'slug', 'published_at', 'feature_image'],
          filter: '',
          include: 'tags',
          order: '',
          formats: '',
      },
    }
  });

  // ========================================
  // Post Table of Contents
  // ========================================
  const postToc = document.querySelector('.post-with-toc');

  if (postToc) {
    const tocToggle = document.querySelector('.js-toc-toggle');

    if (tocToggle) {
      tocToggle.onclick = (evt) => {
        toggleClass('.js-toc', 'is-active');
        toggleClass('.js-toc-icon', 'is-rotated');
      }
    }

    tocbot.init({
      // Where to render the table of contents.
      tocSelector: '.js-toc',
      // Where to grab the headings to build the table of contents.
      contentSelector: '.js-toc-content',
      // Which headings to grab inside of the contentSelector element.
      headingSelector: 'h1, h2, h3',
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
    });
  }

  // ========================================
  // Image Gallery & Lightbox
  // ========================================
  const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');
  const galleryImages = document.querySelectorAll('.kg-gallery-image img');

  // Gallery style
  galleryImages.forEach(function (image) {
    image.setAttribute('alt', 'Gallery Image');
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = `${ratio} 1 0%`;
  })

  // Lighbox function
  images.forEach(function (image) {
    if (config.image_lightbox) {
      var wrapper = document.createElement('a');
      wrapper.setAttribute('data-no-swup', '');
      wrapper.setAttribute('data-fslightbox', '');
      wrapper.setAttribute('href', image.src);
      wrapper.setAttribute('aria-label', 'Click for Lightbox');
      image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
      wrapper.appendChild(image);
    }
    image.setAttribute('class', 'lazyload lazy');
    updateLazyLoad(lazyLoad);
  });

  refreshFsLightbox();

  // ========================================
  // Tag accent color contrast
  // ========================================
  updateTagColor();

  // ========================================
  // Read next page link
  // ========================================
  const nextPage = document.querySelector('link[rel=next]');
  if (nextPage) {
    global.pagination_next_page_link = nextPage.getAttribute('href')
  } else {
    // if last page disable button
    if (global.pagination_current_page === global.pagination_max_pages) {
      const loadMore = document.querySelector('.js-load-more')
      loadMore.disabled = true;
      loadMore.classList.add('btn--disabled');
    }
  }
};

if (
    document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener('DOMContentLoaded', callback);
}


// ========================================
// Dark/Light toggle function
// ========================================
const toggleTheme = () => {
  const currentTheme =  document.documentElement.getAttribute('data-color-scheme');
  currentTheme === 'light' ? setTheme('dark') : setTheme('light');
}

// Dark/Light mode function
const setTheme = (sTheme) => {
  document.documentElement.setAttribute('data-color-scheme', sTheme);
  localStorage.setItem('USER_COLOR_SCHEME', sTheme);
}

// ========================================
// Grid/List view handling
// ========================================
const toggleView = () => {
  const currentView =  document.documentElement.getAttribute('data-view-type');
  currentView === 'grid' ? setView('list') : setView('grid');
}

const setView = (sView) => {
  document.documentElement.setAttribute('data-view-type', sView);
  localStorage.setItem('USER_VIEW_TYPE', sView);
}

// ========================================
// Class modifying helepers
// ========================================
const toggleClass = (el, cls) => {
  document.querySelector(el).classList.toggle(cls);
}

const addClass = (el, cls) => {
  document.querySelector(el).classList.add(cls);
}

const removeClass = (el, cls) => {
  document.querySelector(el).classList.remove(cls);
}

// ========================================
// Scroll to function
// ========================================
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

// ========================================
// Check if element is in viewport
// ========================================
function isInViewport(el) {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  let width = el.offsetWidth;
  let height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return(
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

// ========================================
// Lazyload function
// ========================================
function newLazyLoad() {
  return new LazyLoad({
    elements_selector: '.lazyload',
    class_loading: 'loading',
    class_loaded: 'loaded',
    treshold: 100,
    // use_native: true,
    callback_enter: function(el) {
      el.classList.add('loading');
    },
    callback_set: function(el) {
      el.classList.remove('loading');
      el.classList.add('loaded');
    }
  });
}

function updateLazyLoad(lazyLoad) {
  lazyLoad.update();
}

// ========================================
// Close popup
// ========================================
const closeNotification = (el) => {
  el.classList.add('is-closed');
}

// ========================================
// Copy to clipboard
// ========================================
const copyToClipboard = (src, str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  src.classList.add('has-tooltip');
  src.setAttribute('data-label', 'Copied!');

  src.onmouseleave = () => { 
    src.classList.remove('has-tooltip');
    setTimeout(function(){
      src.setAttribute('data-label', '');
    }, 500); 
  }
};

// ========================================
// Load More Posts
// ========================================
const loadMorePosts = (button) => {
  // Update current page value
  if (global.pagination_next_page_link && global.pagination_next_page <= global.pagination_max_pages) {
    button.classList.add('is-loading');

    const fetchLink = global.pagination_next_page_link

    // Fetch next page content
    fetch(fetchLink).then(function (response) {
      // Fetch Successfull
      return response.text();
    }).then(function (html) {
      // Convert the HTML string into a document object
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      
      // Get posts
      const posts = doc.querySelectorAll('.post-card');
      const postContainer  = document.querySelector('.post-container');
      
      // featured icon
      const starSVG = `<svg id="star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
      
      // Add each post to the page
      posts.forEach(post => {
        // set featured icon (shadow root doesn't work)
        const featured = post.classList.value.search('featured') > -1 ? true : false;
        if (featured) {
          post.querySelector('.icon__svg').innerHTML = starSVG;
        }

        // append the post
        postContainer.appendChild(post);
      })
      
      // Update lazyload for images
      updateLazyLoad(lazyLoad);

      // Update tag colors
      updateTagColor();

      // Disable button on last page
      if (global.pagination_next_page === global.pagination_max_pages) {
        button.disabled = true;
        button.classList.add('btn--disabled');
      }

      // Update next page number
      global.pagination_next_page = global.pagination_next_page + 1
      global.pagination_next_page_link = `${global.pagination_next_page_link.slice(0, -2)}${global.pagination_next_page}/`

      button.classList.remove('is-loading');
    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  } 
  else {
    // No more pages, disable button
    button.disabled = true;
    button.classList.add('btn--disabled');
  }
}

// ========================================
// Update Post Cards
// ========================================
const updateTagColor = () => {
  const postCards = document.querySelectorAll('.post-card[data-tag-color]');
  postCards.forEach(postCard => {
    var color = postCard.getAttribute('data-tag-color');
    var contrast = getContrast(color);
    var tag = postCard.querySelector('.post-card__tag');
    if (tag) {
      tag.style.color = contrast;
    }
  })
}

// ========================================
// Color Contrast 
// ========================================
const getContrast = (hexcolor) => {
	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}

	// If a three-character hexcode, make six-character
	if (hexcolor.length === 3) {
		hexcolor = hexcolor.split('').map(function (hex) {
			return hex + hex;
		}).join('');
	}

	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);

	// Get YIQ ratio
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? 'black' : 'white';
};

// ========================================
// Members Parse the URL parameter
// ========================================
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
