/* jshint camelcase: false */
/* global FastClick */

var ProAppBetaSite = (function() {
    'use strict';

    var $pageWindow = $('#pages-container'),
        page,
        device;

    function init() {

        device = getDevice();
        FastClick.attach(document.body);
        bindEvents();

        if(device==='Android'){
            showPage('android');
        }else if(device==='iOS'){
            showPage('ios');
        }else{
            showPage('desktop');
        }
    }

    function getPath() {
        return window.location.pathname.split('/').pop().replace(/[^a-z0-9\s]/gi, '');
    }

    function getDevice() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if( userAgent.match( /Android/i ) )
      {
        return 'Android';
      } else if( userAgent.match( /(iPad|iPhone|iPod)/i ) ){
        return 'iOS';
      } else{
        return 'unknown';
      }
    }

    function bindEvents() {

    }

    function showPage(page) {

        var pageContainer = $( '#page-' + page);

        // underline nav link
        $('.' + page).addClass('active').siblings().removeClass('active');

        // check if page already loaded, else go load it first
        if($('#page-' + page).length){
            pageContainer.removeClass().addClass('is-visible');
            pageContainer.siblings().removeClass().addClass('is-hidden');

            // set body class
            if (page === 'android') {
                $('.install-apperian').click(function(){
                    showPage('download-android');
                });

                $('.install-apperian').attr({
                    target: '_blank',
                    href: 'https://dl.dropboxusercontent.com/u/18721647/_download/ProdAppCatalog_1-29.apk'
                });
            }
            // page doesn't exist yet so let's go load it
        } else{
            loadPage(page);
        }
    }

    function loadPage(page) {
        // path to html
        var pageHtml = ('pages/' + page + '.html');

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
        });
    }

    init();
})();
