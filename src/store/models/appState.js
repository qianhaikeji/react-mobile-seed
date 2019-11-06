export default {
  state: {
    ready: false,
  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    startup: (state) => {
      return { 
        ...state, 
        ready: true 
      }
    }
  }
}