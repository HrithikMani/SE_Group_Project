import React from 'react'
import Complaints from './Complaints'

describe('<Complaints />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Complaints />)
  })
})