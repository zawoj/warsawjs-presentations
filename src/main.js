import Reveal from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import 'reveal.js/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'

import { slides } from './slides/content.js'
import { renderDeck } from './slides/render.js'
import './styles.css'

document.querySelector('.slides').innerHTML = renderDeck(slides)

const deck = new Reveal({
  hash: true,
  center: true,
  controls: true,
  controlsLayout: 'edges',
  progress: true,
  slideNumber: false,
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  width: 1920,
  height: 1080,
  margin: 0.08,
  minScale: 0.2,
  maxScale: 2,
  autoAnimate: true,
  autoAnimateUnmatched: true,
  plugins: [RevealHighlight],
})

deck.initialize()
