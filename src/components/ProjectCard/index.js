import './index.css'

const ProjectCard = props => {
  const {projectCardDetails} = props

  const {name, imageUrl} = projectCardDetails

  return (
    <li className="card-container">
      <img src={imageUrl} alt={name} className="card-img" />
      <p className="card-name">{name}</p>
    </li>
  )
}

export default ProjectCard
