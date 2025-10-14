Component({
  properties: {
    avatar: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    username: {
      type: String,
      value: ''
    },
    company: {
      type: String,
      value: ''
    },
    position: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      value: 'medium' // small, medium, large
    },
    showName: {
      type: Boolean,
      value: true
    },
    showCompany: {
      type: Boolean,
      value: false
    },
    showPosition: {
      type: Boolean,
      value: false
    }
  },

  data: {},

  methods: {}
});
