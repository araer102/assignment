# DEMO SLOT MACHINE

## Tech stack
1. Vue.js 3 
2. Dart Sass
3. Typescript

## Completed work 
- [x] Part of reel is visible
- [x] Reels have spinning effect
- [x] Reels have two fixed position: center or top/bottom
- [x] Pay table is created
- [x] On particular win condition it is displayed on pay table(blinks) and on reels
- [x] balance area is set created
- [x] balance area checks that input is numeric and between 1 to 5000
- [x] spin button is created
- [x] spin button cannot be pressed when balance is below 1
- [x] spinning is lasting at least 2 second and stops with step n + 0.5 incrementing step
- [x] each spin costs 1 coin
- [x] spin "locks" other activities
- [x] debug area created
- [x] each reel can be controlled individually
- [x] in order to debug to take effect boh position and symbol must be picked

## Additional notes
Although there is responsiveness it is not optimized for small screens.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

It is also tested that after building you can run it straight from the index.html

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
