import React from 'react'
import Sidebar from '../components/common/Sidebar'
import StackedBarWithSign from '../components/charts/stacked-barwith-sign'

const Performance = () => {
  return (
    <div>
          <div className="flex">
              <Sidebar />

              <div className='grid grid-col-2 gap-5'>
                <div>
                      <StackedBarWithSign/>
                </div>
                  <div>
                      <StackedBarWithSign />
                  </div>
                  <div>
                      <StackedBarWithSign />
                  </div>
                  <div>
                      <StackedBarWithSign />
                  </div>
              </div>
          </div>
    </div>
  )
}

export default Performance