import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { reduxStore } from './reduxStore.ts';
import { Provider } from 'react-redux';

(async function () {
  const loadingDiv = document.getElementById("loading");
  if (!loadingDiv) return;
  loadingDiv.remove();
})();
createRoot(document.getElementById('root')!).render(
  <Provider store={reduxStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  ,
)
