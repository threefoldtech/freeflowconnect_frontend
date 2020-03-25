import Vue from 'vue'
import Vuex from 'vuex'

import ExampleStore from '../stores/ExampleStore'
import MessageStore from '../stores/MessageStore'
import JanusStore from '../stores/JanusStore'
import AuthStore from '../stores/AuthStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        ExampleStore,
        MessageStore,
        JanusStore,
        AuthStore
    }
})
