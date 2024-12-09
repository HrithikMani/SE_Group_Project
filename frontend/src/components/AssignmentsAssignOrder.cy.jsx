import React from 'react'
import AssignOrder from './Assignments'

describe('<AssignOrder />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AssignOrder />)
  })
})