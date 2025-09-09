Component({
  externalClasses: ['wr-class'],

  properties: {
    newsList: {
      type: Array,
      value: [],
    },
    id: {
      type: String,
      value: '',
      observer: (id) => {
        this.genIndependentID(id);
      },
    },
    thresholds: {
      type: Array,
      value: [],
    },
  },

  data: {
    independentID: '',
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  methods: {
    onClickNews(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { ...e.detail, index });
    },

    onClickNewsThumb(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('thumb', { ...e.detail, index });
    },

    init() {
      this.genIndependentID(this.id || '');
    },

    genIndependentID(id) {
      if (id) {
        this.setData({ independentID: id });
      } else {
        this.setData({
          independentID: `news-list-${~~(Math.random() * 10 ** 8)}`,
        });
      }
    },
  },
});
