'use strict';

import VueComponent from 'vue-class-component'

@VueComponent({
    template: require('./UsersTable.html')
})
export default class {
    data(): { msg: string } {
        return {
            msg: 'Hello World!'
        }
    }
}
