Component({
  properties: {
    businessCard: {
      type: Object,
      value: {}
    },
    showActions: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    }
  },

  data: {
    displayCard: {}
  },

  observers: {
    'businessCard': function(card) {
      this.setData({
        displayCard: card || {}
      });
    }
  },

  methods: {
    onEdit() {
      this.triggerEvent('edit');
    },

    onShare() {
      this.triggerEvent('share');
    },

    onViewDetail() {
      this.triggerEvent('viewDetail');
    },

    onCardClick() {
      this.triggerEvent('cardClick', {
        card: this.data.displayCard
      });
    }
  }
});
