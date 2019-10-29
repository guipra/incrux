let incrux = require('.');

let store = new incrux.Store();

store.on('logIn', incrux.auto(async ({ user, password }) => {
  await new Promise(r => setTimeout(r, 2000));
  return { user, name: 'Derpine' };
}));

store.on('logIn:start', () => store.state.loggingIn = true);
store.on('logIn:end', () => store.state.loggingIn = false);

store.on('logIn:success', user => store.state.currentUser = user);

store.on('*', (payload, { name }) => console.log(name, payload, '=>', store.state));

store.dispatch('logIn', { user: 'derp', password: '123456' });
