const pooltogetherTailwindReactUI = require('@pooltogether/pooltogether-react-tailwind-ui/config')

// Override the default PoolTogether tailwind config here:
module.exports = pooltogetherTailwindReactUI({
  purge: ['lib/**/*.js'],
  theme: {
    extend: {
      // fontFamily: {
        // sans: ['Inter'],
      // },
    },
  },
})
