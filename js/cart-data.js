---
permalink: /js/cart-data.js
---
/**
 * Yellow Wing Roasters - Shared Catalog Data for Cart & Orders
 * Generated at build time and cached across pages.
 */
window.YWR_ROASTS_DATA = {
  {% for r in site.roasts %}
    {{ r.slug | jsonify }}: {
      title: {{ r.title | jsonify }},
      mascot: {{ r.mascot_file | jsonify }},
      variants: {
        {% if r.variants %}
          {% for v in r.variants %}
            {{ v.slug | jsonify }}: {{ v.name | jsonify }}{% unless forloop.last %},{% endunless %}
          {% endfor %}
        {% endif %}
      },
      prices: {
        {% assign rp = r.price | default: r.prices %}
        {% for entry in rp %}
          {% assign s = entry[0] %}
          {% if r.sizes == nil or r.sizes contains s %}
            {% assign p = entry[1] %}
            {% if r.temporary_price and r.temporary_price[s] %}{% assign p = r.temporary_price[s] %}{% endif %}
            {{ s | jsonify }}: {{ p }}{% unless forloop.last %},{% endunless %}
          {% endif %}
        {% endfor %}
      }
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};
