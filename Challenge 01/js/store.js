import observe from './observer.js'

const createStore = (defaultStore = {}) => {
  const store = Object.fromEntries(
    Object
    .entries(defaultStore)
    .map(([ key, value ]) => [ key, observe(value) ])
  )

  document
    .querySelectorAll('[model]')
    .forEach(element => {
      if (!store[element.getAttribute('model')])
        return

      const value = store[element.getAttribute('model')]
      element.addEventListener('keyup', () => value.set(element.value))
      value.observe(value => element.innerHTML = value)
      value.observers()
    })

  document
    .querySelectorAll('[if]')
    .forEach(element => {
      if (!store[element.getAttribute('if')])
        return

      const defaultDisplay = element.style.display
      const value = store[element.getAttribute('if')]
      const hasElse = element.nextElementSibling?.hasAttribute('else')
      
      value.observe(value => {
        element.style.display = value
          ? defaultDisplay
          : 'none'
        
        if (hasElse) {
          element.nextElementSibling.style.display = value
            ? 'none'
            : defaultDisplay
        }
      })

      value.observers()
    })

  return store
}

export default createStore