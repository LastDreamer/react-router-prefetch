import 'babel-polyfill';
import { configure } from '@storybook/react';

configure(() => { require('../stories/index.jsx'); }, module);
