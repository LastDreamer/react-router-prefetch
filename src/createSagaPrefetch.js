export default (props, type, payload) => new Promise(
  (resolve, reject) => props.dispatch({
    type,
    payload,
    resolve,
    reject,
  }),
);
