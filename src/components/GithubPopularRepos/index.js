import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}  

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstantsinitial,
    repositoriesData: [],
    activeLanguageFilterId: languageFiltersData[0].id,
  }
 
  componentDidMount() {
    this.getRepositories()
  }

  getRepositories = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inprogress,
    })
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.popular_repos.map(eachRepository => ({
        id: eachRepository.id,
        imageUrl: eachRepository.avatar_url,
        name: eachRepository.name,
        startsCount: eachRepository.starts_count,
        forksCount: eachRepository.forks_count,
        issuesCount: eachRepository.issues_count,
      }))
      this.setState({
        repositoriesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })     
    } else {
      this.setState({
      apiStatus: apiStatusConstants.failure,
    })  
  }
}

renderLoadingView = () => (
  <div data-testid="loader">
   <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
  </div>
)

renderFailureView = () => (
  <div classsName="failure-view-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/api-failure-view-png"
      alt="failure view"
      classsName="failure-view-image"
    />
    <h1 classsName="error-message">Something Went Wrong</h1>  
  </div>
)

renderRepositoriesListView = () => {
  const {repositoriesData} = this.state
 
  return (
    <ul classsName="Repositories-list">
      {repositoriesData.map(eachRepository => (
        <RepositoryItem
          key={eachRepository.id}
          repositoryDetails={eachRepository}
        />
      ))}                                            
    </ul>
  )  
}

renderRepositories = () => {
  const {apiStatus} = this.state
  
  switch (apiStatus) {
    case apiStatusConstants.success:
      return this.renderRepositoriesListView()
    case apiStatusConstants.failure:
      return this.renderFailureView()
    case apiStatusConstants.inProgress:
      return this.renderLoadingView()
    default:
      return null      
  }
}

setActiveLanguageFilterId = newFilterId => {
  this.setState({activeLanguageFilterId: newFilterId}, this.getRepositories)
}

renderLanguageFiltersList = () => {
  const {activeLanguageFilterId} = this.state
 
  return (
    <ul classsName="filters-list">
      {languageFiltersData.map(eachLanguageFilter => (
        <LanguageFilterItem
          key={eachLanguageFilter.id}
          isActive={eachLanguageFilter.id === activeLanguageFilterId}
          languageFilterDetails={eachLanguageFilter}
          setActiveLanguageFilterId={this.setActiveLanguageFilterId}
        />
      ))}    
    </ul>
  )  
}

render() {
  return (
    <div classsName="app-container">
      <div classsName="responsive-container">
        <h1 classsName="heading">popular</h1>
        {this.renderLanguagesFiltersList()}
        {this.renderRepositories()}
     </div>
    </div>
  )  
 } 
}


export default GithubPopularRepos




