import React from 'react'
import UnassignedTasksModal from './UnassignedTasksModal'

describe('<UnassignedTasksModal />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UnassignedTasksModal />)
  })
})