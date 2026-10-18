<template>
  <!--
    Baris ikon sosial untuk halaman publik (landing).
    Hanya link yang benar-benar terisi yang dirender (parent menyaring
    kolom kosong dari sys_configuration_mst), jadi tidak pernah muncul
    ikon tanpa tujuan.
  -->
  <ul v-if="links && links.length" class="social-icons" aria-label="Media sosial">
    <li v-for="item in links" :key="item.key">
      <a
        class="social-icons__link"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="item.label"
        :title="item.label"
      >
        <span class="social-icons__icon" aria-hidden="true" v-html="icon(item.key)"></span>
        <span class="social-icons__label">{{ label(item) }}</span>
      </a>
    </li>
  </ul>
</template>

<script>
// Ikon garis (stroke) 24x24 — memakai currentColor supaya warna ikut teks.
const ICONS = {
  tiktok:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3v9.5a4.5 4.5 0 1 1-4-4.47"/><path d="M16 3c.6 2.6 2.3 4.2 5 4.5"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  other:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.2 9h17.6M3.2 15h17.6"/><path d="M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/></svg>',
};

export default {
  name: 'SocialIcons',
  props: {
    // [{ key: 'tiktok'|'instagram'|'other', label, url }]
    links: { type: Array, default: () => [] },
  },
  methods: {
    icon(key) {
      return ICONS[key] || ICONS.other;
    },
    // Tampilkan URL tanpa skema sebagai label (mis. instagram.com/xxx).
    label(item) {
      const raw = item.label || item.url || '';
      return String(raw).replace(/^https?:\/\//, '').replace(/\/$/, '');
    },
  },
};
</script>

<style scoped>
.social-icons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.social-icons__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
  opacity: 0.9;
  transition: opacity 0.15s ease;
}
.social-icons__link:hover {
  opacity: 1;
  text-decoration: underline;
}
.social-icons__icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}
.social-icons__icon :deep(svg) {
  width: 16px;
  height: 16px;
}
.social-icons__label {
  line-height: 1.2;
  word-break: break-all;
}
</style>
