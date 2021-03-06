import Vue from 'vue'

import './styles/quasar.scss'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QInput,
  QSpace,
  QSpinnerHourglass,
  QSpinnerGears,
  QField,
  QSlider,
  QSelect,
  QCircularProgress,
  QOptionGroup,
  QRadio,
  QSkeleton,
  QList,
  QItem,
  QItemSection,
  QItemLabel
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QInput,
    QSpace,
    QSpinnerHourglass,
    QSpinnerGears,
    QField,
    QSlider,
    QSelect,
    QCircularProgress,
    QOptionGroup,
    QRadio,
    QSkeleton,
    QList,
    QItem,
    QItemSection,
    QItemLabel
  },
  directives: {
  },
  plugins: {
  }
})
