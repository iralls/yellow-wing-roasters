---
permalink: /js/cart-data.js
---
/**
 * Yellow Wing Roasters - Shared Catalog Data for Cart & Orders
 * Generated at build time and cached across pages.
 */
window.YWR_ROASTS_DATA = {
  {% for r in site.roasts %}
    {% assign r_level_key = r.roast_level | append: "" %}
    {% assign level_info = site.data.roast_levels[r.roast_level] | default: site.data.roast_levels[r_level_key] %}
    {% if level_info %}{% assign r_dots = level_info.dots %}{% else %}{% assign r_dots = r.roast_dots | default: 0 %}{% endif %}
    {{ r.slug | jsonify }}: {
      title: {{ r.title | jsonify }},
      mascot: {{ r.mascot_file | jsonify }},
      dots: {{ r_dots }},
      description: {{ r.description | default: "" | jsonify }},
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
