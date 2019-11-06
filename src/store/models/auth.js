import api from 'services/api'

const initAuthState = {
  token: null,
  profile: {},
  logined: false,
}

export default {
  state: initAuthState,
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    logout: (state, payload) => (initAuthState),
  },
  effects: {
    async reload (payload, rootState) {
      const {auth} = rootState
      if (!auth.logined) {
        return
      }

      await this.loadUser()
    },
    async login ({token, profile}) {
      this.update({
        profile: profile,
        token: token,
        logined: true,
      })
    },
    async loadUser () {
      try {
        const ret = await api.getUserInfo()
        const profile = ret.data
        this.update({
          profile: profile,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}