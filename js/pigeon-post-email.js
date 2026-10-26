---
published: false
sitemap: false
---
/**
 * Yellow Wing Roasters - Pigeon Post Email Composer
 * Builds and previews Google Workspace / Gmail-ready HTML emails (New Roast Dispatch & Welcome to the Flock)
 * in the site's unboxed, centered .roast-minimal-vertical aesthetic.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initPigeonPostEmailComposer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildRoastDotsHtml(dotsCount) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      var color = i <= dotsCount ? '#9c6d12' : '#dfd6c9';
      html += '<span style="color: ' + color + '; font-size: 12px; margin: 0 2px;">&#9679;</span>';
    }
    return html;
  }

  function formatTastingNotes(notesStr) {
    if (notesStr.indexOf('·') !== -1) {
      return escapeHtml(notesStr);
    }
    return escapeHtml(notesStr).replace(/,\s*/g, ' &middot; ');
  }

  return function initPigeonPostEmailComposer(config) {
    var roasts = config.roasts;
    var badgeColors = config.badgeColors;
    var statuses = config.statuses;
    var siteUrl = config.siteUrl;
    var siteTitle = config.siteTitle;
    var roasterEmail = config.roasterEmail;

    var modeBtns = document.querySelectorAll('.pp-mode-btn');
    var roastFieldWrap = document.getElementById('pp-roast-field-wrap');
    var roastSelect = document.getElementById('pp-roast-select');
    var subjectInput = document.getElementById('pp-subject-input');
    var introInput = document.getElementById('pp-intro-input');
    var previewContainer = document.getElementById('pp-email-preview-container');
    var rawHtmlTextarea = document.getElementById('pp-raw-html-output');
    var copyGmailBtn = document.getElementById('pp-copy-gmail-btn');
    var copySubjectBtn = document.getElementById('pp-copy-subject-btn');
    var copyHtmlBtn = document.getElementById('pp-copy-html-btn');
    var statusMsg = document.getElementById('pp-copy-status');

    var currentMode = 'new_roast';
    var lastAutoSubject = '';

    function buildEmailData(roast, introText) {
      var justHatchedBadge = statuses.just_hatched.badge;
      var justHatchedStyle = badgeColors.just_hatched;

      var certLabel = null;
      if (roast.certification === 'fair_trade_organic') {
        certLabel = 'Fair Trade Organic';
      } else if (roast.certification === 'organic') {
        certLabel = 'Organic';
      }

      var isSingleOrigin = roast.category === 'single origin';
      var originLabel = isSingleOrigin ? 'Region' : 'Origins';
      var originValue = isSingleOrigin ? roast.region : roast.origins.join(' · ');

      var terroirParts = [];
      if (roast.elevation) {
        terroirParts.push(roast.elevation);
      }
      if (roast.processingMethod) {
        terroirParts.push(roast.processingMethod);
      }
      var terroirLabel = roast.elevation && roast.processingMethod
        ? 'Terroir'
        : (roast.elevation ? 'Elevation' : 'Processing');
      var terroirValue = terroirParts.join(' · ');

      return {
        roast: roast,
        introText: introText.trim(),
        justHatchedBadge: justHatchedBadge,
        justHatchedBg: justHatchedStyle.background,
        justHatchedColor: justHatchedStyle.color,
        certLabel: certLabel,
        originLabel: originLabel,
        originValue: originValue,
        terroirLabel: terroirLabel,
        terroirValue: terroirValue,
        tastingNotesHtml: formatTastingNotes(roast.tastingNotes),
        roastDotsHtml: buildRoastDotsHtml(roast.roastDots)
      };
    }

    function renderBrandLockupHtml() {
      return (
        '<div style="margin-bottom: 32px; text-align: center;">' +
          '<a href="' + escapeHtml(siteUrl) + '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">' +
            '<img src="' + escapeHtml(siteUrl) + '/images/audubon-feather-transparent.png" height="52" alt="' + escapeHtml(siteTitle) + '" style="height: 52px; width: auto; display: block; margin: 0 auto 8px;" />' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #f0c838; line-height: 1.2;">' +
              'Yellow Wing' +
            '</div>' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 500; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #8a7f6e; margin-top: 2px;">' +
              'Roasters' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }

    function renderFooterHtml() {
      return (
        '<div style="text-align: center;">' +
          '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 13px; color: #f0c838; line-height: 1.5; margin-bottom: 14px;">' +
            'Chirp,<br>' +
            '<strong style="color: #f0c838;">' + escapeHtml(siteTitle) + '</strong>' +
          '</div>' +
          '<p style="font-size: 11px; color: #998070; line-height: 1.6; margin: 0 auto; max-width: 360px;">' +
            'Sent via Pigeon Post from <a href="' + escapeHtml(siteUrl) + '" style="color: #8a7060; text-decoration: underline;">yellowwingroasters.com</a>. Reply to <a href="mailto:' + escapeHtml(roasterEmail) + '" style="color: #8a7060; text-decoration: underline;">' + escapeHtml(roasterEmail) + '</a> anytime with questions or to unsubscribe.' +
          '</p>' +
        '</div>'
      );
    }

    function renderNewRoastBodyHtml(data) {
      var r = data.roast;

      var mascotCaptionHtml = '';
      if (r.mascotName) {
        mascotCaptionHtml =
          '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7060; margin-top: 10px;">' +
            escapeHtml(r.mascotName) +
          '</div>';
      }

      var catText = escapeHtml(r.category) + (data.certLabel ? ' &middot; ' + escapeHtml(data.certLabel) : '');

      var subtitleHtml = '';
      if (r.subtitle) {
        subtitleHtml =
          '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8a7f6e; margin-bottom: 8px;">' +
            escapeHtml(r.subtitle) +
          '</div>';
      }

      var introHtml = '';
      if (data.introText) {
        introHtml =
          '<p style="max-width: 420px; margin: 0 auto 16px; font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.75; color: #2c1e14;">' +
            escapeHtml(data.introText).replace(/\n/g, '<br>') +
          '</p>';
      }

      var terroirMetaHtml = '';
      if (data.terroirValue) {
        terroirMetaHtml =
          '<div style="display: inline-block; vertical-align: top; padding: 8px 16px; text-align: center;">' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
              escapeHtml(data.terroirLabel) +
            '</div>' +
            '<div style="font-size: 13px; font-weight: 600; color: #2c1e14; line-height: 1.4;">' +
              escapeHtml(data.terroirValue) +
            '</div>' +
          '</div>';
      }

      return (
        '<div style="background-color: #faf8f5; padding: 40px 20px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #2c1e14; text-align: center;">' +
          '<div style="max-width: 500px; margin: 0 auto; text-align: center;">' +
            renderBrandLockupHtml() +

            '<!-- Audubon Mascot Illustration -->' +
            '<div style="margin: 0 auto 24px;">' +
              '<a href="' + escapeHtml(r.roastUrl) + '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">' +
                '<img src="' + escapeHtml(r.mascotUrl) + '" alt="' + escapeHtml(r.title) + '" height="185" style="height: 185px; max-width: 240px; width: auto; display: block; margin: 0 auto;" />' +
              '</a>' +
              mascotCaptionHtml +
            '</div>' +

            '<!-- Status & Category -->' +
            '<div style="margin-bottom: 10px;">' +
              '<span style="display: inline-block; background-color: ' + data.justHatchedBg + '; color: ' + data.justHatchedColor + '; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 10px; border-radius: 999px; vertical-align: middle;">' +
                escapeHtml(data.justHatchedBadge) +
              '</span>' +
              '<span style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7f6e; margin-left: 8px; vertical-align: middle;">' +
                catText +
              '</span>' +
            '</div>' +

            '<!-- Roast Title & Subtitle -->' +
            '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 600; color: #2c1e14; line-height: 1.08; letter-spacing: -0.02em; margin: 0 0 6px;">' +
              escapeHtml(r.title) +
            '</h1>' +
            subtitleHtml +

            '<!-- Descriptor & Tasting Notes -->' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 14px; color: #3a2a1d; margin: 10px 0 4px;">' +
              escapeHtml(r.descriptor) +
            '</div>' +
            '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 16px; color: #8a7060; line-height: 1.55; margin: 0 auto 18px; max-width: 400px;">' +
              data.tastingNotesHtml +
            '</div>' +

            '<!-- Roast Level Dots & Name -->' +
            '<div style="margin: 0 auto 28px;">' +
              '<div style="letter-spacing: 3px; font-size: 12px; line-height: 1;">' +
                data.roastDotsHtml +
              '</div>' +
              '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 500; font-size: 10px; color: #998070; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 6px;">' +
                escapeHtml(r.roastLevelName) +
              '</div>' +
            '</div>' +

            introHtml +

            '<!-- Roast Description -->' +
            '<p style="max-width: 420px; margin: 0 auto 32px; font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.75; color: #4a3b32;">' +
              escapeHtml(r.description) +
            '</p>' +

            '<!-- Unboxed Metadata Row -->' +
            '<div style="max-width: 460px; margin: 0 auto 34px; text-align: center;">' +
              '<div style="display: inline-block; vertical-align: top; padding: 8px 16px; text-align: center;">' +
                '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
                  escapeHtml(data.originLabel) +
                '</div>' +
                '<div style="font-size: 13px; font-weight: 600; color: #2c1e14; line-height: 1.4;">' +
                  escapeHtml(data.originValue) +
                '</div>' +
              '</div>' +
              terroirMetaHtml +
              '<div style="display: inline-block; vertical-align: top; padding: 8px 16px; text-align: center;">' +
                '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
                  'Recommended Brew' +
                '</div>' +
                '<div style="font-size: 13px; font-weight: 600; color: #2c1e14; line-height: 1.4;">' +
                  escapeHtml(r.brewingMethod) +
                '</div>' +
              '</div>' +
            '</div>' +

            '<!-- Primary Pill CTA -->' +
            '<div style="margin-bottom: 40px;">' +
              '<a href="' + escapeHtml(r.roastUrl) + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff !important; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 13px 30px; border-radius: 999px;">' +
                'Explore ' + escapeHtml(r.title) + ' &rarr;' +
              '</a>' +
            '</div>' +

            renderFooterHtml() +
          '</div>' +
        '</div>'
      );
    }

    function renderWelcomeBodyHtml(introText) {
      var trimmedIntro = introText.trim();
      var introHtml = '';
      if (trimmedIntro) {
        introHtml =
          '<p style="max-width: 420px; margin: 0 auto 16px; font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.75; color: #2c1e14;">' +
            escapeHtml(trimmedIntro).replace(/\n/g, '<br>') +
          '</p>';
      }

      var badgeStyle = badgeColors.best_seller;

      return (
        '<div style="background-color: #faf8f5; padding: 40px 20px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #2c1e14; text-align: center;">' +
          '<div style="max-width: 500px; margin: 0 auto; text-align: center;">' +
            renderBrandLockupHtml() +

            '<!-- Audubon Pigeon Post Illustration -->' +
            '<div style="margin: 0 auto 22px;">' +
              '<a href="' + escapeHtml(siteUrl) + '/roasts/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">' +
                '<img src="' + escapeHtml(siteUrl) + '/images/audubon-pigeon-post-transparent.png" alt="Pigeon Post — ' + escapeHtml(siteTitle) + '" height="175" style="height: 175px; max-width: 230px; width: auto; display: block; margin: 0 auto;" />' +
              '</a>' +
            '</div>' +

            '<!-- Welcome Pill -->' +
            '<div style="margin-bottom: 10px;">' +
              '<span style="display: inline-block; background-color: ' + badgeStyle.background + '; color: ' + badgeStyle.color + '; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 12px; border-radius: 999px;">' +
                'Welcome to the Flock' +
              '</span>' +
            '</div>' +

            '<!-- Title & Subtitle -->' +
            '<h1 style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 600; color: #2c1e14; line-height: 1.08; letter-spacing: -0.02em; margin: 0 0 6px;">' +
              'Pigeon Post' +
            '</h1>' +
            '<div style="font-family: Georgia, \'Lora\', serif; font-style: italic; font-size: 16px; color: #8a7060; line-height: 1.55; margin: 0 auto 24px;">' +
              'Stay in the Loop' +
            '</div>' +

            introHtml +

            '<!-- Main Welcome Copy -->' +
            '<p style="max-width: 420px; margin: 0 auto 30px; font-family: Georgia, \'Lora\', serif; font-size: 15px; line-height: 1.75; color: #4a3b32;">' +
              'Thanks for joining our small-batch roastery dispatch. Every bag we offer is roasted fresh to order, and you\'re now first in line to hear when new single-origin lots, seasonal blends, and fresh restocks land in the roost.' +
            '</p>' +

            '<!-- Unboxed Three Pillars -->' +
            '<div style="max-width: 480px; margin: 0 auto 34px; text-align: center;">' +
              '<div style="display: inline-block; vertical-align: top; width: 135px; padding: 8px 10px; text-align: center;">' +
                '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
                  'Just Hatched' +
                '</div>' +
                '<div style="font-size: 13px; color: #2c1e14; line-height: 1.45;">' +
                  'New micro-lots &amp; signature blends' +
                '</div>' +
              '</div>' +
              '<div style="display: inline-block; vertical-align: top; width: 135px; padding: 8px 10px; text-align: center;">' +
                '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
                  'Seasonals' +
                '</div>' +
                '<div style="font-size: 13px; color: #2c1e14; line-height: 1.45;">' +
                  'Limited-run holiday &amp; seasonal roasts' +
                '</div>' +
              '</div>' +
              '<div style="display: inline-block; vertical-align: top; width: 135px; padding: 8px 10px; text-align: center;">' +
                '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998070; margin-bottom: 4px;">' +
                  'Restocks' +
                '</div>' +
                '<div style="font-size: 13px; color: #2c1e14; line-height: 1.45;">' +
                  'Fresh harvests &amp; rotating lots' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<!-- Primary Pill CTA -->' +
            '<div style="margin-bottom: 24px;">' +
              '<a href="' + escapeHtml(siteUrl) + '/roasts/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2c1e14; color: #ffffff !important; font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 13px 30px; border-radius: 999px;">' +
                'Browse All Roasts &rarr;' +
              '</a>' +
            '</div>' +

            '<!-- Minimal Dot-Separated Explore Links -->' +
            '<div style="font-family: \'Montserrat\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #998070; margin-bottom: 40px;">' +
              '<a href="' + escapeHtml(siteUrl) + '/quiz/" target="_blank" rel="noopener noreferrer" style="color: #9c6d12; text-decoration: none;">Coffee Quiz</a>' +
              '<span style="color: #ccc; margin: 0 8px;">&middot;</span>' +
              '<a href="' + escapeHtml(siteUrl) + '/flights/" target="_blank" rel="noopener noreferrer" style="color: #9c6d12; text-decoration: none;">Sample Flights</a>' +
              '<span style="color: #ccc; margin: 0 8px;">&middot;</span>' +
              '<a href="' + escapeHtml(siteUrl) + '/subscriptions/" target="_blank" rel="noopener noreferrer" style="color: #9c6d12; text-decoration: none;">Subscriptions</a>' +
            '</div>' +

            renderFooterHtml() +
          '</div>' +
        '</div>'
      );
    }

    function renderFullHtmlDocument(bodyHtml, subjectText) {
      return (
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '  <head>\n' +
        '    <meta charset="utf-8">\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '    <title>' + escapeHtml(subjectText) + '</title>\n' +
        '  </head>\n' +
        '  <body style="margin: 0; padding: 0; background-color: #faf8f5;">\n' +
        '    ' + bodyHtml + '\n' +
        '  </body>\n' +
        '</html>'
      );
    }

    function renderNewRoastPlainText(data) {
      var r = data.roast;
      var lines = [
        data.justHatchedBadge.toUpperCase() + ' · ' + r.category.toUpperCase(),
        r.title + (r.subtitle ? ' — ' + r.subtitle : ''),
        r.descriptor + ' (' + r.tastingNotes + ')',
        'Roast Level: ' + r.roastLevelName,
        ''
      ];
      if (data.introText) {
        lines.push(data.introText, '');
      }
      lines.push(
        r.description,
        '',
        data.originLabel + ': ' + data.originValue
      );
      if (data.terroirValue) {
        lines.push(data.terroirLabel + ': ' + data.terroirValue);
      }
      lines.push(
        'Recommended Brew: ' + r.brewingMethod,
        '',
        'Explore ' + r.title + ': ' + r.roastUrl,
        '',
        'Chirp,',
        siteTitle
      );
      return lines.join('\n');
    }

    function renderWelcomePlainText(introText) {
      var trimmedIntro = introText.trim();
      var lines = [
        'WELCOME TO THE FLOCK — ' + siteTitle.toUpperCase(),
        'Pigeon Post · Stay in the Loop',
        ''
      ];
      if (trimmedIntro) {
        lines.push(trimmedIntro, '');
      }
      lines.push(
        'Thanks for joining our small-batch roastery dispatch. Every bag we offer is roasted fresh to order, and you\'re now first in line to hear when new single-origin lots, seasonal blends, and fresh restocks land in the roost.',
        '',
        '- Just Hatched: New micro-lots & signature blends',
        '- Seasonals: Limited-run holiday & seasonal roasts',
        '- Restocks: Fresh harvests & rotating lots',
        '',
        'Browse All Roasts: ' + siteUrl + '/roasts/',
        'Coffee Quiz: ' + siteUrl + '/quiz/ · Sample Flights: ' + siteUrl + '/flights/ · Subscriptions: ' + siteUrl + '/subscriptions/',
        '',
        'Chirp,',
        siteTitle
      );
      return lines.join('\n');
    }

    function showStatus(msg) {
      statusMsg.textContent = msg;
      setTimeout(function () {
        if (statusMsg.textContent === msg) {
          statusMsg.textContent = '';
        }
      }, 3000);
    }

    function buildCurrentOutput() {
      if (currentMode === 'welcome') {
        var welcomeBody = renderWelcomeBodyHtml(introInput.value);
        return {
          defaultSubject: 'Welcome to Pigeon Post — ' + siteTitle,
          bodyHtml: welcomeBody,
          plainText: renderWelcomePlainText(introInput.value)
        };
      }

      var slug = roastSelect.value;
      var roast = roasts[slug];
      var emailData = buildEmailData(roast, introInput.value);
      return {
        defaultSubject: statuses.just_hatched.badge + ': ' + roast.title + ' — ' + siteTitle,
        bodyHtml: renderNewRoastBodyHtml(emailData),
        plainText: renderNewRoastPlainText(emailData)
      };
    }

    function updateComposer() {
      roastFieldWrap.style.display = currentMode === 'welcome' ? 'none' : 'block';
      var out = buildCurrentOutput();

      if (!subjectInput.value || subjectInput.value === lastAutoSubject) {
        subjectInput.value = out.defaultSubject;
        lastAutoSubject = out.defaultSubject;
      }

      var fullHtml = renderFullHtmlDocument(out.bodyHtml, subjectInput.value);
      previewContainer.innerHTML = out.bodyHtml;
      rawHtmlTextarea.value = fullHtml;
    }

    Array.prototype.forEach.call(modeBtns, function (btn) {
      btn.addEventListener('click', function () {
        var nextMode = btn.getAttribute('data-mode');
        if (nextMode === currentMode) return;
        currentMode = nextMode;

        Array.prototype.forEach.call(modeBtns, function (b) {
          var isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });

        updateComposer();
      });
    });

    roastSelect.addEventListener('change', updateComposer);
    introInput.addEventListener('input', updateComposer);
    subjectInput.addEventListener('input', function () {
      var out = buildCurrentOutput();
      rawHtmlTextarea.value = renderFullHtmlDocument(out.bodyHtml, subjectInput.value);
    });

    copyGmailBtn.addEventListener('click', function () {
      var out = buildCurrentOutput();
      var htmlBlob = new Blob([out.bodyHtml], { type: 'text/html' });
      var textBlob = new Blob([out.plainText], { type: 'text/plain' });
      var item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });

      navigator.clipboard.write([item]).then(function () {
        showStatus('✓ Copied formatted email! Paste directly (Cmd+V) into your Gmail Compose window.');
      }).catch(function (err) {
        console.error('Failed to copy rich HTML to clipboard:', err);
        showStatus('Clipboard copy failed — see console for details.');
      });
    });

    copySubjectBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(subjectInput.value).then(function () {
        showStatus('✓ Copied subject line to clipboard!');
      }).catch(function (err) {
        console.error('Failed to copy subject line:', err);
      });
    });

    copyHtmlBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(rawHtmlTextarea.value).then(function () {
        showStatus('✓ Copied raw HTML source to clipboard!');
      }).catch(function (err) {
        console.error('Failed to copy raw HTML:', err);
      });
    });

    updateComposer();
  };
});
