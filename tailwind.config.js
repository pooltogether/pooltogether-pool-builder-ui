const pooltogetherTailwindReactUI = require('@pooltogether/pooltogether-react-tailwind-ui/config')
const hi = pooltogetherTailwindReactUI({
  purge: ['lib/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter'],
        // sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
})
console.log(hi);

module.exports = pooltogetherTailwindReactUI({
  purge: ['lib/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter'],
        // sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
})

// module.exports = {
//   purge: [],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }
