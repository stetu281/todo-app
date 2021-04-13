module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'josefin': 'Josefin Sans, sans-serif',
    },

    colors: {
        'white': '#ffffff',
        'transparent': 'transparent',

      primary: {
        'brightBlue': 'hsl(220, 98%, 61%)',
        'gradiant1': 'hsl(192, 100%, 67%)',
        'gradiant2': 'hsl(280, 87%, 65%)',
      },
      lightTheme: {
        blue: {
          'vLight': 'hsl(236, 33%, 92%)',
          'light': 'hsl(233, 11%, 84%)',
          'dark': 'hsl(236, 9%, 61%)',
          'vDark': 'hsl(235, 19%, 35%)',
        },
        gray: {
          'vLight': 'hsl(0, 0%, 98%)',
        },
      },
      darkTheme: {
        blue: {
          'vDark': 'hsl(235, 21%, 11%)',
          'vDarkDesat': 'hsl(235, 24%, 19%)',
          'light': 'hsl(234, 39%, 85%)',
          'lightHover': 'hsl(236, 33%, 92%)',
          'dark': 'hsl(234, 11%, 52%)',
          'vDark1': 'hsl(233, 14%, 35%)',
          'vDark2': 'hsl(237, 14%, 26%)',
        },
      },
    },

    extend: {
      screens: {
        'desktop': '1440px',
      },

      backgroundImage: dark => ({
        'mobileBg': "url('/images/bg-mobile-dark.jpg')",
        'desktopBg': "url('/images/bg-desktop-dark.jpg')",
      }), 

      zIndex: {
        '-10': '-10',
      },

      letterSpacing: {
        'widest2': '0.5rem',
      },

      border: {
        '1': '1px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
