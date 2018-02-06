import { action } from '@storybook/addon-actions';

export default (query) => new Promise((resolve, reject) => {
  action('Call api method')(query);
  setTimeout(() => {
    if (query === 'error') {
      action('Api method error')();
      reject(new Error({ message: 'Request failure' }));
    }

    action('Api method resolves')();
    resolve(query);
  }, 2000);
});
