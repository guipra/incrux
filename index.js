exports.Store = class IncruxStore {
  constructor(initialState = {}) {
    this.msgHandlers = [];
    this.state = initialState;
  }

  on(name, handler) {
    this.msgHandlers.push({ name, fn: handler });
  }

  dispatch(name, payload = {}) {
    for (let handler of this.msgHandlers) {
      if (handler.name === '*' || handler.name === name) {
        handler.fn(payload, {
          name,
          store: this,
          state: this.state,
        });
      }
    }
  }
};

exports.auto = fn => async (payload, { name, store }) => {
  try {
    store.dispatch(`${name}:start`, payload);
    store.dispatch(`${name}:success`, await fn(payload));
  }
  catch (err) {
    store.dispatch(`${name}:error`, {
      err,
      originalPayload: payload,
    });

    throw err;
  }
  finally {
    store.dispatch(`${name}:end`, payload);
  }
};
