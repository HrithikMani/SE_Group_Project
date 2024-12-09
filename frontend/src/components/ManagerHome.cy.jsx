import React from 'react'
import ManagerHome from './ManagerHome'

describe('<ManagerHome />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ManagerHome />)
  })
})