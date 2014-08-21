/* jshint camelcase: false */
/* global FastClick */

var ProAppBetaSite = (function() {
    'use strict';

    var $pageWindow = $('#pages-container'),
        page,
        device,
        timer;

    function init() {
        page = getPath();
        device = getDevice();
        FastClick.attach(document.body);
        bindEvents();
        showPage(page);
    }

    function getPath() {
        return window.location.pathname.split('/').pop().replace(/[^a-z0-9\s]/gi, '');
    }

    function getDevice() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
      {
        return 'iOS';
      }
      else if( userAgent.match( /Android/i ) )
      {
        return 'Android';
      }
      else
      {
        return 'unknown';
      }
    }

    function bindEvents() {
        // enable back button via HTML5 pop state
        $(window).on('popstate', function(ev) {
            ev.preventDefault();
            var path = getPath();
            showPage(path);
        });

        $('.install-apperian').on('click', function(){
            showPage('download-android');
        });

        // disable all transitions when window is being resized
        $(window).on('resize', debounce(function() {
            clearInterval(timer);
            $('body').addClass('no-transitions');
            timer = setTimeout(function() {
                $('body').removeClass('no-transitions');
            }, 1000);
        }, 0));
    }

    function showPage(page) {

        if (page === '') { page = 'home'; }

        var pageContainer = $( '#page-' + page);

        // underline nav link
        $('.' + page).addClass('active').siblings().removeClass('active');

        // check if page already loaded, else go load it first
        if($('#page-' + page).length){
            pageContainer.removeClass().addClass('is-visible');
            pageContainer.siblings().removeClass().addClass('is-hidden');

            // set body class
            if (page === 'home') {
                $('body').removeClass().addClass('home');
                bindEvents();

            } else {
                // init general subpage
                $('body').removeClass().addClass(page + ' subpage');
            }
            // page doesn't exist yet so let's go load it
        } else{
            loadPage(page);
        }
    }

    function loadPage(page) {
        // path to html
        var pageHtml = ('/pages/' + page + '.html');

        // create page container
        var pageContainer = $( '<div id=page-' + page + ' class="is-hidden" />');
        $pageWindow.append(pageContainer);

        // load & append html into unique page container
        pageContainer.load(pageHtml, function(response, status) {
            if (status === 'error') {
                pageContainer.remove();
                showPage('error');
            } else{
                showPage(page);
            }
            pageContainer.find('p').unorphanize(1);
        });
    }

    function debounce(func, timer) {
        var timeoutID;
        return function() {
            var scope = this,
                args = arguments;
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function() {
                func.apply(scope, Array.prototype.slice.call(args));
            }, timer);
        };
    }
    init();
})();
