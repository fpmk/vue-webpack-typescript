'use strict';

import VueComponent from 'vue-class-component';

import UsersTable from './components/userstable/UsersTable';

require('./App.css');

@VueComponent({
    template: require('./App.html'),
    components: {
        UsersTable
    }
})
export default class {
}
