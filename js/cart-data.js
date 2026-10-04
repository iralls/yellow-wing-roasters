---
permalink: /js/cart-data.js
---
/**
 * Yellow Wing Roasters - Shared Catalog Data for Cart & Orders
 * Generated at build time and cached across pages.
 */
window.YWR_ROASTS_DATA = {
  {% for r in site.roasts %}
    {% assign level_info = site.data.roast_levels[r.roast_level] %}
    {% assign r_specialty = level_info.specialty %}
    {% assign r_dots = level_info.dots %}
    {{ r.slug | jsonify }}: {
      title: {{ r.title | jsonify }},
      category: {{ r.category | jsonify }},
      roast_level: {{ r.roast_level | jsonify }},
      roast_level_name: {{ r_specialty | jsonify }},
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
        {% assign rp = r.price %}
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

window.YWR_SUBSCRIPTIONS_DATA = {
  {% for s in site.subscriptions %}
    {{ s.slug | jsonify }}: {
      title: {{ s.title | jsonify }},
      subtitle: {{ s.subtitle | jsonify }},
      mascot: {{ s.mascot_file | jsonify }},
      sizes: {{ s.sizes | jsonify }},
      frequencies: {{ s.frequencies | jsonify }},
      prices: {
        {% for entry in s.price %}
          {{ entry[0] | jsonify }}: {{ entry[1] }}{% unless forloop.last %},{% endunless %}
        {% endfor %}
      }
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

window.YWR_ROAST_LEVELS = {
  {% for lvl_num in (1..5) %}
    {% assign lvl_num_str = lvl_num | append: "" %}
    {% assign lvl_data = site.data.roast_levels[lvl_num] | default: site.data.roast_levels[lvl_num_str] %}
    {{ lvl_num | jsonify }}: {
      name: {{ lvl_data.specialty | default: lvl_data.name | jsonify }},
      full_name: {{ lvl_data.name | jsonify }},
      dots: {{ lvl_data.dots }},
      layman: {{ lvl_data.layman | jsonify }},
      specialty: {{ lvl_data.specialty | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};
