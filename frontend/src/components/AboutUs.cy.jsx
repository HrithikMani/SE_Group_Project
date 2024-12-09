import React from 'react'
import AboutUs from './AboutUs'

describe('<AboutUs />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AboutUs />)
  })
})