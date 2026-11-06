/**
 * Yellow Wing Roasters - Simplified Roast Admin UI Previews
 * Interactive driver with real data operations, dynamic calculations, and zero phantom buttons.
 */

(function () {
  'use strict';

  var GRAMS_PER_LB = 453.592;

  var ROAST_LEVEL_LABELS = {
    '1': 'City (Light)',
    '2': 'City+ (Light-Medium)',
    '3': 'Full City (Medium)',
    '4': 'Full City+ (Medium-Dark)',
    '5': 'Vienna (Dark)'
  };

  var state = {
    greenBeans: [
      {
        id: 'bean-colombia',
        name: 'Colombia Supremo Huila',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/colombia-supremo.html',
        totalPurchasedGrams: 9072,
        activeStockGrams: 0,
        status: 'in-stock'
      },
      {
        id: 'bean-ethiopia',
        name: 'Ethiopia Yirgacheffe Idido',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/eth-yrg-konga-washed_copy.html',
        totalPurchasedGrams: 4536,
        activeStockGrams: 0,
        status: 'low'
      },
      {
        id: 'bean-guatemala',
        name: 'Guatemala Antigua Santo Domingo',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/guat5.html',
        totalPurchasedGrams: 4536,
        activeStockGrams: 0,
        status: 'in-stock'
      },
      {
        id: 'bean-brazil',
        name: 'Brazil Natural Sul de Minas',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/brazil-natural.html',
        totalPurchasedGrams: 9072,
        activeStockGrams: 0,
        status: 'in-stock'
      },
      {
        id: 'bean-burundi',
        name: 'Burundi Kayave Washing Station',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/burundi-kayave.html',
        totalPurchasedGrams: 2268,
        activeStockGrams: 0,
        status: 'low'
      },
      {
        id: 'bean-sumatra',
        name: 'Sumatra Mandheling Grade 1',
        supplier: 'Roastmasters',
        url: 'https://www.roastmasters.com/sumatra-mandheling.html',
        totalPurchasedGrams: 4536,
        activeStockGrams: 0,
        status: 'depleted'
      }
    ],
    greenBeanOrders: [
      {
        orderId: 'GB-106',
        date: '2026-11-01',
        name: 'Colombia Supremo Huila',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-88421',
        cost: 44.50,
        weightLbs: 10,
        adjustGrams: 15,
        weightGrams: 4551,
        availableGrams: 4551,
        url: 'https://www.roastmasters.com/colombia-supremo.html'
      },
      {
        orderId: 'GB-105',
        date: '2026-10-24',
        name: 'Brazil Natural Sul de Minas',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-88210',
        cost: 39.80,
        weightLbs: 10,
        adjustGrams: -10,
        weightGrams: 4526,
        availableGrams: 4526,
        url: 'https://www.roastmasters.com/brazil-natural.html'
      },
      {
        orderId: 'GB-104',
        date: '2026-10-15',
        name: 'Guatemala Antigua Santo Domingo',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-87994',
        cost: 42.10,
        weightLbs: 10,
        adjustGrams: 20,
        weightGrams: 4556,
        availableGrams: 4556,
        url: 'https://www.roastmasters.com/guat5.html'
      },
      {
        orderId: 'GB-103',
        date: '2026-10-02',
        name: 'Ethiopia Yirgacheffe Idido',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-87512',
        cost: 51.20,
        weightLbs: 10,
        adjustGrams: 0,
        weightGrams: 4536,
        availableGrams: 4536,
        url: 'https://www.roastmasters.com/eth-yrg-konga-washed_copy.html'
      },
      {
        orderId: 'GB-102',
        date: '2026-09-18',
        name: 'Burundi Kayave Washing Station',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-86940',
        cost: 26.50,
        weightLbs: 5,
        adjustGrams: 8,
        weightGrams: 2276,
        availableGrams: 2276,
        url: 'https://www.roastmasters.com/burundi-kayave.html'
      },
      {
        orderId: 'GB-101',
        date: '2026-08-11',
        name: 'Sumatra Mandheling Grade 1',
        supplier: 'Roastmasters',
        supplierOrderId: 'RM-85880',
        cost: 41.00,
        weightLbs: 10,
        adjustGrams: 0,
        weightGrams: 4536,
        availableGrams: 0,
        url: 'https://www.roastmasters.com/sumatra-mandheling.html'
      }
    ],
    roastLogs: [
      {
        roastId: 'R-2046',
        date: '2026-11-04',
        beanName: 'Colombia Supremo Huila',
        roastLevel: '2',
        greenWeightGrams: 454,
        endWeightGrams: 391,
        weightLossPct: 13.9,
        profileUrl: 'https://artisan-scope.org/profiles/r-2046',
        greenBeanComponents: [{ orderId: 'GB-106', grams: 454 }],
        notes: 'First crack at 8:45, dropped at 10:15. Smooth citrus and sweet panela.'
      },
      {
        roastId: 'R-2045',
        date: '2026-11-03',
        beanName: 'Ethiopia Yirgacheffe Idido',
        roastLevel: '1',
        greenWeightGrams: 454,
        endWeightGrams: 396,
        weightLossPct: 12.8,
        profileUrl: 'https://artisan-scope.org/profiles/r-2045',
        greenBeanComponents: [{ orderId: 'GB-103', grams: 454 }],
        notes: 'Light delicate roast, jasmine and bergamot floral punch.'
      },
      {
        roastId: 'R-2044',
        date: '2026-10-31',
        beanName: 'Brazil Natural Sul de Minas',
        roastLevel: '3',
        greenWeightGrams: 454,
        endWeightGrams: 382,
        weightLossPct: 15.9,
        profileUrl: 'https://artisan-scope.org/profiles/r-2044',
        greenBeanComponents: [{ orderId: 'GB-105', grams: 454 }],
        notes: 'Chocolate fudge and roasted hazelnut body for Early Bird component.'
      },
      {
        roastId: 'R-2043',
        date: '2026-10-28',
        beanName: 'Guatemala Antigua Santo Domingo',
        roastLevel: '4',
        greenWeightGrams: 454,
        endWeightGrams: 374,
        weightLossPct: 17.6,
        profileUrl: 'https://artisan-scope.org/profiles/r-2043',
        greenBeanComponents: [{ orderId: 'GB-104', grams: 454 }],
        notes: 'Deep bakers cocoa, smoky caramel spice finish.'
      },
      {
        roastId: 'R-2042',
        date: '2026-10-22',
        beanName: 'Burundi Kayave Washing Station',
        roastLevel: '2',
        greenWeightGrams: 454,
        endWeightGrams: 388,
        weightLossPct: 14.5,
        profileUrl: 'https://artisan-scope.org/profiles/r-2042',
        greenBeanComponents: [{ orderId: 'GB-102', grams: 454 }],
        notes: 'Stone fruit acidity with brown sugar sweetness.'
      }
    ],
    blendPackagingLogs: [
      {
        logId: 'PKG-505',
        date: '2026-11-04',
        purpose: 'Order',
        orderId: '1042',
        product: 'Early Bird Blend',
        bagSize: '12oz',
        roastComponents: [
          { roastId: 'R-2046', weightGrams: 204 },
          { roastId: 'R-2044', weightGrams: 136 }
        ],
        notes: 'Customer requested whole bean, bagged same day as roast.'
      },
      {
        logId: 'PKG-504',
        date: '2026-11-03',
        purpose: 'Order',
        orderId: '1041',
        product: 'Ethiopia Yirgacheffe Single Origin',
        bagSize: '12oz',
        roastComponents: [
          { roastId: 'R-2045', weightGrams: 340 }
        ],
        notes: 'Drip grind requested.'
      },
      {
        logId: 'PKG-503',
        date: '2026-11-01',
        purpose: 'Sample',
        orderId: '',
        product: 'Guatemala Antigua Santo Domingo',
        bagSize: 'Custom',
        roastComponents: [
          { roastId: 'R-2043', weightGrams: 113 }
        ],
        notes: 'Free 4oz taster sample for local cafe owner.'
      },
      {
        logId: 'PKG-502',
        date: '2026-10-30',
        purpose: 'Personal',
        orderId: '',
        product: 'House Blend Stash',
        bagSize: '1lb',
        roastComponents: [
          { roastId: 'R-2046', weightGrams: 227 },
          { roastId: 'R-2042', weightGrams: 227 }
        ],
        notes: 'Personal home stash.'
      }
    ]
  };

  // Pure derived stock calculation
  function recomputeStocks() {
    var usedByOrder = {};
    state.roastLogs.forEach(function (r) {
      (r.greenBeanComponents || []).forEach(function (c) {
        usedByOrder[c.orderId] = (usedByOrder[c.orderId] || 0) + (Number(c.grams) || 0);
      });
    });

    state.greenBeanOrders.forEach(function (o) {
      var used = usedByOrder[o.orderId] || 0;
      o.availableGrams = Math.max(0, o.weightGrams - used);
    });

    var stockByBean = {};
    state.greenBeanOrders.forEach(function (o) {
      stockByBean[o.name] = (stockByBean[o.name] || 0) + o.availableGrams;
    });

    state.greenBeans.forEach(function (b) {
      b.activeStockGrams = stockByBean[b.name] !== undefined ? stockByBean[b.name] : 0;
      if (b.activeStockGrams <= 0) {
        b.status = 'depleted';
      } else if (b.activeStockGrams < GRAMS_PER_LB * 2) {
        b.status = 'low';
      } else {
        b.status = 'in-stock';
      }
    });
  }

  recomputeStocks();

  function formatLbs(grams) {
    return (grams / GRAMS_PER_LB).toFixed(1) + ' lbs';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'roast-preview-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2200);
  }

  function getStatusBadge(status, grams) {
    if (status === 'depleted' || grams <= 0) {
      return '<span class="stock-badge stock-badge--depleted">Depleted (0g)</span>';
    }
    if (status === 'low' || grams < GRAMS_PER_LB * 2) {
      return '<span class="stock-badge stock-badge--low">Low Stock (' + formatLbs(grams) + ')</span>';
    }
    return '<span class="stock-badge stock-badge--in-stock">In Stock (' + formatLbs(grams) + ')</span>';
  }

  // ========================================================
  // Option 1: Master-Detail Studio
  // ========================================================
  function initStudioPreview(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var activeTab = 'beans';
    var selectedId = null;
    var searchQuery = '';
    var isEditing = false;
    var isNewEntry = false;

    function render() {
      recomputeStocks();

      var tabCounts = {
        beans: state.greenBeans.length,
        orders: state.greenBeanOrders.length,
        roasts: state.roastLogs.length,
        packaging: state.blendPackagingLogs.length
      };

      var actionBtnHtml = activeTab !== 'beans'
        ? '<button type="button" class="roast-preview-btn-primary" id="studio-add-btn">+ Record ' +
            (activeTab === 'orders' ? 'Green Bean Order' : activeTab === 'roasts' ? 'Roast Log' : 'Master Blend &amp; Packaging') + '</button>'
        : '';

      var html = '<div class="roast-preview-nav-bar">' +
        '  <div class="roast-preview-tabs">' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'beans' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="beans">Active Green Beans <span class="tab-count">' + tabCounts.beans + '</span></button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'orders' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="orders">Green Bean Orders <span class="tab-count">' + tabCounts.orders + '</span></button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'roasts' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="roasts">Roast Log <span class="tab-count">' + tabCounts.roasts + '</span></button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'packaging' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="packaging">Master Blend &amp; Packaging <span class="tab-count">' + tabCounts.packaging + '</span></button>' +
        '  </div>' +
        '  <div class="roast-preview-search-wrap">' +
        '    <input type="search" placeholder="Search ' + activeTab + '..." id="studio-search-input" value="' + escapeHtml(searchQuery) + '">' +
        '  </div>' +
        '  <div class="roast-preview-actions">' + actionBtnHtml + '</div>' +
        '</div>' +
        '<div class="roast-studio-workspace">' +
        '  <div class="roast-studio-list" id="studio-list"></div>' +
        '  <div class="roast-studio-inspector" id="studio-inspector"></div>' +
        '</div>';

      container.innerHTML = html;

      var tabBtns = container.querySelectorAll('.roast-preview-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeTab = btn.getAttribute('data-tab');
          selectedId = null;
          isEditing = false;
          isNewEntry = false;
          searchQuery = '';
          render();
        });
      });

      var addBtn = container.querySelector('#studio-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          isNewEntry = true;
          isEditing = false;
          renderInspector(null);
        });
      }

      var searchInput = container.querySelector('#studio-search-input');
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.toLowerCase();
        renderListOnly();
      });

      renderListOnly();
    }

    function renderListOnly() {
      var listEl = container.querySelector('#studio-list');
      var items = [];

      if (activeTab === 'beans') {
        items = state.greenBeans.filter(function (b) {
          return !searchQuery || b.name.toLowerCase().indexOf(searchQuery) !== -1 || b.supplier.toLowerCase().indexOf(searchQuery) !== -1;
        });
      } else if (activeTab === 'orders') {
        items = state.greenBeanOrders.filter(function (o) {
          return !searchQuery || o.orderId.toLowerCase().indexOf(searchQuery) !== -1 || o.name.toLowerCase().indexOf(searchQuery) !== -1;
        });
      } else if (activeTab === 'roasts') {
        items = state.roastLogs.filter(function (r) {
          return !searchQuery || r.roastId.toLowerCase().indexOf(searchQuery) !== -1 || r.beanName.toLowerCase().indexOf(searchQuery) !== -1;
        });
      } else if (activeTab === 'packaging') {
        items = state.blendPackagingLogs.filter(function (p) {
          return !searchQuery || p.logId.toLowerCase().indexOf(searchQuery) !== -1 || p.product.toLowerCase().indexOf(searchQuery) !== -1;
        });
      }

      if (items.length === 0) {
        listEl.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #8a7060; font-size: 0.82rem;">No items found.</div>';
        if (!isNewEntry) renderInspector(null);
        return;
      }

      if (!isNewEntry && (!selectedId || !items.some(function (i) { return (i.id || i.orderId || i.roastId || i.logId) === selectedId; }))) {
        selectedId = items[0].id || items[0].orderId || items[0].roastId || items[0].logId;
      }

      var listHtml = '';
      items.forEach(function (item) {
        var itemId = item.id || item.orderId || item.roastId || item.logId;
        var isSelected = !isNewEntry && itemId === selectedId;

        if (activeTab === 'beans') {
          listHtml += '<div class="roast-studio-card ' + (isSelected ? 'roast-studio-card--active' : '') + '" data-id="' + itemId + '">' +
            '<div class="card-top">' +
            '  <h4 class="card-title">' + escapeHtml(item.name) + '</h4>' +
            '  ' + getStatusBadge(item.status, item.activeStockGrams) +
            '</div>' +
            '<div class="card-sub">' + escapeHtml(item.supplier) + '</div>' +
            '<div class="card-metrics">' +
            '  <span class="metric-pill">Stock: ' + item.activeStockGrams.toLocaleString() + ' g (' + formatLbs(item.activeStockGrams) + ')</span>' +
            '</div>' +
            '</div>';
        } else if (activeTab === 'orders') {
          listHtml += '<div class="roast-studio-card ' + (isSelected ? 'roast-studio-card--active' : '') + '" data-id="' + itemId + '">' +
            '<div class="card-top">' +
            '  <h4 class="card-title">' + item.orderId + ' &bull; ' + escapeHtml(item.name) + '</h4>' +
            '  <span class="stock-badge ' + (item.availableGrams > 0 ? 'stock-badge--in-stock' : 'stock-badge--depleted') + '">$' + Number(item.cost).toFixed(2) + '</span>' +
            '</div>' +
            '<div class="card-sub">' + escapeHtml(item.date) + ' &bull; ' + escapeHtml(item.supplier) + ' (' + escapeHtml(item.supplierOrderId || '—') + ')</div>' +
            '<div class="card-metrics">' +
            '  <span class="metric-pill">Purchased: ' + item.weightLbs + ' lbs</span>' +
            '  <span class="metric-pill" style="color: ' + (item.availableGrams > 0 ? '#27ae60' : '#c0392b') + '">Available: ' + item.availableGrams.toLocaleString() + ' g</span>' +
            '</div>' +
            '</div>';
        } else if (activeTab === 'roasts') {
          var lvlText = ROAST_LEVEL_LABELS[String(item.roastLevel)] || item.roastLevel;
          listHtml += '<div class="roast-studio-card ' + (isSelected ? 'roast-studio-card--active' : '') + '" data-id="' + itemId + '">' +
            '<div class="card-top">' +
            '  <h4 class="card-title">' + item.roastId + ' &bull; ' + escapeHtml(item.beanName) + '</h4>' +
            '  <span class="stock-badge stock-badge--in-stock">' + escapeHtml(lvlText) + '</span>' +
            '</div>' +
            '<div class="card-sub">' + escapeHtml(item.date) + ' &bull; Loss: -' + item.weightLossPct + '%</div>' +
            '<div class="card-metrics">' +
            '  <span class="metric-pill">' + item.greenWeightGrams + 'g &rarr; ' + item.endWeightGrams + 'g</span>' +
            '</div>' +
            '</div>';
        } else if (activeTab === 'packaging') {
          var compIds = (item.roastComponents || []).map(function (c) { return c.roastId; }).join(' + ');
          listHtml += '<div class="roast-studio-card ' + (isSelected ? 'roast-studio-card--active' : '') + '" data-id="' + itemId + '">' +
            '<div class="card-top">' +
            '  <h4 class="card-title">' + item.logId + ' &bull; ' + escapeHtml(item.product) + '</h4>' +
            '  <span class="stock-badge stock-badge--in-stock">' + item.purpose + '</span>' +
            '</div>' +
            '<div class="card-sub">' + escapeHtml(item.date) + ' &bull; ' + escapeHtml(item.bagSize) + (item.orderId ? ' &bull; Order #' + item.orderId : '') + '</div>' +
            '<div class="card-metrics">' +
            '  <span class="metric-pill">Roasts: ' + compIds + '</span>' +
            '</div>' +
            '</div>';
        }
      });

      listEl.innerHTML = listHtml;

      var cards = listEl.querySelectorAll('.roast-studio-card');
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          selectedId = card.getAttribute('data-id');
          isNewEntry = false;
          isEditing = false;
          renderListOnly();
        });
      });

      if (!isNewEntry) {
        renderInspector(selectedId);
      }
    }

    function renderInspector(id) {
      var inspectorEl = container.querySelector('#studio-inspector');
      if (isNewEntry || isEditing) {
        renderFormInInspector(inspectorEl, id);
        return;
      }

      if (!id) {
        inspectorEl.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: #8a7060; font-size: 0.85rem;">Select an item to view details.</div>';
        return;
      }

      var item = null;
      if (activeTab === 'beans') {
        item = state.greenBeans.find(function (b) { return b.id === id; });
      } else if (activeTab === 'orders') {
        item = state.greenBeanOrders.find(function (o) { return o.orderId === id; });
      } else if (activeTab === 'roasts') {
        item = state.roastLogs.find(function (r) { return r.roastId === id; });
      } else if (activeTab === 'packaging') {
        item = state.blendPackagingLogs.find(function (p) { return p.logId === id; });
      }

      if (!item) return;

      var html = '';
      if (activeTab === 'beans') {
        var pctLeft = Math.round((item.activeStockGrams / item.totalPurchasedGrams) * 100);
        var relatedOrders = state.greenBeanOrders.filter(function (o) { return o.name === item.name; });
        var relatedRoasts = state.roastLogs.filter(function (r) { return r.beanName === item.name; });

        html = '<div class="inspector-header">' +
          '  <div>' +
          '    <h3 class="inspector-title">' + escapeHtml(item.name) + '</h3>' +
          '    <p class="inspector-subtitle">Supplier: ' + escapeHtml(item.supplier) + (item.url ? ' &bull; <a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener">Origin Info &nearr;</a>' : '') + '</p>' +
          '  </div>' +
          '  <div>' + getStatusBadge(item.status, item.activeStockGrams) + '</div>' +
          '</div>' +
          '<div class="inspector-grid">' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Active Stock</div>' +
          '    <div class="metric-val">' + item.activeStockGrams.toLocaleString() + ' g</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Stock (lbs)</div>' +
          '    <div class="metric-val">' + formatLbs(item.activeStockGrams) + '</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Purchased</div>' +
          '    <div class="metric-val">' + formatLbs(item.totalPurchasedGrams) + '</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Capacity</div>' +
          '    <div class="metric-val">' + pctLeft + '%</div>' +
          '  </div>' +
          '</div>' +
          '<div class="inspector-section">' +
          '  <div class="section-title">Green Bean Shipments (' + relatedOrders.length + ')</div>' +
          '  <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-top:0.25rem;">' +
          (relatedOrders.length > 0 ? relatedOrders.map(function (o) {
            return '<button type="button" class="clickable-chip" data-nav-tab="orders" data-nav-id="' + o.orderId + '">' + o.orderId + ' (' + o.date + ') &rarr;</button>';
          }).join('') : '<span style="font-size:0.78rem; color:#8a7060;">None recorded yet.</span>') +
          '  </div>' +
          '</div>' +
          '<div class="inspector-section">' +
          '  <div class="section-title">Roast Batch History (' + relatedRoasts.length + ')</div>' +
          '  <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-top:0.25rem;">' +
          (relatedRoasts.length > 0 ? relatedRoasts.map(function (r) {
            return '<button type="button" class="clickable-chip" data-nav-tab="roasts" data-nav-id="' + r.roastId + '">' + r.roastId + ' (' + r.date + ') &rarr;</button>';
          }).join('') : '<span style="font-size:0.78rem; color:#8a7060;">None recorded yet.</span>') +
          '  </div>' +
          '</div>';
      } else if (activeTab === 'orders') {
        html = '<div class="inspector-header">' +
          '  <div>' +
          '    <h3 class="inspector-title">Order ' + item.orderId + ' &bull; ' + escapeHtml(item.name) + '</h3>' +
          '    <p class="inspector-subtitle">Supplier: ' + escapeHtml(item.supplier) + (item.supplierOrderId ? ' &bull; PO: <strong>' + escapeHtml(item.supplierOrderId) + '</strong>' : '') + (item.url ? ' &bull; <a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener">Link &nearr;</a>' : '') + '</p>' +
          '  </div>' +
          '  <span class="stock-badge stock-badge--in-stock">' + escapeHtml(item.date) + '</span>' +
          '</div>' +
          '<div class="inspector-grid">' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Total Cost</div>' +
          '    <div class="metric-val">$' + Number(item.cost).toFixed(2) + '</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Cost / lb</div>' +
          '    <div class="metric-val">$' + (item.cost / item.weightLbs).toFixed(2) + '</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Purchased</div>' +
          '    <div class="metric-val">' + item.weightGrams.toLocaleString() + ' g</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Available</div>' +
          '    <div class="metric-val" style="color: ' + (item.availableGrams > 0 ? '#27ae60' : '#c0392b') + '">' + item.availableGrams.toLocaleString() + ' g</div>' +
          '  </div>' +
          '</div>' +
          '<div class="inspector-section">' +
          '  <div class="section-title">Lot Breakdown</div>' +
          '  <p>' + item.weightLbs + ' lbs (' + item.weightGrams + 'g with ' + (item.adjustGrams >= 0 ? '+' : '') + item.adjustGrams + 'g adjustment). ' +
          (item.weightGrams - item.availableGrams).toLocaleString() + 'g roasted, ' + item.availableGrams.toLocaleString() + 'g available.</p>' +
          '</div>' +
          '<div class="inspector-actions-row">' +
          '  <button type="button" class="roast-preview-btn-primary" id="studio-edit-btn">Edit Green Bean Order</button>' +
          '</div>';
      } else if (activeTab === 'roasts') {
        var lvlLabel = ROAST_LEVEL_LABELS[String(item.roastLevel)] || item.roastLevel;
        var comps = item.greenBeanComponents || [];

        html = '<div class="inspector-header">' +
          '  <div>' +
          '    <h3 class="inspector-title">Batch ' + item.roastId + ' &bull; ' + escapeHtml(item.beanName) + '</h3>' +
          '    <p class="inspector-subtitle">Roast Date: ' + escapeHtml(item.date) + (item.profileUrl ? ' &bull; <a href="' + escapeHtml(item.profileUrl) + '" target="_blank" rel="noopener">Artisan Profile &nearr;</a>' : '') + '</p>' +
          '  </div>' +
          '  <span class="stock-badge stock-badge--in-stock">' + escapeHtml(lvlLabel) + '</span>' +
          '</div>' +
          '<div class="inspector-grid">' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Green Charged</div>' +
          '    <div class="metric-val">' + item.greenWeightGrams + ' g</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Roasted End</div>' +
          '    <div class="metric-val">' + item.endWeightGrams + ' g</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Weight Loss</div>' +
          '    <div class="metric-val" style="color: #d35400;">-' + item.weightLossPct + '%</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Roast Level</div>' +
          '    <div class="metric-val">' + item.roastLevel + '</div>' +
          '  </div>' +
          '</div>' +
          '<div class="inspector-section">' +
          '  <div class="section-title">Green Bean Orders Used</div>' +
          '  <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-top:0.25rem;">' +
          comps.map(function (c) {
            return '<button type="button" class="clickable-chip" data-nav-tab="orders" data-nav-id="' + c.orderId + '">' + c.orderId + ' (' + c.grams + 'g) &rarr;</button>';
          }).join('') +
          '  </div>' +
          '</div>' +
          (item.notes ? '<div class="inspector-section"><div class="section-title">Roast Notes</div><p class="inspector-notes-box">' + escapeHtml(item.notes) + '</p></div>' : '') +
          '<div class="inspector-actions-row">' +
          '  <button type="button" class="roast-preview-btn-primary" id="studio-edit-btn">Edit Roast Log</button>' +
          '</div>';
      } else if (activeTab === 'packaging') {
        var rComps = item.roastComponents || [];
        var totalPkgGrams = rComps.reduce(function (s, c) { return s + (Number(c.weightGrams) || 0); }, 0);

        html = '<div class="inspector-header">' +
          '  <div>' +
          '    <h3 class="inspector-title">' + item.logId + ' &bull; ' + escapeHtml(item.product) + '</h3>' +
          '    <p class="inspector-subtitle">Date: ' + escapeHtml(item.date) + ' &bull; Purpose: <strong>' + escapeHtml(item.purpose) + '</strong>' + (item.orderId ? ' &bull; <a href="/order/admin/?search=' + escapeHtml(item.orderId) + '" target="_blank" rel="noopener">Customer Order #' + escapeHtml(item.orderId) + ' &nearr;</a>' : '') + '</p>' +
          '  </div>' +
          '  <span class="stock-badge stock-badge--in-stock">' + escapeHtml(item.bagSize) + '</span>' +
          '</div>' +
          '<div class="inspector-grid">' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Bag Size</div>' +
          '    <div class="metric-val">' + escapeHtml(item.bagSize) + '</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Weight Bagged</div>' +
          '    <div class="metric-val">' + totalPkgGrams + ' g</div>' +
          '  </div>' +
          '  <div class="inspector-metric-box">' +
          '    <div class="metric-label">Batches Used</div>' +
          '    <div class="metric-val">' + rComps.length + '</div>' +
          '  </div>' +
          '</div>' +
          '<div class="inspector-section">' +
          '  <div class="section-title">Roast Batches &amp; Component Breakdown</div>' +
          '  <div style="display:flex; flex-direction:column; gap:0.25rem; margin-top:0.25rem;">' +
          rComps.map(function (c) {
            var pct = totalPkgGrams > 0 ? Math.round((c.weightGrams / totalPkgGrams) * 100) : 0;
            return '<div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">' +
              '<button type="button" class="clickable-chip" data-nav-tab="roasts" data-nav-id="' + c.roastId + '">' + c.roastId + ' &rarr;</button>' +
              '<span><strong>' + c.weightGrams + 'g</strong> (' + pct + '%)</span>' +
              '</div>';
          }).join('') +
          '  </div>' +
          '</div>' +
          (item.notes ? '<div class="inspector-section"><div class="section-title">Notes</div><p class="inspector-notes-box">' + escapeHtml(item.notes) + '</p></div>' : '') +
          '<div class="inspector-actions-row">' +
          '  <button type="button" class="roast-preview-btn-primary" id="studio-edit-btn">Edit Packaging Log</button>' +
          '</div>';
      }

      inspectorEl.innerHTML = html;

      var editBtn = inspectorEl.querySelector('#studio-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', function () {
          isEditing = true;
          isNewEntry = false;
          renderInspector(selectedId);
        });
      }

      var navBtns = inspectorEl.querySelectorAll('[data-nav-tab]');
      navBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetTab = btn.getAttribute('data-nav-tab');
          var targetId = btn.getAttribute('data-nav-id');
          activeTab = targetTab;
          selectedId = targetId;
          isEditing = false;
          isNewEntry = false;
          render();
        });
      });
    }

    function renderFormInInspector(inspectorEl, editId) {
      var item = null;
      if (isEditing && editId) {
        if (activeTab === 'orders') item = state.greenBeanOrders.find(function (o) { return o.orderId === editId; });
        else if (activeTab === 'roasts') item = state.roastLogs.find(function (r) { return r.roastId === editId; });
        else if (activeTab === 'packaging') item = state.blendPackagingLogs.find(function (p) { return p.logId === editId; });
      }

      var titleText = (isEditing ? 'Edit ' : 'Record ') +
        (activeTab === 'orders' ? 'Green Bean Order' : activeTab === 'roasts' ? 'Roast Log' : 'Master Blend & Packaging');

      var formHtml = '<form class="roast-studio-form" id="studio-active-form">' +
        '<div class="studio-form-header">' +
        '  <h4>' + titleText + '</h4>' +
        '  <button type="button" class="roast-preview-btn-secondary" id="studio-cancel-btn" style="padding:0.25rem 0.55rem; font-size:0.74rem;">Cancel</button>' +
        '</div>';

      if (activeTab === 'orders') {
        var defaultBean = item ? item.name : (state.greenBeans[0] ? state.greenBeans[0].name : '');
        var defaultDate = item ? item.date : new Date().toISOString().slice(0, 10);
        formHtml += '<div class="studio-field-group">' +
          '  <div class="studio-field" style="flex:1.4;">' +
          '    <label>Green Bean</label>' +
          '    <select name="beanName" required>' +
          state.greenBeans.map(function (b) {
            return '<option value="' + escapeHtml(b.name) + '" ' + (b.name === defaultBean ? 'selected' : '') + '>' + escapeHtml(b.name) + '</option>';
          }).join('') +
          '    </select>' +
          '  </div>' +
          '  <div class="studio-field" style="flex:1;">' +
          '    <label>Supplier</label>' +
          '    <input type="text" name="supplier" value="' + escapeHtml(item ? item.supplier : 'Roastmasters') + '" required>' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field-group">' +
          '  <div class="studio-field">' +
          '    <label>Supplier PO / Order #</label>' +
          '    <input type="text" name="supplierOrderId" value="' + escapeHtml(item ? item.supplierOrderId || '' : '') + '" placeholder="e.g. RM-88990">' +
          '  </div>' +
          '  <div class="studio-field">' +
          '    <label>Order Date</label>' +
          '    <input type="date" name="date" value="' + defaultDate + '" required>' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field-group">' +
          '  <div class="studio-field">' +
          '    <label>Cost ($)</label>' +
          '    <input type="number" step="0.01" min="0" name="cost" value="' + (item ? item.cost : '45.00') + '" required>' +
          '  </div>' +
          '  <div class="studio-field">' +
          '    <label>Weight (lbs)</label>' +
          '    <input type="number" step="0.1" min="0.1" name="weightLbs" value="' + (item ? item.weightLbs : '10') + '" required>' +
          '  </div>' +
          '  <div class="studio-field">' +
          '    <label>Adj (g)</label>' +
          '    <input type="number" step="1" name="adjustGrams" value="' + (item ? item.adjustGrams : '0') + '">' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field">' +
          '  <label>URL to Bean (Supplier Link)</label>' +
          '  <input type="url" name="url" value="' + escapeHtml(item ? item.url : 'https://www.roastmasters.com') + '" placeholder="https://...">' +
          '</div>';
      } else if (activeTab === 'roasts') {
        var defaultRoastDate = item ? item.date : new Date().toISOString().slice(0, 10);
        var defaultRoastBean = item ? item.beanName : (state.greenBeans[0] ? state.greenBeans[0].name : '');
        var defaultLvl = item ? String(item.roastLevel) : '2';

        formHtml += '<div class="studio-field-group">' +
          '  <div class="studio-field" style="flex:1.2;">' +
          '    <label>Roast Date</label>' +
          '    <input type="date" name="date" value="' + defaultRoastDate + '" required>' +
          '  </div>' +
          '  <div class="studio-field" style="flex:1.4;">' +
          '    <label>Roast Level</label>' +
          '    <select name="roastLevel">' +
          Object.keys(ROAST_LEVEL_LABELS).map(function (k) {
            return '<option value="' + k + '" ' + (k === defaultLvl ? 'selected' : '') + '>' + ROAST_LEVEL_LABELS[k] + '</option>';
          }).join('') +
          '    </select>' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field-group">' +
          '  <div class="studio-field" style="flex:1.4;">' +
          '    <label>Bean Roasted</label>' +
          '    <select name="beanName">' +
          state.greenBeans.map(function (b) {
            return '<option value="' + escapeHtml(b.name) + '" ' + (b.name === defaultRoastBean ? 'selected' : '') + '>' + escapeHtml(b.name) + '</option>';
          }).join('') +
          '    </select>' +
          '  </div>' +
          '  <div class="studio-field" style="flex:1;">' +
          '    <label>Green Charged (g)</label>' +
          '    <input type="number" name="greenWeightGrams" value="' + (item ? item.greenWeightGrams : '454') + '" min="1" required>' +
          '  </div>' +
          '  <div class="studio-field" style="flex:1;">' +
          '    <label>End Weight (g)</label>' +
          '    <input type="number" name="endWeightGrams" value="' + (item ? item.endWeightGrams : '390') + '" min="1" required>' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field">' +
          '  <label>Artisan Roast Profile URL</label>' +
          '  <input type="url" name="profileUrl" value="' + escapeHtml(item ? item.profileUrl : 'https://artisan-scope.org/profiles/') + '" placeholder="https://...">' +
          '</div>' +
          '<div class="studio-field">' +
          '  <label>Roast Notes</label>' +
          '  <input type="text" name="notes" value="' + escapeHtml(item ? item.notes : '') + '" placeholder="Crack time, aroma, development...">' +
          '</div>';
      } else if (activeTab === 'packaging') {
        var defaultPkgDate = item ? item.date : new Date().toISOString().slice(0, 10);
        var defaultPurpose = item ? item.purpose : 'Order';
        var defaultBag = item ? item.bagSize : '12oz';

        formHtml += '<div class="studio-field-group">' +
          '  <div class="studio-field">' +
          '    <label>Date</label>' +
          '    <input type="date" name="date" value="' + defaultPkgDate + '" required>' +
          '  </div>' +
          '  <div class="studio-field">' +
          '    <label>Purpose</label>' +
          '    <select name="purpose">' +
          '      <option value="Order" ' + (defaultPurpose === 'Order' ? 'selected' : '') + '>Customer Order</option>' +
          '      <option value="Sample" ' + (defaultPurpose === 'Sample' ? 'selected' : '') + '>Free Sample</option>' +
          '      <option value="Personal" ' + (defaultPurpose === 'Personal' ? 'selected' : '') + '>Personal</option>' +
          '    </select>' +
          '  </div>' +
          '  <div class="studio-field">' +
          '    <label>Customer Order #</label>' +
          '    <input type="text" name="orderId" value="' + escapeHtml(item ? item.orderId || '' : '') + '" placeholder="e.g. 1045">' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field-group">' +
          '  <div class="studio-field" style="flex:1.4;">' +
          '    <label>Product / Blend Label</label>' +
          '    <input type="text" name="product" value="' + escapeHtml(item ? item.product : 'Early Bird Blend') + '" required>' +
          '  </div>' +
          '  <div class="studio-field" style="flex:1;">' +
          '    <label>Bag Size</label>' +
          '    <select name="bagSize">' +
          '      <option value="12oz" ' + (defaultBag === '12oz' ? 'selected' : '') + '>12oz (340g)</option>' +
          '      <option value="1lb" ' + (defaultBag === '1lb' ? 'selected' : '') + '>1lb (454g)</option>' +
          '      <option value="2lb" ' + (defaultBag === '2lb' ? 'selected' : '') + '>2lb (907g)</option>' +
          '      <option value="5lb" ' + (defaultBag === '5lb' ? 'selected' : '') + '>5lb (2268g)</option>' +
          '      <option value="Custom" ' + (defaultBag === 'Custom' ? 'selected' : '') + '>Custom / Loose</option>' +
          '    </select>' +
          '  </div>' +
          '</div>' +
          '<div class="studio-field">' +
          '  <label>Notes</label>' +
          '  <input type="text" name="notes" value="' + escapeHtml(item ? item.notes : '') + '" placeholder="Grind requested, packaging notes...">' +
          '</div>';
      }

      formHtml += '<div class="studio-form-actions">' +
        '  <button type="submit" class="roast-preview-btn-primary">Save ' + (activeTab === 'orders' ? 'Order' : activeTab === 'roasts' ? 'Roast' : 'Packaging') + '</button>' +
        '  <button type="button" class="roast-preview-btn-secondary" id="studio-form-cancel-btn">Cancel</button>' +
        '</div>' +
        '</form>';

      inspectorEl.innerHTML = formHtml;

      var cancelTop = inspectorEl.querySelector('#studio-cancel-btn');
      var cancelBtm = inspectorEl.querySelector('#studio-form-cancel-btn');
      var onCancel = function () {
        isEditing = false;
        isNewEntry = false;
        render();
      };
      if (cancelTop) cancelTop.addEventListener('click', onCancel);
      if (cancelBtm) cancelBtm.addEventListener('click', onCancel);

      var form = inspectorEl.querySelector('#studio-active-form');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);

        if (activeTab === 'orders') {
          var weightLbs = parseFloat(fd.get('weightLbs')) || 0;
          var adjGrams = parseInt(fd.get('adjustGrams'), 10) || 0;
          var totalGrams = Math.round(weightLbs * GRAMS_PER_LB + adjGrams);

          if (isEditing && item) {
            item.name = fd.get('beanName');
            item.supplier = fd.get('supplier');
            item.supplierOrderId = fd.get('supplierOrderId');
            item.date = fd.get('date');
            item.cost = parseFloat(fd.get('cost')) || 0;
            item.weightLbs = weightLbs;
            item.adjustGrams = adjGrams;
            item.weightGrams = totalGrams;
            item.url = fd.get('url');
            showToast('Green bean order ' + item.orderId + ' updated.');
          } else {
            var newId = 'GB-' + (100 + state.greenBeanOrders.length + 1);
            var newOrder = {
              orderId: newId,
              date: fd.get('date'),
              name: fd.get('beanName'),
              supplier: fd.get('supplier'),
              supplierOrderId: fd.get('supplierOrderId'),
              cost: parseFloat(fd.get('cost')) || 0,
              weightLbs: weightLbs,
              adjustGrams: adjGrams,
              weightGrams: totalGrams,
              availableGrams: totalGrams,
              url: fd.get('url')
            };
            state.greenBeanOrders.unshift(newOrder);
            selectedId = newId;
            showToast('Recorded green bean order ' + newId + '.');
          }
        } else if (activeTab === 'roasts') {
          var greenGrams = parseInt(fd.get('greenWeightGrams'), 10) || 454;
          var endGrams = parseInt(fd.get('endWeightGrams'), 10) || 390;
          var lossPct = Number((((greenGrams - endGrams) / greenGrams) * 100).toFixed(1));

          if (isEditing && item) {
            item.date = fd.get('date');
            item.beanName = fd.get('beanName');
            item.roastLevel = fd.get('roastLevel');
            item.greenWeightGrams = greenGrams;
            item.endWeightGrams = endGrams;
            item.weightLossPct = lossPct;
            item.profileUrl = fd.get('profileUrl');
            item.notes = fd.get('notes');
            showToast('Roast log ' + item.roastId + ' updated.');
          } else {
            var newRoastId = 'R-' + (2040 + state.roastLogs.length + 1);
            var matchingOrder = state.greenBeanOrders.find(function (o) { return o.name === fd.get('beanName') && o.availableGrams > 0; }) || state.greenBeanOrders[0];
            var newRoast = {
              roastId: newRoastId,
              date: fd.get('date'),
              beanName: fd.get('beanName'),
              roastLevel: fd.get('roastLevel'),
              greenWeightGrams: greenGrams,
              endWeightGrams: endGrams,
              weightLossPct: lossPct,
              profileUrl: fd.get('profileUrl'),
              greenBeanComponents: [{ orderId: matchingOrder ? matchingOrder.orderId : 'GB-106', grams: greenGrams }],
              notes: fd.get('notes')
            };
            state.roastLogs.unshift(newRoast);
            selectedId = newRoastId;
            showToast('Recorded roast log ' + newRoastId + '.');
          }
        } else if (activeTab === 'packaging') {
          if (isEditing && item) {
            item.date = fd.get('date');
            item.purpose = fd.get('purpose');
            item.orderId = fd.get('orderId');
            item.product = fd.get('product');
            item.bagSize = fd.get('bagSize');
            item.notes = fd.get('notes');
            showToast('Packaging log ' + item.logId + ' updated.');
          } else {
            var newPkgId = 'PKG-' + (500 + state.blendPackagingLogs.length + 1);
            var newPkg = {
              logId: newPkgId,
              date: fd.get('date'),
              purpose: fd.get('purpose'),
              orderId: fd.get('orderId'),
              product: fd.get('product'),
              bagSize: fd.get('bagSize'),
              roastComponents: [{ roastId: state.roastLogs[0] ? state.roastLogs[0].roastId : 'R-2046', weightGrams: 340 }],
              notes: fd.get('notes')
            };
            state.blendPackagingLogs.unshift(newPkg);
            selectedId = newPkgId;
            showToast('Recorded packaging log ' + newPkgId + '.');
          }
        }

        isEditing = false;
        isNewEntry = false;
        render();
      });
    }

    render();
  }

  // ========================================================
  // Option 2: Visual Roastery Desk (Cards & Gauges)
  // ========================================================
  function initCardsPreview(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var activeTab = 'beans';
    var searchQuery = '';

    function render() {
      recomputeStocks();

      var actionBtnHtml = activeTab !== 'beans'
        ? '<button type="button" class="roast-preview-btn-primary" id="cards-add-btn">+ Record ' +
            (activeTab === 'orders' ? 'Order' : activeTab === 'roasts' ? 'Roast' : 'Packaging') + '</button>'
        : '';

      var html = '<div class="roast-preview-nav-bar">' +
        '  <div class="roast-preview-tabs">' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'beans' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="beans">Active Green Beans</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'orders' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="orders">Green Bean Orders</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'roasts' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="roasts">Roast Log</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'packaging' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="packaging">Master Blend &amp; Packaging</button>' +
        '  </div>' +
        '  <div class="roast-preview-search-wrap">' +
        '    <input type="search" placeholder="Filter cards..." id="cards-search-input" value="' + escapeHtml(searchQuery) + '">' +
        '  </div>' +
        '  <div class="roast-preview-actions">' + actionBtnHtml + '</div>' +
        '</div>' +
        '<div class="roast-cards-grid" id="cards-grid"></div>';

      container.innerHTML = html;

      var tabBtns = container.querySelectorAll('.roast-preview-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeTab = btn.getAttribute('data-tab');
          render();
        });
      });

      var addBtn = container.querySelector('#cards-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          openModalForm(activeTab, null, render);
        });
      }

      var searchInput = container.querySelector('#cards-search-input');
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.toLowerCase();
        renderGridOnly();
      });

      renderGridOnly();
    }

    function renderGridOnly() {
      var grid = container.querySelector('#cards-grid');
      var html = '';

      if (activeTab === 'beans') {
        var beans = state.greenBeans.filter(function (b) {
          return !searchQuery || b.name.toLowerCase().indexOf(searchQuery) !== -1;
        });

        beans.forEach(function (b) {
          var pct = Math.min(100, Math.round((b.activeStockGrams / b.totalPurchasedGrams) * 100));
          var fillModifier = b.activeStockGrams <= 0 ? 'stock-progress-fill--depleted' : (b.activeStockGrams < GRAMS_PER_LB * 2 ? 'stock-progress-fill--low' : '');

          html += '<div class="roast-deck-card">' +
            '  <div>' +
            '    <div class="deck-card-header">' +
            '      <div>' +
            '        <h4 class="deck-card-title">' + escapeHtml(b.name) + '</h4>' +
            '        <div class="deck-card-supplier">' + escapeHtml(b.supplier) + (b.url ? ' &bull; <a href="' + escapeHtml(b.url) + '" target="_blank" rel="noopener">Origin Info &nearr;</a>' : '') + '</div>' +
            '      </div>' +
            '      ' + getStatusBadge(b.status, b.activeStockGrams) +
            '    </div>' +
            '    <div class="deck-stock-bar-wrap">' +
            '      <div class="stock-label-row">' +
            '        <span>Active Stock Remaining</span>' +
            '        <strong>' + b.activeStockGrams.toLocaleString() + ' g (' + formatLbs(b.activeStockGrams) + ')</strong>' +
            '      </div>' +
            '      <div class="stock-progress-track">' +
            '        <div class="stock-progress-fill ' + fillModifier + '" style="width: ' + pct + '%;"></div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="deck-card-footer">' +
            '    <span style="color: #7d6b5e;">' + pct + '% of total purchased</span>' +
            '  </div>' +
            '</div>';
        });
      } else if (activeTab === 'orders') {
        var orders = state.greenBeanOrders.filter(function (o) {
          return !searchQuery || o.name.toLowerCase().indexOf(searchQuery) !== -1 || o.orderId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        orders.forEach(function (o) {
          var pct = Math.round((o.availableGrams / o.weightGrams) * 100);
          var fillModifier = o.availableGrams <= 0 ? 'stock-progress-fill--depleted' : (o.availableGrams < GRAMS_PER_LB * 2 ? 'stock-progress-fill--low' : '');

          html += '<div class="roast-deck-card">' +
            '  <div>' +
            '    <div class="deck-card-header">' +
            '      <div>' +
            '        <h4 class="deck-card-title">' + o.orderId + ' &bull; ' + escapeHtml(o.name) + '</h4>' +
            '        <div class="deck-card-supplier">' + escapeHtml(o.date) + ' &bull; ' + escapeHtml(o.supplier) + (o.supplierOrderId ? ' (' + escapeHtml(o.supplierOrderId) + ')' : '') + '</div>' +
            '      </div>' +
            '      <span class="stock-badge stock-badge--in-stock">$' + Number(o.cost).toFixed(2) + '</span>' +
            '    </div>' +
            '    <div class="deck-stock-bar-wrap">' +
            '      <div class="stock-label-row">' +
            '        <span>Available to Roast</span>' +
            '        <strong>' + o.availableGrams.toLocaleString() + ' g / ' + o.weightGrams.toLocaleString() + ' g</strong>' +
            '      </div>' +
            '      <div class="stock-progress-track">' +
            '        <div class="stock-progress-fill ' + fillModifier + '" style="width: ' + pct + '%;"></div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="deck-card-footer">' +
            '    <span style="color: #7d6b5e;">$' + (o.cost / o.weightLbs).toFixed(2) + ' / lb</span>' +
            '    <button type="button" class="roast-preview-btn-secondary" data-edit-order="' + o.orderId + '">Edit Order</button>' +
            '  </div>' +
            '</div>';
        });
      } else if (activeTab === 'roasts') {
        var roasts = state.roastLogs.filter(function (r) {
          return !searchQuery || r.beanName.toLowerCase().indexOf(searchQuery) !== -1 || r.roastId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        roasts.forEach(function (r) {
          var lvlLabel = ROAST_LEVEL_LABELS[String(r.roastLevel)] || r.roastLevel;
          html += '<div class="roast-deck-card">' +
            '  <div>' +
            '    <div class="deck-card-header">' +
            '      <div>' +
            '        <h4 class="deck-card-title">' + r.roastId + ' &bull; ' + escapeHtml(r.beanName) + '</h4>' +
            '        <div class="deck-card-supplier">' + escapeHtml(r.date) + ' &bull; ' + escapeHtml(lvlLabel) + '</div>' +
            '      </div>' +
            '      <span class="stock-badge stock-badge--low">-' + r.weightLossPct + '% Loss</span>' +
            '    </div>' +
            '    <div style="background: #faf6f0; border-radius: 6px; padding: 0.65rem 0.75rem; margin: 0.4rem 0; font-size: 0.8rem;">' +
            '      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">' +
            '        <span>Green: <strong>' + r.greenWeightGrams + 'g</strong></span>' +
            '        <span>Roasted: <strong>' + r.endWeightGrams + 'g</strong></span>' +
            '      </div>' +
            (r.notes ? '<div style="font-size: 0.74rem; color: #7d6b5e; font-style: italic;">"' + escapeHtml(r.notes) + '"</div>' : '') +
            '    </div>' +
            '  </div>' +
            '  <div class="deck-card-footer">' +
            (r.profileUrl ? '    <a href="' + escapeHtml(r.profileUrl) + '" target="_blank" rel="noopener" style="font-size: 0.76rem; font-weight: 600;">Artisan Curve &nearr;</a>' : '<span></span>') +
            '    <button type="button" class="roast-preview-btn-secondary" data-edit-roast="' + r.roastId + '">Edit Log</button>' +
            '  </div>' +
            '</div>';
        });
      } else if (activeTab === 'packaging') {
        var pkgs = state.blendPackagingLogs.filter(function (p) {
          return !searchQuery || p.product.toLowerCase().indexOf(searchQuery) !== -1 || p.logId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        pkgs.forEach(function (p) {
          html += '<div class="roast-deck-card">' +
            '  <div>' +
            '    <div class="deck-card-header">' +
            '      <div>' +
            '        <h4 class="deck-card-title">' + p.logId + ' &bull; ' + escapeHtml(p.product) + '</h4>' +
            '        <div class="deck-card-supplier">' + escapeHtml(p.date) + ' &bull; <strong>' + escapeHtml(p.bagSize) + '</strong></div>' +
            '      </div>' +
            '      <span class="stock-badge stock-badge--in-stock">' + p.purpose + '</span>' +
            '    </div>' +
            '    <div style="margin: 0.5rem 0; font-size: 0.78rem; color: #554439;">' +
            '      <div style="font-weight: 600; margin-bottom: 0.2rem;">Roast Batches:</div>' +
            '      <div>' + (p.roastComponents || []).map(function (c) { return '&bull; ' + c.roastId + ' (' + c.weightGrams + 'g)'; }).join('<br>') + '</div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="deck-card-footer">' +
            '    <span style="color: #7d6b5e;">' + (p.orderId ? 'Order #' + p.orderId : 'In-House') + '</span>' +
            '    <button type="button" class="roast-preview-btn-secondary" data-edit-pkg="' + p.logId + '">Edit Log</button>' +
            '  </div>' +
            '</div>';
        });
      }

      grid.innerHTML = html;

      grid.querySelectorAll('[data-edit-order]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('orders', b.getAttribute('data-edit-order'), render); });
      });
      grid.querySelectorAll('[data-edit-roast]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('roasts', b.getAttribute('data-edit-roast'), render); });
      });
      grid.querySelectorAll('[data-edit-pkg]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('packaging', b.getAttribute('data-edit-pkg'), render); });
      });
    }

    render();
  }

  // ========================================================
  // Option 3: Streamlined Minimal Ledger (Compact Clean Table)
  // ========================================================
  function initLedgerPreview(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var activeTab = 'beans';
    var searchQuery = '';

    function render() {
      recomputeStocks();

      var actionBtnHtml = activeTab !== 'beans'
        ? '<button type="button" class="roast-preview-btn-primary" id="ledger-add-btn">+ Record ' +
            (activeTab === 'orders' ? 'Order' : activeTab === 'roasts' ? 'Roast' : 'Packaging') + '</button>'
        : '';

      var html = '<div class="roast-preview-nav-bar">' +
        '  <div class="roast-preview-tabs">' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'beans' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="beans">Active Green Beans</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'orders' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="orders">Green Bean Orders</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'roasts' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="roasts">Roast Log</button>' +
        '    <button type="button" class="roast-preview-tab-btn ' + (activeTab === 'packaging' ? 'roast-preview-tab-btn--active' : '') + '" data-tab="packaging">Master Blend &amp; Packaging</button>' +
        '  </div>' +
        '  <div class="roast-preview-search-wrap">' +
        '    <input type="search" placeholder="Quick filter ledger..." id="ledger-search-input" value="' + escapeHtml(searchQuery) + '">' +
        '  </div>' +
        '  <div class="roast-preview-actions">' + actionBtnHtml + '</div>' +
        '</div>' +
        '<div class="roast-ledger-wrap" id="ledger-table-wrap"></div>';

      container.innerHTML = html;

      var tabBtns = container.querySelectorAll('.roast-preview-tab-btn');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeTab = btn.getAttribute('data-tab');
          render();
        });
      });

      var addBtn = container.querySelector('#ledger-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          openModalForm(activeTab, null, render);
        });
      }

      var searchInput = container.querySelector('#ledger-search-input');
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.toLowerCase();
        renderTableOnly();
      });

      renderTableOnly();
    }

    function renderTableOnly() {
      var wrap = container.querySelector('#ledger-table-wrap');
      var html = '<table class="roast-ledger-table">';

      if (activeTab === 'beans') {
        html += '<thead><tr>' +
          '<th>Green Bean &amp; Supplier</th>' +
          '<th>Stock Status</th>' +
          '<th style="text-align: right;">Active Stock</th>' +
          '<th style="text-align: right;">Capacity Left</th>' +
          '</tr></thead><tbody>';

        var beans = state.greenBeans.filter(function (b) {
          return !searchQuery || b.name.toLowerCase().indexOf(searchQuery) !== -1;
        });

        beans.forEach(function (b) {
          var pct = Math.round((b.activeStockGrams / b.totalPurchasedGrams) * 100);
          html += '<tr>' +
            '<td class="primary-cell">' +
            '  <div>' + escapeHtml(b.name) + '</div>' +
            '  <div class="cell-sub">' + escapeHtml(b.supplier) + (b.url ? ' &bull; <a href="' + escapeHtml(b.url) + '" target="_blank" rel="noopener">Origin Page &nearr;</a>' : '') + '</div>' +
            '</td>' +
            '<td>' + getStatusBadge(b.status, b.activeStockGrams) + '</td>' +
            '<td style="text-align: right;" class="metric-chip">' + b.activeStockGrams.toLocaleString() + ' g <span style="color:#8a7060; font-size:0.75rem;">(' + formatLbs(b.activeStockGrams) + ')</span></td>' +
            '<td style="text-align: right;" class="metric-chip">' + pct + '%</td>' +
            '</tr>';
        });
      } else if (activeTab === 'orders') {
        html += '<thead><tr>' +
          '<th>Order &amp; Date</th>' +
          '<th>Bean &amp; Supplier</th>' +
          '<th>Starting Weight &amp; Cost</th>' +
          '<th style="text-align: right;">Stock Remaining</th>' +
          '<th style="text-align: right;">Actions</th>' +
          '</tr></thead><tbody>';

        var orders = state.greenBeanOrders.filter(function (o) {
          return !searchQuery || o.name.toLowerCase().indexOf(searchQuery) !== -1 || o.orderId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        orders.forEach(function (o) {
          html += '<tr>' +
            '<td class="primary-cell">' +
            '  <div>' + o.orderId + '</div>' +
            '  <div class="cell-sub">' + escapeHtml(o.date) + (o.supplierOrderId ? ' &bull; PO: ' + escapeHtml(o.supplierOrderId) : '') + '</div>' +
            '</td>' +
            '<td>' + escapeHtml(o.name) + '<div class="cell-sub">' + escapeHtml(o.supplier) + '</div></td>' +
            '<td class="metric-chip">' + o.weightLbs + ' lbs ($' + Number(o.cost).toFixed(2) + ')</td>' +
            '<td style="text-align: right;" class="metric-chip" style="color: ' + (o.availableGrams > 0 ? '#27ae60' : '#c0392b') + '">' + o.availableGrams.toLocaleString() + ' g left</td>' +
            '<td style="text-align: right;"><button type="button" class="roast-preview-btn-secondary" data-edit-order="' + o.orderId + '">Edit</button></td>' +
            '</tr>';
        });
      } else if (activeTab === 'roasts') {
        html += '<thead><tr>' +
          '<th>Batch &amp; Date</th>' +
          '<th>Bean &amp; Roast Level</th>' +
          '<th>Yield &amp; Weight Loss</th>' +
          '<th>Notes</th>' +
          '<th style="text-align: right;">Action</th>' +
          '</tr></thead><tbody>';

        var roasts = state.roastLogs.filter(function (r) {
          return !searchQuery || r.beanName.toLowerCase().indexOf(searchQuery) !== -1 || r.roastId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        roasts.forEach(function (r) {
          var lvlLabel = ROAST_LEVEL_LABELS[String(r.roastLevel)] || r.roastLevel;
          html += '<tr>' +
            '<td class="primary-cell">' +
            '  <div>' + r.roastId + '</div>' +
            '  <div class="cell-sub">' + escapeHtml(r.date) + '</div>' +
            '</td>' +
            '<td><strong>' + escapeHtml(r.beanName) + '</strong><div class="cell-sub">Level: ' + escapeHtml(lvlLabel) + '</div></td>' +
            '<td class="metric-chip">' + r.greenWeightGrams + 'g &rarr; ' + r.endWeightGrams + 'g <span style="color:#d35400;">(-' + r.weightLossPct + '%)</span></td>' +
            '<td style="font-size: 0.78rem; color: #554439; max-width: 18rem;">' + escapeHtml(r.notes || '—') + '</td>' +
            '<td style="text-align: right;"><button type="button" class="roast-preview-btn-secondary" data-edit-roast="' + r.roastId + '">Edit</button></td>' +
            '</tr>';
        });
      } else if (activeTab === 'packaging') {
        html += '<thead><tr>' +
          '<th>Package Log &amp; Date</th>' +
          '<th>Product &amp; Destination</th>' +
          '<th>Bag Size &amp; Weight</th>' +
          '<th>Roast Batches Used</th>' +
          '<th style="text-align: right;">Action</th>' +
          '</tr></thead><tbody>';

        var pkgs = state.blendPackagingLogs.filter(function (p) {
          return !searchQuery || p.product.toLowerCase().indexOf(searchQuery) !== -1 || p.logId.toLowerCase().indexOf(searchQuery) !== -1;
        });

        pkgs.forEach(function (p) {
          var compIds = (p.roastComponents || []).map(function (c) { return c.roastId; }).join(' + ');
          html += '<tr>' +
            '<td class="primary-cell">' +
            '  <div>' + p.logId + '</div>' +
            '  <div class="cell-sub">' + escapeHtml(p.date) + '</div>' +
            '</td>' +
            '<td><strong>' + escapeHtml(p.product) + '</strong><div class="cell-sub">' + p.purpose + (p.orderId ? ' (Order #' + p.orderId + ')' : '') + '</div></td>' +
            '<td class="metric-chip">' + escapeHtml(p.bagSize) + '</td>' +
            '<td style="font-size: 0.78rem; color: #554439;">' + compIds + '</td>' +
            '<td style="text-align: right;"><button type="button" class="roast-preview-btn-secondary" data-edit-pkg="' + p.logId + '">Edit</button></td>' +
            '</tr>';
        });
      }

      html += '</tbody></table>';
      wrap.innerHTML = html;

      wrap.querySelectorAll('[data-edit-order]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('orders', b.getAttribute('data-edit-order'), render); });
      });
      wrap.querySelectorAll('[data-edit-roast]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('roasts', b.getAttribute('data-edit-roast'), render); });
      });
      wrap.querySelectorAll('[data-edit-pkg]').forEach(function (b) {
        b.addEventListener('click', function () { openModalForm('packaging', b.getAttribute('data-edit-pkg'), render); });
      });
    }

    render();
  }

  // ========================================================
  // Shared Modal Dialog Form (for Option 2 & Option 3)
  // ========================================================
  function openModalForm(tab, editId, onSavedCallback) {
    var overlay = document.createElement('div');
    overlay.className = 'roast-preview-modal-overlay';

    var modal = document.createElement('div');
    modal.className = 'roast-preview-modal';

    var item = null;
    if (editId) {
      if (tab === 'orders') item = state.greenBeanOrders.find(function (o) { return o.orderId === editId; });
      else if (tab === 'roasts') item = state.roastLogs.find(function (r) { return r.roastId === editId; });
      else if (tab === 'packaging') item = state.blendPackagingLogs.find(function (p) { return p.logId === editId; });
    }

    var title = (item ? 'Edit ' : 'Record ') +
      (tab === 'orders' ? 'Green Bean Order' : tab === 'roasts' ? 'Roast Log' : 'Master Blend & Packaging');

    var formHtml = '<form class="roast-studio-form">' +
      '<div class="studio-form-header">' +
      '  <h4>' + title + '</h4>' +
      '  <button type="button" class="roast-preview-btn-secondary" id="modal-close-btn" style="padding:0.25rem 0.55rem; font-size:0.74rem;">&times;</button>' +
      '</div>';

    if (tab === 'orders') {
      var defaultBean = item ? item.name : (state.greenBeans[0] ? state.greenBeans[0].name : '');
      var defaultDate = item ? item.date : new Date().toISOString().slice(0, 10);
      formHtml += '<div class="studio-field-group">' +
        '  <div class="studio-field" style="flex:1.4;">' +
        '    <label>Green Bean</label>' +
        '    <select name="beanName" required>' +
        state.greenBeans.map(function (b) {
          return '<option value="' + escapeHtml(b.name) + '" ' + (b.name === defaultBean ? 'selected' : '') + '>' + escapeHtml(b.name) + '</option>';
        }).join('') +
        '    </select>' +
        '  </div>' +
        '  <div class="studio-field" style="flex:1;">' +
        '    <label>Supplier</label>' +
        '    <input type="text" name="supplier" value="' + escapeHtml(item ? item.supplier : 'Roastmasters') + '" required>' +
        '  </div>' +
        '</div>' +
        '<div class="studio-field-group">' +
        '  <div class="studio-field">' +
        '    <label>Supplier PO / Order #</label>' +
        '    <input type="text" name="supplierOrderId" value="' + escapeHtml(item ? item.supplierOrderId || '' : '') + '">' +
        '  </div>' +
        '  <div class="studio-field">' +
        '    <label>Order Date</label>' +
        '    <input type="date" name="date" value="' + defaultDate + '" required>' +
        '  </div>' +
        '</div>' +
        '<div class="studio-field-group">' +
        '  <div class="studio-field">' +
        '    <label>Cost ($)</label>' +
        '    <input type="number" step="0.01" min="0" name="cost" value="' + (item ? item.cost : '45.00') + '" required>' +
        '  </div>' +
        '  <div class="studio-field">' +
        '    <label>Weight (lbs)</label>' +
        '    <input type="number" step="0.1" min="0.1" name="weightLbs" value="' + (item ? item.weightLbs : '10') + '" required>' +
        '  </div>' +
        '  <div class="studio-field">' +
        '    <label>Adj (g)</label>' +
        '    <input type="number" step="1" name="adjustGrams" value="' + (item ? item.adjustGrams : '0') + '">' +
        '  </div>' +
        '</div>';
    } else if (tab === 'roasts') {
      var defaultRoastDate = item ? item.date : new Date().toISOString().slice(0, 10);
      var defaultRoastBean = item ? item.beanName : (state.greenBeans[0] ? state.greenBeans[0].name : '');
      var defaultLvl = item ? String(item.roastLevel) : '2';

      formHtml += '<div class="studio-field-group">' +
        '  <div class="studio-field" style="flex:1.2;">' +
        '    <label>Roast Date</label>' +
        '    <input type="date" name="date" value="' + defaultRoastDate + '" required>' +
        '  </div>' +
        '  <div class="studio-field" style="flex:1.4;">' +
        '    <label>Roast Level</label>' +
        '    <select name="roastLevel">' +
        Object.keys(ROAST_LEVEL_LABELS).map(function (k) {
          return '<option value="' + k + '" ' + (k === defaultLvl ? 'selected' : '') + '>' + ROAST_LEVEL_LABELS[k] + '</option>';
        }).join('') +
        '    </select>' +
        '  </div>' +
        '</div>' +
        '<div class="studio-field-group">' +
        '  <div class="studio-field" style="flex:1.4;">' +
        '    <label>Bean Roasted</label>' +
        '    <select name="beanName">' +
        state.greenBeans.map(function (b) {
          return '<option value="' + escapeHtml(b.name) + '" ' + (b.name === defaultRoastBean ? 'selected' : '') + '>' + escapeHtml(b.name) + '</option>';
        }).join('') +
        '    </select>' +
        '  </div>' +
        '  <div class="studio-field" style="flex:1;">' +
        '    <label>Green (g)</label>' +
        '    <input type="number" name="greenWeightGrams" value="' + (item ? item.greenWeightGrams : '454') + '" min="1" required>' +
        '  </div>' +
        '  <div class="studio-field" style="flex:1;">' +
        '    <label>End (g)</label>' +
        '    <input type="number" name="endWeightGrams" value="' + (item ? item.endWeightGrams : '390') + '" min="1" required>' +
        '  </div>' +
        '</div>' +
        '<div class="studio-field">' +
        '  <label>Notes</label>' +
        '  <input type="text" name="notes" value="' + escapeHtml(item ? item.notes : '') + '" placeholder="Batch notes...">' +
        '</div>';
    } else if (tab === 'packaging') {
      var defaultPkgDate = item ? item.date : new Date().toISOString().slice(0, 10);
      formHtml += '<div class="studio-field-group">' +
        '  <div class="studio-field">' +
        '    <label>Date</label>' +
        '    <input type="date" name="date" value="' + defaultPkgDate + '" required>' +
        '  </div>' +
        '  <div class="studio-field">' +
        '    <label>Purpose</label>' +
        '    <select name="purpose">' +
        '      <option value="Order" ' + (item && item.purpose === 'Order' ? 'selected' : '') + '>Customer Order</option>' +
        '      <option value="Sample" ' + (item && item.purpose === 'Sample' ? 'selected' : '') + '>Sample</option>' +
        '      <option value="Personal" ' + (item && item.purpose === 'Personal' ? 'selected' : '') + '>Personal</option>' +
        '    </select>' +
        '  </div>' +
        '</div>' +
        '<div class="studio-field-group">' +
        '  <div class="studio-field" style="flex:1.4;">' +
        '    <label>Product Label</label>' +
        '    <input type="text" name="product" value="' + escapeHtml(item ? item.product : 'Early Bird Blend') + '" required>' +
        '  </div>' +
        '  <div class="studio-field" style="flex:1;">' +
        '    <label>Bag Size</label>' +
        '    <select name="bagSize">' +
        '      <option value="12oz">12oz</option>' +
        '      <option value="1lb">1lb</option>' +
        '      <option value="2lb">2lb</option>' +
        '      <option value="5lb">5lb</option>' +
        '      <option value="Custom">Custom</option>' +
        '    </select>' +
        '  </div>' +
        '</div>';
    }

    formHtml += '<div class="studio-form-actions">' +
      '  <button type="submit" class="roast-preview-btn-primary">Save Changes</button>' +
      '  <button type="button" class="roast-preview-btn-secondary" id="modal-cancel-btn">Cancel</button>' +
      '</div>' +
      '</form>';

    modal.innerHTML = formHtml;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var close = function () { overlay.remove(); };
    modal.querySelector('#modal-close-btn').addEventListener('click', close);
    modal.querySelector('#modal-cancel-btn').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    modal.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);

      if (tab === 'orders') {
        var weightLbs = parseFloat(fd.get('weightLbs')) || 0;
        var adjGrams = parseInt(fd.get('adjustGrams'), 10) || 0;
        var totalGrams = Math.round(weightLbs * GRAMS_PER_LB + adjGrams);

        if (item) {
          item.name = fd.get('beanName');
          item.supplier = fd.get('supplier');
          item.supplierOrderId = fd.get('supplierOrderId');
          item.date = fd.get('date');
          item.cost = parseFloat(fd.get('cost')) || 0;
          item.weightLbs = weightLbs;
          item.adjustGrams = adjGrams;
          item.weightGrams = totalGrams;
        } else {
          var newId = 'GB-' + (100 + state.greenBeanOrders.length + 1);
          state.greenBeanOrders.unshift({
            orderId: newId,
            date: fd.get('date'),
            name: fd.get('beanName'),
            supplier: fd.get('supplier'),
            supplierOrderId: fd.get('supplierOrderId'),
            cost: parseFloat(fd.get('cost')) || 0,
            weightLbs: weightLbs,
            adjustGrams: adjGrams,
            weightGrams: totalGrams,
            availableGrams: totalGrams
          });
        }
      } else if (tab === 'roasts') {
        var greenGrams = parseInt(fd.get('greenWeightGrams'), 10) || 454;
        var endGrams = parseInt(fd.get('endWeightGrams'), 10) || 390;
        var lossPct = Number((((greenGrams - endGrams) / greenGrams) * 100).toFixed(1));

        if (item) {
          item.date = fd.get('date');
          item.beanName = fd.get('beanName');
          item.roastLevel = fd.get('roastLevel');
          item.greenWeightGrams = greenGrams;
          item.endWeightGrams = endGrams;
          item.weightLossPct = lossPct;
          item.notes = fd.get('notes');
        } else {
          var newRoastId = 'R-' + (2040 + state.roastLogs.length + 1);
          state.roastLogs.unshift({
            roastId: newRoastId,
            date: fd.get('date'),
            beanName: fd.get('beanName'),
            roastLevel: fd.get('roastLevel'),
            greenWeightGrams: greenGrams,
            endWeightGrams: endGrams,
            weightLossPct: lossPct,
            greenBeanComponents: [{ orderId: 'GB-106', grams: greenGrams }],
            notes: fd.get('notes')
          });
        }
      } else if (tab === 'packaging') {
        if (item) {
          item.date = fd.get('date');
          item.purpose = fd.get('purpose');
          item.product = fd.get('product');
          item.bagSize = fd.get('bagSize');
        } else {
          var newPkgId = 'PKG-' + (500 + state.blendPackagingLogs.length + 1);
          state.blendPackagingLogs.unshift({
            logId: newPkgId,
            date: fd.get('date'),
            purpose: fd.get('purpose'),
            product: fd.get('product'),
            bagSize: fd.get('bagSize'),
            roastComponents: [{ roastId: 'R-2046', weightGrams: 340 }]
          });
        }
      }

      showToast('Changes saved.');
      close();
      if (onSavedCallback) onSavedCallback();
    });
  }

  // Global exports
  window.initStudioPreview = initStudioPreview;
  window.initCardsPreview = initCardsPreview;
  window.initLedgerPreview = initLedgerPreview;
})();
