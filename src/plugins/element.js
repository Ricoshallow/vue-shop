import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// //弹框提示组件
// import { Message } from 'element-ui'


import { Timeline, TimelineItem, Upload, Checkbox, CheckboxGroup, Step, Steps, TabPane, Tabs, Cascader, Select, Option, Tree, Tag, Row, Col, MessageBox, Alert, Dialog, Pagination, Tooltip, Switch, TableColumn, Message, Button, Form, FormItem, Input, Container, Main, Aside, Header, Menu, Submenu, MenuItem, MenuItemGroup,Breadcrumb, BreadcrumbItem, Card, Table } from 'element-ui'
// import Timeline from './timeline/index.js'
// import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


//全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

