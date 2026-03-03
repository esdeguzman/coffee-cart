class PromoBanner extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    const style = document.createElement('style');
    wrapper.setAttribute('data-test', 'promo-banner');
    style.textContent = `
      :host {
        display: block;
        margin: 16px 0;
      }
      .banner {
        padding: 12px 16px;
        border: 2px solid #222;
        background: #fff8dc;
        color: #333;
        font-weight: 600;
      }
    `;
    wrapper.className = 'banner';
    wrapper.textContent = this.getAttribute('message') || 'Promo banner in Shadow DOM';
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name !== 'message') return;
    if (this.shadowRoot) {
      const el = this.shadowRoot.querySelector('.banner') as HTMLDivElement | null;
      if (el) el.textContent = newValue || '';
    }
  }
}
if (!customElements.get('promo-banner')) {
  customElements.define('promo-banner', PromoBanner);
}
