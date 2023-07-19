import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectCard from './components/ProjectCard'

import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    projectList: [],
    apiStatus: apiStatusConstants.initial,
    input: categoriesList[0].id,
  }

  componentDidMount() {
    this.getData()
  }

  getInput = event => {
    this.setState({input: event.target.value}, () => this.getData())
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {input} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${input}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProjectsView = () => {
    const {projectList} = this.state

    return (
      <ul className="cards-container">
        {projectList.map(each => (
          <ProjectCard key={each.id} projectCardDetails={each} />
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {input} = this.state
    return (
      <div className="app-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="body-container">
          <select
            className="select-container"
            value={input}
            onChange={this.getInput}
          >
            {categoriesList.map(each => (
              <option key={each.id} className="option" value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </div>
    )
  }
}

export default App
