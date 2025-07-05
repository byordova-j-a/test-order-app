import { defineStore } from 'pinia';
import { type TOrder, EOrderStatus, type TFileData } from '~/types';
type TOrderStore = {
  currentOrder: TOrder;
};

export const useOrderStore = defineStore('order', {
  state: (): TOrderStore => {
    return {
      currentOrder: {
        title: '',
        description: '',
        producer: '',
        organization: '',
        status: EOrderStatus.DRAFT,
        image: null,
        attachedFiles: []
      }
    };
  },
  getters: {
    getCurrentOrder: (state) => state.currentOrder
  },
  actions: {
    fetchCurrentOrder() {
      const formData = JSON.parse(localStorage.getItem('formData') || 'null');
      if (formData) {
        this.currentOrder = formData;
      } else {
        this.currentOrder = {
          title: 'order-title',
          description: 'description    description',
          producer: 'producer',
          organization: 'organization',
          status: EOrderStatus.COMPLETED,
          image: null,
          attachedFiles: []
        };
      }
    },

    updateCurrentOrder(formData: FormData) {
      const obj = Object.fromEntries(formData);

      const attachedFiles: TFileData[] = (formData.getAll('attachedFiles') as TFileData[]).map(({ name, type }) => ({
        name,
        type
      }));

      this.currentOrder = { ...obj, attachedFiles } as TOrder;
      localStorage.setItem('formData', JSON.stringify({ ...obj, attachedFiles }));
    }
  }
});
