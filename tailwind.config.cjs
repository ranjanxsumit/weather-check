module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        // We use the new images from the /public/img/ folder
        'sunny': "url('/img/bg-sunny.jpg')",
        'rainy': "url('/img/bg-rainy.jpg')",
        'cloudy': "url('/img/bg-rainy.jpg')", // Re-using rainy for cloudy
        'night': "url('/img/bg-night.jpg')",
      }
    },
  },
  plugins: [],
}