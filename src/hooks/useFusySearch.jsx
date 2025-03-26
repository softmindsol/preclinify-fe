import React, { useState } from 'react'

const useFusySearch = () => {
    const [searchConditionName,setSearchConditionName]=useState([])

  return {
    searchConditionName,setSearchConditionName
  }
}

export default useFusySearch