import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  populate,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import ProjectTile from '../components/ProjectTile'
import NewProjectTile from '../components/NewProjectTile'
import NewProjectDialog from '../components/NewProjectDialog'
import classes from './ProjectsContainer.scss'

const populates = [{ child: 'createdBy', root: 'users' }]

@firebaseConnect(({ params, auth }) => [
  {
    path: 'projects',
    populates
  }
])
@connect(({ firebase, firebase: { auth } }, { params }) => ({
  projects: populate(firebase, 'projects', populates),
  auth
}))
export default class Projects extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    projects: PropTypes.object,
    firebase: PropTypes.object
  }

  state = {
    newProjectModal: false
  }

  newSubmit = newProject => {
    const { firebase: { pushWithMeta } } = this.props
    // push new project with createdBy and createdAt
    return pushWithMeta('projects', newProject)
      .then(() => this.setState({ newProjectModal: false }))
      .catch(err => {
        // TODO: Show Snackbar
        console.error('error creating new project', err) // eslint-disable-line
      })
  }

  deleteProject = ({ name }) => this.props.firebase.remove(`projects/${name}`)

  toggleModal = (name, project) => {
    let newState = {}
    newState[`${name}Modal`] = !this.state[`${name}Modal`]
    this.setState(newState)
  }

  render() {
    // Project Route is being loaded
    const { projects, auth } = this.props
    //
    if (!isLoaded(auth)) {
      return <LoadingSpinner />
    }
    if (this.props.children) return cloneElement(this.props.children, { auth })

    const { newProjectModal } = this.state

    if (!isLoaded(projects)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        {newProjectModal && (
          <NewProjectDialog
            open={newProjectModal}
            onSubmit={this.newSubmit}
            onRequestClose={() => this.toggleModal('newProject')}
          />
        )}
        <div className={classes.tiles}>
          <NewProjectTile onClick={() => this.toggleModal('newProject')} />
          {!isEmpty(projects) &&
            map(projects, (project, key) => (
              <ProjectTile
                key={`${project.name}-Collab-${key}`}
                project={project}
                onCollabClick={this.collabClick}
                onSelect={() => this.context.router.push(`${LIST_PATH}/${key}`)}
                onDelete={this.deleteProject}
              />
            ))}
        </div>
      </div>
    )
  }
}
