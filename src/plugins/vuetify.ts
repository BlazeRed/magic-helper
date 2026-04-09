import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const DEFAULT_ACCENT = '#e53935'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: DEFAULT_ACCENT,
          background: '#121212',
          surface: '#1e1e1e',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})
