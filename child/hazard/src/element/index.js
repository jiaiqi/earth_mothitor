import Vue from 'vue'
import {
  Aside,
  Main,
  Card,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Container,
  Tree,
  Checkbox,
  Input,
  Button,
  Radio,
  RadioGroup,
  Select,
  Option,
  CheckboxGroup,
  Form,
  FormItem,
  Notification,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Dialog,
  Message,
  Breadcrumb,
  BreadcrumbItem
} from 'element-ui'
Vue.use(Aside)
Vue.use(Main)
Vue.use(Card)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Container)
Vue.use(Tree)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Input)
Vue.use(Button)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dialog)
Vue.use(Message)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.prototype.$notify = Notification
