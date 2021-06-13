(function() {
  const $form = document.getElementById('form');

  $form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopPropagation();
    const {
      email: { value: email },
      password: { value: password },
    } = form.elements;

    try {
      await sendRequest({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(() => window.location.pathname = '/');
    } catch (error) {
      console.error(error);
    }
  });

  async function sendRequest({url, method = 'GET', ...props}) {
    try {
      let response = await fetch(url, { method, ...props });
      if (response.status >= 400) {
        throw(response.statusText);
      }
      return await response.json();
    } catch (error) {
      throw(error);
    }
  }
})();
