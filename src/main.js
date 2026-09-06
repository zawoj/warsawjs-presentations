import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';

const deck = new Reveal({
  controls: false,
  progress: false,
  slideNumber: false,
  transition: 'none',
  backgroundTransition: 'none',
});

deck.initialize();
