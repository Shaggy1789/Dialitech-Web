import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import PermissionWrapper from '../../src/components/PermissionWrapper.vue';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';

function seedPlan(plan) {
  setActivePinia(createPinia());
  const sub = useSubscriptionStore();
  sub.setPlan(plan);
  return sub;
}

describe('PermissionWrapper (acceso por plan)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('renderiza el slot por defecto cuando el plan tiene la feature', () => {
    seedPlan('Pro');
    const wrapper = mount(PermissionWrapper, {
      props: { feature: 'ai' },
      slots: { default: '<span data-test="content">IA activa</span>' },
    });

    expect(wrapper.find('[data-test="content"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('IA activa');
  });

  it('oculta el slot y muestra el bloqueo cuando el plan no tiene la feature', () => {
    seedPlan('Standard');
    const wrapper = mount(PermissionWrapper, {
      props: { feature: 'ai' },
      slots: { default: '<span data-test="content">IA activa</span>' },
    });

    expect(wrapper.find('[data-test="content"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('bloqueada');
  });

  it('emite openModal al pulsar el card bloqueado', async () => {
    seedPlan('Standard');
    const wrapper = mount(PermissionWrapper, {
      props: { feature: 'ai' },
    });

    await wrapper.find('.locked-card').trigger('click');
    expect(wrapper.emitted('openModal')).toBeTruthy();
    expect(wrapper.emitted('openModal')[0]).toEqual(['ai']);
  });
});