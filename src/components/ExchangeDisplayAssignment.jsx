import React from 'react'

const ExchangeDisplayAssignment = ({ assignmentInfo }) => {
  return (
    <div>
        {assignmentInfo.title}
        {assignmentInfo.courseName}
    </div>
  )
}

export default ExchangeDisplayAssignment